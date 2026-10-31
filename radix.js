#!/usr/bin/env node
'use strict';

// A tiny 3D space-flight toy rendered entirely with terminal characters.
const readline = require('node:readline');

if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.error('Run this in an interactive terminal: node radix.js');
  process.exit(1);
}

const ESC = '\x1b[';
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const length = (v) => Math.hypot(...v);

let width = 0;
let height = 0;
let pixels = [];
let depths = [];
let lastFrame = process.hrtime.bigint();
let running = true;
let paused = false;
let tick = 0;
const keys = new Map();
const ship = { position: [0, 0, 0], yaw: 0, pitch: 0, roll: 0, speed: 8 };

// Repeatable pseudo-random positions make the scene independent of Math.random's seed.
let seed = 0x5eed;
function random() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 0x100000000;
}
const range = (a, b) => a + random() * (b - a);
const stars = Array.from({ length: 440 }, () => ({
  position: [range(-110, 110), range(-80, 80), range(-110, 110)],
  size: random(),
}));
const beacons = Array.from({ length: 13 }, (_, i) => ({
  position: [range(-55, 55), range(-40, 40), 35 + i * 32],
  size: range(2.5, 5),
  phase: range(0, Math.PI * 2),
}));

function basis(yaw, pitch, roll = 0) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const forward = [sy * cp, sp, cy * cp];
  const flatRight = [cy, 0, -sy];
  const flatUp = [-sy * sp, cp, -cy * sp];
  const cr = Math.cos(roll), sr = Math.sin(roll);
  return {
    forward,
    right: add(mul(flatRight, cr), mul(flatUp, sr)),
    up: add(mul(flatUp, cr), mul(flatRight, -sr)),
  };
}

function resize() {
  width = Math.max(20, process.stdout.columns || 80);
  height = Math.max(10, (process.stdout.rows || 24) - 3);
  pixels = Array(width * height).fill(' ');
  depths = Array(width * height).fill(Infinity);
  process.stdout.write(`${ESC}2J`);
}

function clear() {
  pixels.fill(' ');
  depths.fill(Infinity);
}

function put(x, y, glyph, depth) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const at = y * width + x;
  if (depth <= depths[at]) {
    pixels[at] = glyph;
    depths[at] = depth;
  }
}

function camera() {
  const body = basis(ship.yaw, ship.pitch, ship.roll);
  const view = basis(ship.yaw, ship.pitch * 0.8, ship.roll * 0.25);
  return {
    body,
    view,
    position: add(add(ship.position, mul(body.forward, -13)), mul(body.up, 3.5)),
  };
}

function project(point, cam) {
  const delta = sub(point, cam.position);
  const z = dot(delta, cam.view.forward);
  if (z < 0.35) return null;
  const scale = Math.min(width * 0.95, height * 2.1);
  return {
    x: width / 2 + dot(delta, cam.view.right) * scale / z,
    y: height / 2 - dot(delta, cam.view.up) * scale * 0.48 / z,
    z,
  };
}

function line(a, b, glyph, cam) {
  const p = project(a, cam), q = project(b, cam);
  if (!p || !q) return;
  const steps = Math.ceil(Math.max(Math.abs(p.x - q.x), Math.abs(p.y - q.y)) * 1.5);
  if (steps > 600) return;
  for (let i = 0; i <= steps; i++) {
    const t = steps ? i / steps : 0;
    put(p.x + (q.x - p.x) * t, p.y + (q.y - p.y) * t,
      glyph, p.z + (q.z - p.z) * t);
  }
}

function localToWorld(v, cam) {
  const b = cam.body;
  return add(ship.position,
    add(add(mul(b.right, v[0]), mul(b.up, v[1])), mul(b.forward, v[2])));
}

function drawShip(cam) {
  // Nose, cockpit, wings and twin engine pods form a simple readable silhouette.
  const vertices = [
    [0, 0, 4.2], [0, 0.75, 0.6], [0, 0, -2.8],
    [-3.3, -0.25, -1], [3.3, -0.25, -1],
    [-1.1, -0.2, -2.7], [1.1, -0.2, -2.7],
    [-0.7, -0.35, 0.6], [0.7, -0.35, 0.6],
    [-1.1, 0.45, -2.2], [1.1, 0.45, -2.2],
  ].map((v) => localToWorld(v, cam));
  const edges = [
    [0, 1], [1, 2], [0, 7], [0, 8], [7, 3], [8, 4],
    [3, 5], [4, 6], [5, 2], [6, 2], [3, 9], [4, 10],
    [9, 5], [10, 6], [5, 6], [1, 7], [1, 8],
  ];
  for (const [a, b] of edges) line(vertices[a], vertices[b], '#', cam);
  for (const i of [3, 4]) {
    const p = project(vertices[i], cam);
    if (p) put(p.x, p.y, '*', p.z - 0.01);
  }
  for (const i of [5, 6]) {
    const p = project(vertices[i], cam);
    if (p) put(p.x, p.y, ship.speed > 2 ? '@' : 'o', p.z - 0.01);
  }
}

function drawBeacon(beacon, cam) {
  const relative = sub(beacon.position, ship.position);
  if (length(relative) > 150) return;
  const angle = tick * 0.35 + beacon.phase;
  const c = Math.cos(angle), s = Math.sin(angle), r = beacon.size;
  const corners = [];
  for (const z of [-r, r]) {
    for (const [x, y] of [[-r, -r], [r, -r], [r, r], [-r, r]]) {
      corners.push(add(beacon.position, [x * c - y * s, x * s + y * c, z]));
    }
  }
  for (let i = 0; i < 4; i++) {
    line(corners[i], corners[(i + 1) % 4], '+', cam);
    line(corners[i + 4], corners[(i + 1) % 4 + 4], '+', cam);
    line(corners[i], corners[i + 4], '+', cam);
  }
}

function drawStars(cam) {
  for (const star of stars) {
    for (let axis = 0; axis < 3; axis++) {
      const span = axis === 1 ? 80 : 110;
      while (star.position[axis] - ship.position[axis] > span) star.position[axis] -= span * 2;
      while (star.position[axis] - ship.position[axis] < -span) star.position[axis] += span * 2;
    }
    const p = project(star.position, cam);
    if (p) put(p.x, p.y, p.z < 30 ? (star.size > 0.75 ? '*' : '+') : '.', p.z);
  }
}

function drawHud() {
  const center = Math.floor(width / 2);
  const horizon = Math.floor(height * 0.40);
  for (const [x, y, ch] of [[center, horizon, '+'], [center - 3, horizon, '-'],
    [center + 3, horizon, '-'], [center, horizon - 2, '|'], [center, horizon + 2, '|']]) {
    put(x, y, ch, -1);
  }
  const heading = ((ship.yaw * 180 / Math.PI) % 360 + 360) % 360;
  const hud = `SPD ${ship.speed.toFixed(1).padStart(5)}  HDG ${heading.toFixed(0).padStart(3)}  PITCH ${(ship.pitch * 180 / Math.PI).toFixed(0).padStart(3)}  XYZ ${ship.position.map(Math.round).join(',')}`;
  for (let i = 0; i < Math.min(hud.length, width); i++) put(i, 0, hud[i], -2);
  if (paused) {
    const message = 'PAUSED';
    for (let i = 0; i < message.length; i++) put(center - 3 + i, Math.floor(height / 2), message[i], -2);
  }
}

function update(dt) {
  if (paused) return;
  tick += dt;
  const active = (key) => (Date.now() - (keys.get(key) || 0) < 190 ? 1 : 0);
  const turn = active('d') + active('right') - active('a') - active('left');
  const climb = active('w') + active('up') - active('s') - active('down');
  const bank = active('e') - active('q');
  ship.yaw += turn * dt * 1.15;
  ship.pitch = clamp(ship.pitch + climb * dt * 0.9, -1.35, 1.35);
  ship.roll += bank * dt * 1.4;
  ship.roll += (clamp(-turn * 0.35, -0.35, 0.35) - ship.roll) * Math.min(1, dt * 0.7);
  ship.speed = clamp(ship.speed + (active('space') * 18 - active('x') * 24) * dt, 0, 45);
  ship.position = add(ship.position, mul(basis(ship.yaw, ship.pitch).forward, ship.speed * dt));
}

function render() {
  clear();
  const cam = camera();
  drawStars(cam);
  for (const beacon of beacons) drawBeacon(beacon, cam);
  drawShip(cam);
  drawHud();
  const rows = [];
  for (let y = 0; y < height; y++) rows.push(pixels.slice(y * width, (y + 1) * width).join(''));
  const help = 'W/S pitch  A/D yaw  Q/E roll  SPACE thrust  X brake  P pause  ESC quit';
  rows.push('-'.repeat(width));
  rows.push(help.slice(0, width).padEnd(width));
  rows.push('RADIX / BEYOND THE VOID   /   terminal flight prototype'.slice(0, width).padEnd(width));
  process.stdout.write(`${ESC}H${rows.join('\n')}`);
}

function cleanup() {
  if (!running) return;
  running = false;
  clearInterval(timer);
  process.stdout.off('resize', resize);
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  process.stdin.pause();
  process.stdout.write(`${ESC}?25h${ESC}?1049l`);
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('keypress', (_, key) => {
  if (!key) return;
  if (key.ctrl && key.name === 'c' || key.name === 'escape') {
    cleanup();
    return;
  }
  if (key.name === 'p') paused = !paused;
  keys.set(key.name, Date.now());
});
process.on('SIGINT', cleanup);
process.on('exit', () => { if (running) cleanup(); });
process.stdout.write(`${ESC}?1049h${ESC}?25l`);
resize();
process.stdout.on('resize', resize);
const timer = setInterval(() => {
  const now = process.hrtime.bigint();
  const dt = clamp(Number(now - lastFrame) / 1e9, 0, 0.05);
  lastFrame = now;
  update(dt);
  render();
}, 33);
