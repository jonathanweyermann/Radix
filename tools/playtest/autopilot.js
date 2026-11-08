// Radix autopilot. Injected by playtest.mjs into index.html?debug, it flies the ship objective to objective with the
// game's own controls (the touch stick, thrust, brake and fire), shooting objective targets and the padlocks on chain
// gates in its way. In 'god' mode the ship takes no damage and only fights what the route needs, which checks that a
// sector can be finished by flying it. In 'combat' mode damage is on and it fights whatever shoots at it, which gives a
// rough feel for where a sector is hard.
//
// Routes are planned on a 3D grid over the sector's open space: one node per map cell across, one every 2.5 units up.
// A node is open when the ship fits there with room to spare. The planner runs Dijkstra from the ship to the nearest
// node that satisfies the goal (in range of a target with a clear shot, inside a reach radius, or at the exit), then
// the pilot flies the path, cutting corners wherever the straight line is clear.
(() => {
  const R = window.radix;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  const DT = 1 / 60, BOLT_SPEED = 140;

  // ---- The planning grid --------------------------------------------------------------------------------------------
  let G = null;
  function buildGrid() {
    const g = R.grid, W = g.w, D = g.d, { open, floorY } = R.cells;
    let lo = Infinity;
    for (let gz = 0; gz < D; gz++) for (let gx = 0; gx < W; gx++) {
      const i = gz * W + gx;
      if (open[i] && Number.isFinite(floorY[i])) lo = Math.min(lo, floorY[i]);
    }
    if (Number.isFinite(g.spaceFloor)) lo = Math.min(lo, g.spaceFloor);
    const y0 = lo + 2, dy = 2.5, H = Math.max(1, Math.ceil((g.top - 2 - y0) / dy) + 1), N = W * D * H;
    G = { W, D, H, N, y0, dy, x0: g.x0, z0: g.z0, cell: g.cell, state: new Uint8Array(N), cost: new Float32Array(N), from: new Int32Array(N), closed: new Uint8Array(N) };
  }
  const nodePos = (n) => {
    const gx = n % G.W, gz = Math.floor(n / G.W) % G.D, k = Math.floor(n / (G.W * G.D));
    return [G.x0 + (gx + 0.5) * G.cell, G.y0 + k * G.dy, G.z0 + (gz + 0.5) * G.cell];
  };
  // Room to spare: the ship fits a little wider than it needs, and a little above and below.
  const roomy = (p) => R.shipFits(p, 1.6) && !R.insideGirder(p, 1.8) && R.cells.freeAt(p[0], p[1] + 1.3, p[2], 1) && R.cells.freeAt(p[0], p[1] - 1.3, p[2], 1);
  const flyable = (p) => R.shipFits(p, 1.0) && !R.insideGirder(p, 1.2);
  function nodeFree(n) {
    const s = G.state[n];
    if (s) return s === 1;
    const ok = roomy(nodePos(n));
    G.state[n] = ok ? 1 : 2;
    return ok;
  }
  function nodeNear(p) {
    const gx = Math.floor((p[0] - G.x0) / G.cell), gz = Math.floor((p[2] - G.z0) / G.cell), k = Math.round((p[1] - G.y0) / G.dy);
    let best = -1, bestGap = Infinity;
    for (let r = 0; r <= 3 && best < 0; r++)
      for (let dk = -r * 2; dk <= r * 2; dk++) for (let dz = -r; dz <= r; dz++) for (let dx = -r; dx <= r; dx++) {
        const x = gx + dx, z = gz + dz, kk = k + dk;
        if (x < 0 || z < 0 || kk < 0 || x >= G.W || z >= G.D || kk >= G.H) continue;
        const n = (kk * G.D + z) * G.W + x;
        if (!nodeFree(n)) continue;
        const gap = dist(nodePos(n), p);
        if (gap < bestGap) { bestGap = gap; best = n; }
      }
    return best;
  }
  // Ten neighbours: the eight around in the same layer, and straight up and down.
  const STEPS = [];
  for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) STEPS.push([dx, dz, 0]);
  STEPS.push([0, 0, 1], [0, 0, -1]);
  // A*: `toward` estimates the distance left to the goal, which keeps the search from flooding the open sky.
  function plan(fromPos, isGoal, toward = () => 0, limit = 2500000) {
    const start = nodeNear(fromPos);
    if (start < 0) return null;
    const { cost, from, closed } = G;
    cost.fill(Infinity); from.fill(-1); closed.fill(0);
    const heap = [], push = (n, c) => {
      heap.push([c + 2 * toward(nodePos(n)), n, c]);
      for (let i = heap.length - 1; i > 0;) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; }
    }, pop = () => {
      const top = heap[0], last = heap.pop();
      if (heap.length) {
        heap[0] = last;
        for (let i = 0; ;) {
          const l = i * 2 + 1, r = l + 1; let m = i;
          if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
          if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
          if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m;
        }
      }
      return top;
    };
    cost[start] = 0; push(start, 0);
    let seen = 0;
    while (heap.length && seen < limit) {
      const [, n, c] = pop();
      if (closed[n] || c > cost[n]) continue;
      closed[n] = 1; seen++;
      const p = nodePos(n);
      if (isGoal(p)) {
        const path = [];
        for (let m = n; m >= 0; m = from[m]) path.push(nodePos(m));
        return { path: path.reverse(), seen };
      }
      const gx = n % G.W, gz = Math.floor(n / G.W) % G.D, k = Math.floor(n / (G.W * G.D));
      for (const [dx, dz, dk] of STEPS) {
        const x = gx + dx, z = gz + dz, kk = k + dk;
        if (x < 0 || z < 0 || kk < 0 || x >= G.W || z >= G.D || kk >= G.H) continue;
        const m = (kk * G.D + z) * G.W + x;
        if (!nodeFree(m)) continue;
        // A diagonal step needs both of the side cells open too, so the path never clips a corner.
        if (dx && dz && (!nodeFree((k * G.D + gz) * G.W + x) || !nodeFree((k * G.D + z) * G.W + gx))) continue;
        // Updraft columns push the ship up: going down one is slow, so the planner keeps out of them unless there is no other way.
        const q = nodePos(m), lift = R.cells.ventAt(q[0], q[2], q[1]) && dk <= 0 ? G.cell * 6 : 0;
        const step = (dk ? G.dy : (dx && dz ? G.cell * Math.SQRT2 : G.cell)) + lift, next = c + step;
        if (!closed[m] && next < cost[m]) { cost[m] = next; from[m] = n; push(m, next); }
      }
    }
    return { path: null, seen };
  }
  const segmentClear = (a, b) => {
    const steps = Math.ceil(dist(a, b) / 1.5);
    for (let i = 1; i <= steps; i++) if (!flyable(add(a, mul(sub(b, a), i / steps)))) return false;
    return true;
  };

  // ---- State ---------------------------------------------------------------------------------------------------------
  let S = null;
  const ship = () => R.ship;
  const live = (e) => e && e.hp > 0;
  const zoneAt = (p) => (R.level.zones || []).find(({ area: [x0, z0, x1, z1] }) => p[0] >= x0 && p[0] <= x1 && p[2] >= z0 && p[2] <= z1);
  const gateOf = (lock) => R.gates.find(g => g.locks.includes(lock));
  function hull() { return Math.round(R.health); }
  function event(type, detail = {}) {
    const pos = ship().position.map(v => Math.round(v));
    const entry = { type, t: +S.t.toFixed(1), objective: R.objective, goal: R.objectives[R.objective]?.text || null, zone: zoneAt(ship().position)?.name || null,
      health: hull(), shield: Math.round(R.shield), pos, ...detail };
    S.log.push(entry);
    return entry;
  }

  function begin(index, mode = 'god') {
    R.debugFlags.hold = true; R.debugFlags.god = mode === 'god';
    R.startSector(index); R.fly();
    Object.assign(R.touch, { steerX: 0, steerY: 0, thrust: false, brake: false, fire: false }); R.keys.clear(); R.firing = false;
    buildGrid();
    S = { index, mode, t: 0, log: [], path: null, wp: 0, task: null, replans: 0, stalled: 0, progressAt: 0, bestLeft: Infinity, zones: new Set(),
      lastShot: -99, legStart: { t: 0, health: 100, shield: R.shield }, legs: [], ignore: new Map(), lastObjective: R.objective, aimedAt: new Set(),
      sealedSum: sealedCount(), done: null, fightStart: 0, fightFoe: null, firedAt: 0, foeHp: 0 };
    const goals = R.objectives.map(g => g.text);
    return { title: R.level.title, name: R.level.name, index, mode, objectives: goals, start: event('start') };
  }
  function sealedCount() { let n = 0; for (const v of R.sealed) n += v; return n; }

  // ---- Choosing what to do next --------------------------------------------------------------------------------------
  // The current goal as a task: a thing to shoot (with where it is), a place to reach, or the exit.
  function goalTask() {
    const goal = R.objectives[R.objective];
    if (!goal || goal.kind === 'exit') return { kind: 'reach', at: R.exitCenter(), radius: 4, label: 'EXIT' };
    if (goal.kind === 'reach') return { kind: 'reach', at: goal.at, radius: goal.radius * 0.7, label: goal.text };
    if (goal.kind === 'gate') {
      const gate = R.gates[goal.gate], lock = gate.locks.find(live);
      return lock ? { kind: 'shoot', target: lock, lock: true, label: goal.text } : { kind: 'wait', label: goal.text };
    }
    // Destroy: the nearest target left, or the aegis shielding it.
    const left = goal.enemies.filter(live).sort((a, b) => dist(a.position, ship().position) - dist(b.position, ship().position));
    if (!left.length) return { kind: 'wait', label: goal.text };
    const target = left[0];
    if (live(target.shieldedBy)) return { kind: 'shoot', target: target.shieldedBy, label: 'AEGIS SHIELDING ' + (target.title || target.type) };
    return { kind: 'shoot', target, label: target.title || target.type.toUpperCase() };
  }
  const shootRange = (task) => task.lock ? 26 : task.close ? 16 : 34;
  const towardTask = (task) => task.kind === 'reach'
    ? (p) => Math.max(0, dist(p, task.at) - task.radius)
    : (p) => Math.max(0, dist(p, task.target.position) - shootRange(task));
  const goalTest = (task) => task.kind === 'reach'
    ? (p) => dist(p, task.at) < task.radius
    : (p) => { const at = task.target.position; return dist(p, at) < shootRange(task) && dist(p, at) > 5 && R.lineOfSight(at, p); };

  // When the goal can't be reached, the way is probably shut by a chain gate: break the nearest one the ship can get to.
  function lockTask() {
    const locks = R.gates.filter(g => g.kind === 'chain' && !g.opening).flatMap(g => g.locks.filter(live));
    if (!locks.length) return null;
    const result = plan(ship().position, (p) => locks.some(l => dist(p, l.position) < 26 && R.lineOfSight(l.position, p)),
      (p) => Math.max(0, Math.min(...locks.map(l => dist(p, l.position))) - 26), 600000);
    if (!result?.path) return null;
    const end = result.path[result.path.length - 1];
    const lock = locks.filter(l => dist(end, l.position) < 26 && R.lineOfSight(l.position, end)).sort((a, b) => dist(end, a.position) - dist(end, b.position))[0];
    return { kind: 'shoot', target: lock, lock: true, label: 'CHAIN GATE LOCK', path: result.path, detour: true };
  }

  function replan(why) {
    const task = goalTask();
    S.task = task; S.path = null; S.wp = 0; S.bestLeft = Infinity; S.progressAt = S.t; S.firedAt = 0; S.planAt = task.target ? task.target.position.slice() : null;
    if (task.kind === 'wait') return true;
    // Already in place?
    if (goalTest(task)(ship().position)) { S.path = [ship().position.slice()]; return true; }
    // A quick search first: A* finds a reachable goal fast. If it fails, look for a chain gate to break, and only then
    // search everything the ship can reach.
    const quick = plan(ship().position, goalTest(task), towardTask(task), 300000);
    if (quick?.path) { S.path = quick.path; return true; }
    const detour = lockTask();
    if (detour) { S.task = detour; S.path = detour.path; event('detour', { why: why || 'goal not reachable', toward: task.label }); return true; }
    const full = plan(ship().position, goalTest(task), towardTask(task));
    if (full?.path) { S.path = full.path; return true; }
    // A gate still swinging open may be the way through: wait for it.
    if (R.gates.some(g => g.opening && g.open < 1)) { S.task = { kind: 'wait', label: 'GATE OPENING' }; return true; }
    return false;
  }

  // ---- Flying ----------------------------------------------------------------------------------------------------------
  function steer(point, speed) {
    const s = ship(), d = sub(point, s.position);
    const yawTo = Math.atan2(d[0], d[2]), pitchTo = clamp(Math.atan2(d[1], Math.hypot(d[0], d[2])), -1.3, 1.3);
    const ey = wrap(yawTo - s.yaw), ep = pitchTo - s.pitch;
    R.touch.steerX = clamp(ey * 2.5, -1, 1);
    R.touch.steerY = clamp(-ep * 2.5, -1, 1);
    const want = Math.abs(ey) + Math.abs(ep) > 0.6 ? Math.min(speed, 4) : speed;
    R.touch.thrust = s.speed < want - 1; R.touch.brake = s.speed > want + 1;
    return Math.abs(ey) + Math.abs(ep);
  }
  function followPath() {
    const s = ship(), path = S.path;
    // Cut ahead to the farthest point on the path in a clear straight line, a few times a second.
    if (Math.round(S.t * 60) % 6 === 0) {
      S.recover = null;
      let found = false;
      for (let j = Math.min(path.length - 1, S.wp + 14); j >= S.wp; j--) if (segmentClear(s.position, path[j])) { S.wp = j; found = true; break; }
      // Knocked off the path onto a corner: head for the nearest path point in clear view, or else the middle of this cell.
      if (!found) {
        const seen = path.map((q, j) => [j, dist(q, s.position)]).filter(([j, d]) => d < 25 && segmentClear(s.position, path[j])).sort((a, b) => a[1] - b[1])[0];
        if (seen) S.wp = seen[0];
        else { const n = nodeNear(s.position); if (n >= 0) S.recover = nodePos(n); }
      }
    }
    if (S.wp < path.length - 1 && dist(s.position, path[S.wp]) < 3) S.wp++;
    if (S.recover) { steer(S.recover, 4); if (dist(s.position, S.recover) < 1.5) S.recover = null; return false; }
    const aim = path[S.wp], left = dist(s.position, aim) + (path.length - 1 - S.wp) * G.cell * 0.8;
    // Slow down for the last stretch and in tight places.
    const tight = !R.cells.freeAt(s.position[0], s.position[1], s.position[2], 4);
    // Inside an updraft only real speed gets the ship down through it.
    const inLift = R.cells.ventAt(s.position[0], s.position[2], s.position[1]);
    const speed = inLift ? 34 : clamp(left * 0.8, 6, tight ? 14 : S.mode === 'god' ? 34 : 26);
    steer(aim, speed);
    if (left < S.bestLeft - 2) { S.bestLeft = left; S.progressAt = S.t; }
    return S.wp >= path.length - 1 && dist(s.position, aim) < 3.5;
  }
  function leadPoint(enemy) {
    const s = ship(), t = dist(enemy.position, s.position) / BOLT_SPEED, v = enemy.velocity || [0, 0, 0];
    return add(enemy.position, mul(v, t));
  }
  // Point at the target, hold still and fire when the nose is on it.
  function attack(target) {
    const s = ship(), aimAt = target.velocity ? leadPoint(target) : target.position, d = sub(aimAt, s.position);
    const yawTo = Math.atan2(d[0], d[2]), pitchTo = Math.atan2(d[1], Math.hypot(d[0], d[2]));
    const ey = wrap(yawTo - s.yaw), ep = pitchTo - s.pitch;
    R.touch.steerX = clamp(ey * 3, -1, 1); R.touch.steerY = clamp(-ep * 3, -1, 1);
    const gap = dist(target.position, s.position), want = gap > 30 ? 6 : gap < 10 ? 0 : 2;
    R.touch.thrust = s.speed < want - 0.5; R.touch.brake = s.speed > want + 0.5;
    const onTarget = Math.abs(ey) < Math.max(0.03, 1.2 / gap) && Math.abs(ep) < Math.max(0.03, 1.2 / gap) && R.lineOfSight(target.position, s.position);
    R.firing = onTarget;
    return onTarget;
  }
  // A dogfight: keep sliding sideways and up and down in a slow box while firing, so return fire has to track the ship.
  const DODGE = ['a', 'd', 'w', 's'];
  function dodge(on) {
    for (const key of DODGE) R.keys.delete(key);
    if (!on) return;
    // Only slide toward open space: walls cost hull.
    const s = ship(), right = [Math.cos(s.yaw), 0, -Math.sin(s.yaw)], dirs = { a: mul(right, -1), d: right, w: [0, 1, 0], s: [0, -1, 0] };
    const roomFor = (key) => [2.5, 5, 7].every(r => flyable(add(s.position, mul(dirs[key], r))));
    const order = ['a', 'w', 'd', 's'], start = Math.floor(S.t / 1.1) % 4;
    for (let i = 0; i < 4; i++) { const key = order[(start + i) % 4]; if (roomFor(key)) { R.keys.add(key); return; } }
  }
  function fight(foe) {
    const s = ship(), aimAt = leadPoint(foe), d = sub(aimAt, s.position);
    const ey = wrap(Math.atan2(d[0], d[2]) - s.yaw), ep = Math.atan2(d[1], Math.hypot(d[0], d[2])) - s.pitch;
    R.touch.steerX = clamp(ey * 3, -1, 1); R.touch.steerY = clamp(-ep * 3, -1, 1);
    const gap = dist(foe.position, s.position), want = gap > 35 ? 10 : gap < 15 ? 0 : 4;
    R.touch.thrust = s.speed < want - 0.5; R.touch.brake = s.speed > want + 0.5;
    dodge(true);
    R.firing = Math.abs(ey) < Math.max(0.06, 2.5 / gap) && Math.abs(ep) < Math.max(0.06, 2.5 / gap) && R.lineOfSight(foe.position, s.position);
  }

  // In combat mode, anything shooting at the ship nearby is dealt with first.
  function threat() {
    if (S.mode !== 'combat') return null;
    const s = ship();
    let best = null, bestGap = 55;
    for (const e of R.enemies) {
      if (!live(e) || e.hacked || e.cloaked || e.target || ['pylon', 'egg', 'mine', 'mite', 'relay', 'node', 'core'].includes(e.type)) continue;
      if ((S.ignore.get(e) || 0) > S.t) continue;
      const gap = dist(e.position, s.position);
      if (gap < bestGap && R.lineOfSight(e.position, s.position)) { bestGap = gap; best = e; }
    }
    return best;
  }

  // ---- The main loop -------------------------------------------------------------------------------------------------
  // Runs the game until something worth a screenshot happens, the time runs out, or about four seconds of real time pass.
  function run(maxSeconds = 30, limitSeconds = 900) {
    if (S.done) return { done: S.done, ...S.log[S.log.length - 1] };
    const wallStart = performance.now(), until = S.t + maxSeconds;
    if (!S.task) if (!replan()) return finish('stuck', { why: 'no route to the first goal' });
    while (S.t < until && performance.now() - wallStart < 4000) {
      // Finished, dead, or out of time?
      if (R.warping) return finish('exit', { time: Math.round(R.sectorTime), kills: R.kills });
      if (R.destroyed) return finish('died', { lastLeg: S.task?.label, foe: S.fightFoe?.type || null });
      if (!S.lowHull && hull() < 35) { S.lowHull = true; S.lastShot = S.t; return { shot: true, ...event('low-hull', { foe: S.fightFoe?.type || null }) }; }
      if (S.t > limitSeconds) return finish('timeout', { why: `still on objective ${R.objective + 1} after ${limitSeconds}s` });
      // An objective done: note the leg and move on.
      if (R.objective !== S.lastObjective) {
        const leg = { objective: S.lastObjective, goal: R.objectives[S.lastObjective]?.text, seconds: +(S.t - S.legStart.t).toFixed(1),
          hullLost: S.legStart.health - hull(), shieldLost: Math.max(0, Math.round(S.legStart.shield - R.shield)) };
        S.legs.push(leg); S.legStart = { t: S.t, health: hull(), shield: R.shield }; S.lastObjective = R.objective;
        R.firing = false;
        if (!replan()) return finish('stuck', { why: `no route to ${goalTask().label}` });
        S.lastShot = S.t;
        return { shot: true, ...event('objective', { completed: leg.goal, seconds: leg.seconds }) };
      }
      // A gate opened somewhere: the open space changed, so forget what was learned about it.
      const sealedNow = sealedCount();
      if (sealedNow !== S.sealedSum) { S.sealedSum = sealedNow; G.state.fill(0); replan('gate opened'); }
      // A new named area.
      const zone = zoneAt(ship().position);
      if (zone && !S.zones.has(zone.name)) { S.zones.add(zone.name); S.lastShot = S.t; return { shot: true, ...event('zone', { name: zone.name }) }; }

      if (S.unstick && S.t < S.unstick.until) {
        R.keys.add(S.unstick.key);
        if (live(S.unstick.foe)) attack(S.unstick.foe); else { R.firing = false; R.touch.thrust = false; R.touch.brake = true; }
        R.step(DT); S.t += DT;
        continue;
      }
      if (S.unstick) { R.keys.delete(S.unstick.key); S.unstick = null; R.firing = false; }
      const foe = threat();
      if (foe) {
        if (S.fightFoe !== foe) { S.fightFoe = foe; S.fightStart = S.t; }
        fight(foe);
        if (S.t - S.fightStart > 15) { S.ignore.set(foe, S.t + 20); S.fightFoe = null; }
      } else {
        if (S.fightFoe) dodge(false);
        S.fightFoe = null;
        const task = S.task;
        if (task.kind === 'wait') {
          R.firing = false; R.touch.thrust = false; R.touch.brake = true; R.touch.steerX = 0; R.touch.steerY = 0;
          if (S.t - S.progressAt > 4) replan();
        } else if (task.kind === 'shoot' && !live(task.target)) {
          R.firing = false; replan();
        } else {
          const arrived = S.path && (S.wp >= S.path.length - 1) && dist(ship().position, S.path[S.path.length - 1]) < 3.5;
          const inPlace = task.kind === 'shoot' && goalTest(task)(ship().position);
          if (task.kind === 'shoot' && arrived && !inPlace && !(S.firedAt && R.lineOfSight(task.target.position, ship().position))) {
            // At the end of the path but the shot is blocked (drifted onto a corner, or the target moved): settle onto the
            // planned spot, and plan again if that doesn't do it.
            R.firing = false;
            const end = S.path[S.path.length - 1];
            if (dist(ship().position, end) > 1.2) steer(end, 3);
            else if (S.t - S.progressAt > 2) replan('no clear shot');
          } else if (task.kind === 'shoot' && (inPlace || arrived)) {
            const onTarget = attack(task.target);
            if (onTarget) {
              if (!S.firedAt) { S.firedAt = S.t; S.foeHp = task.target.hp; }
              if (!S.aimedAt.has(task.target)) {
                S.aimedAt.add(task.target); S.lastShot = S.t;
                return { shot: true, ...event('target', { name: task.label, gap: Math.round(dist(task.target.position, ship().position)) }) };
              }
            }
            // Firing for a while with no effect: get closer, or it was out of reach after all.
            if (S.firedAt && S.t - S.firedAt > 6) {
              if (task.target.hp < S.foeHp) { S.firedAt = S.t; S.foeHp = task.target.hp; }
              else { S.firedAt = 0; task.close = true; event('no-damage', { name: task.label }); const r = plan(ship().position, goalTest(task), towardTask(task)); S.path = r?.path || S.path; S.wp = 0; }
            }
            if (!inPlace && S.planAt && dist(task.target.position, S.planAt) > 8) replan('target moved');
          } else if (task.kind === 'reach' && dist(ship().position, task.at) < task.radius) {
            R.firing = false; steer(task.at, 4);
          } else if (S.path) {
            R.firing = false; S.firedAt = 0;
            followPath();
          }
        }
        // No progress for a while: plan again from here, and give up after enough tries.
        if (S.task.kind !== 'wait' && !S.firedAt && S.t - S.progressAt > 6) {
          S.stalled++;
          // Note what is next to the ship: an enemy hovering in the way is the usual culprit.
          const blocker = R.enemies.filter(e => live(e) && dist(e.position, ship().position) < 14).sort((a, b) => dist(a.position, ship().position) - dist(b.position, ship().position))[0];
          event('stalled', { tries: S.stalled, toward: S.task.label, blocker: blocker ? blocker.type : null });
          if (S.stalled >= 6) return finish('stuck', { why: `no progress toward ${S.task.label}` });
          // Shake loose: shoot whatever is in the way and slide sideways or up for a moment.
          S.unstick = { until: S.t + 2.5, key: ['a', 'd', 'w'][S.stalled % 3], foe: blocker || null };
          if (!replan('stalled')) return finish('stuck', { why: `no route to ${goalTask().label}` });
        }
        if (S.t - S.progressAt < 1 && S.stalled && S.bestLeft < 10) S.stalled = 0;
      }
      R.step(DT); S.t += DT;
      if (S.t - S.lastShot > 30) { S.lastShot = S.t; return { shot: true, ...event('flight') }; }
    }
    return { tick: true, t: +S.t.toFixed(1) };
  }
  function finish(type, detail) {
    R.firing = false; Object.assign(R.touch, { steerX: 0, steerY: 0, thrust: false, brake: false });
    const leg = { objective: R.objective, goal: R.objectives[R.objective]?.text || 'EXIT', seconds: +(S.t - S.legStart.t).toFixed(1), hullLost: S.legStart.health - hull(),
      shieldLost: Math.max(0, Math.round(S.legStart.shield - R.shield)), ended: type };
    S.legs.push(leg);
    const entry = event(type, detail);
    S.done = type;
    return { shot: true, done: type, ...entry };
  }
  function report() { return { title: R.level.title, mode: S.mode, result: S.done, seconds: +S.t.toFixed(1), legs: S.legs, log: S.log }; }

  window.autopilot = { begin, run, report, plan, grid: () => G, state: () => S, roomy, flyable, segmentClear };
})();
