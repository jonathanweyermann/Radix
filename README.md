# Radix / Beyond the Void

A tiny dependency-free 3D space-flight prototype drawn with terminal characters.

## Run in a browser

Open `index.html` in a browser that supports WebGL 2. No installation or web server is needed. The game opens on a menu where you can continue, start a new game, pick a difficulty, or choose any sector you have reached. Click the game to capture the mouse; Esc releases it and opens the menu, which pauses the game.

**Difficulty:** Easy spawns about two thirds as many enemies and lets 60% of incoming damage through; Hard spawns 30% more enemies and deals 35% more damage. Changing it mid-flight changes damage at once and enemy numbers from the next sector you start.

**Progress** is saved in the browser (localStorage) as you enter each sector: the last sector you flew, your difficulty, and the cannon and missiles you last entered each sector with. Picking a sector from the menu starts it with that loadout and a full hull. Move the mouse to steer, with up/down inverted. Hold the left mouse button to fire the cannon, and press the right mouse button or C to launch a seeker missile. The weapons make short synthesized sounds.

The keyboard controls are W/A/S/D to strafe up, left, down, and right, Up to pitch down, Down to pitch up, Left/Right to turn, Q/E to roll, X to accelerate, Z to brake, F/J to fire, C to launch a missile, P to pause, and M to toggle music. Space also accelerates. Shoot hostile ships and the explosive barrels on the floor; barrel blasts also damage nearby enemies. The sky is visible, but a flight boundary prevents escape above the walls. Solid walls block your view and shots. The cockpit shows radar, shield, hull, speed, heading, altitude, sector, cannon level, missile count, target counts, and the name of the current area. A blue shield soaks up the first few hits before the hull takes damage; it holds about a third of a full hull, starts recharging four seconds after the last hit, and refills at 7% a second. Hits that only reach the shield flash the screen edge blue. If the hull reaches zero you are destroyed; press R to restart the current sector with the cannon and missiles you entered it with.

### Sectors

There are ten sectors. Each ends at a green warp gate; fly through it to move on to the next sector. The radar always shows the gate's bearing as a blinking green dot, pinned to the rim when the gate is out of range. Each warp repairs 25% of the hull and refills the shield, and your cannon upgrades and missiles carry over. After the tenth sector, press R to fly again from the start.

1. **DELTA-9 Relay Station**: a dark, enclosed computer station with walls of consoles. From the entry hall, a chained gate opens into a control hub. Routes then run east across a sludge courtyard on a narrow walkway, through a computer annex and pump hall, or west through a yard with a hidden armory. Both routes lead to a long gallery, and a last chained gate opens the way to the uplink court and its warp gate.
2. **DELTA-9 Toxin Refinery**: a rusted refinery built around sludge. Walkways cross a settling basin, and chained gates lead east to a filter room and north to the refinery hall with its sludge vats. The tank yard to the west has its own chained gate into the hall. Two secret panels hide supply caches, and a final gate opens onto the outflow pool and its warp gate.
3. **EPSILON-5 Cryo Vaults**: icy, mostly roofed vaults. A chained corridor opens into a pillared vault hall, with stairs climbing to an upper gallery that overlooks a deep cold well. Another chained gate leads into a chamber lined with rows of cryo pods. A side route runs through a west cold store with a secret frost cache and a long duct to a third gate. A final chained duct opens into the exit vault.
4. **EPSILON-5 Magma Works**: an open-air foundry over molten slag. Causeways cross a lava field, and three flues (central, east and west), each sealed by a chained gate, lead into a smelter yard around a lava crucible. A secret panel in the east flue hides a cache. Stairs climb to the upper works, and a chained vent shaft leads up to the exit deck.
5. **EPSILON-5 Signal Spire**: a night-time climb. A tunnel cuts through the base of a glowing spire in the middle of an open plaza. Stairs rise to terraces split by a sludge moat and a bridge, then to an upper terrace. From there a chained tower bore and a chained west bore both lead into the summit hall. A last chained gate opens the stairs to the summit deck, and a secret panel off the plaza hides a supply cache.
6. **TAU-3 Drowned Docks**: an overcast harbor flooded with sludge. Piers cross the harbor basin, with a chained hangar to the west and a chained fuel depot to the east, where a secret panel hides a cache. A chained channel leads to a dry dock around a raised hull deck under crane gantries, and stairs climb to the crane deck and a last chained bore to the launch pad.
7. **TAU-3 Hive Warrens**: a dark, enclosed maze of tubes at different heights. From the brood chamber, a west climb leads through a high gallery and shaft, and an east tube leads through a sludge-filled egg vault. Both routes end at chained gates into the nest, a tall chamber around a glowing core. A chained stair climbs to the upper warren, which has a secret royal cache, and a breach tunnel opens to the sky and the warp gate.
8. **TAU-3 Tether Anchor**: a bright, high-altitude climb. The anchor ring circles a lava pit around the glowing tether, with a chained maintenance bay and secret cache to the east. A chained lift bore and a chained west ramp both climb to the spoke deck. From there you fly across a deep lava gap, between girders, to the summit ring and a chained docking bore up to the cradle.
9. **SIGMA-4 Refinery Terraces**: open-air terraces that climb from a canyon floor past a glowing slag pit, with stairs to the west and east terraces. A climbing pipe tunnel leads to the upper terrace, and more stairs lead to the summit gate.
10. **OMEGA Core Breach**: a covered drop chamber leads to an open arena around a reactor core with raised balconies. Two bores at different heights lead to the vast crown hall, and a final staircase climbs to the escape deck.

**Chained gates** block some routes. Each gate has two glowing padlocks chained across its face, and shooting both apart sinks the gate into the floor. On the radar, closed gates show as orange outlines. **Secret panels** look almost like the surrounding wall apart from a faint glowing seam; shoot one a few times and it slides away to reveal a hidden room with supplies. **Toxic sludge** and **molten slag** damage the ship if you fly within a few units of the surface; slag burns harder.

The levels are built on a grid of 5-unit cells. Each cell has its own floor height, and covered cells have a ceiling with tunnel lights, so the ship must fit between floor and ceiling. Steel girders cross many routes at different heights, so you have to fly over, under or between them. Hazard-striped posts with amber beacons mark doorways and pillar corners, and the radar draws the walls around you.

### Enemies and powerups

- **Drones** (red) hover in place and fire single bolts.
- **Hunters** (amber, dart-shaped) are fragile, but once they see you they chase you and ram.
- **Wardens** (violet, large) take eight hits and fire three-bolt spreads.
- **Strikers** (teal, wide-winged) launch slow homing missiles. A blinking MISSILE WARNING shows when one is close, and you can shoot incoming missiles down.
- **Sentries** (yellow) are turrets mounted on striped pylons. They fire three-shot bursts and take five hits.

Pick up a green crystal to repair 35% of the hull. An amber crystal upgrades the neutron cannon: Mk II fires faster, Mk III adds twin barrels, and Mk IV fires three heavier bolts. Amber crystals collected at Mk IV repair 15% of the hull instead.

A pink crystal adds six seeker missiles (up to 24). Keep an enemy near the reticle and an amber LOCKING square closes in on it, turning into a red LOCKED square once the lock is held. A missile fired then homes on that enemy, and a green TRACKING square follows the target until the missile hits. Missiles hit hard, damage nearby enemies, and set off barrels; if nothing is locked, they fly straight.

### Textures

All surfaces use textures painted in JavaScript at load time, with no image files. Each texture has a color layer, a height layer that becomes a normal map, and a glow layer for lights. The wall panels come in several variants, including vents, sealed doors, pipes, windows, and signs. Floors include tread plate, glowing grates, landing pads, and cracked foundry plates. The WebGL renderer adds perspective-correct mapping, mipmaps, a low sun, sky light, the ship's headlight, and colored light from shots and explosions.

### Music

The original industrial track is synthesized in JavaScript and starts after your first click or key press. It plays in D minor at 122 BPM and cycles through intro, drive, assault, and breakdown sections. The instruments include kick, snare, hi-hats, metallic hits, a filtered bass, pads, an arpeggio, and a lead melody, with reverb and echo. When hostile drones are near, the music adds extra hi-hats and an arpeggio, and the bass gets brighter.

## Run in a terminal

```sh
node radix.js
```

Use an interactive terminal at least 60 columns wide. Hold **W/S** or the up/down arrows to pitch, **A/D** or the left/right arrows to turn, **Q/E** to roll, **Space** to accelerate, and **X** to brake. **P** pauses; **Esc** or **Ctrl+C** quits. The browser version uses different keys: **W/A/S/D** strafe, **Up** pitches down, **Down** pitches up, and **X** accelerates.

The ship, stars, and rotating wireframe beacons are projected from 3D coordinates into the terminal. This is a starting point for a larger game.
