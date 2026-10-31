# Radix / Beyond the Void

A tiny dependency-free 3D space-flight prototype drawn with terminal characters.

## Run in a browser

Open `index.html` in a browser that supports WebGL 2. No installation or web server is needed. The game opens on a menu where you can continue, start a new game, pick a difficulty, choose any sector you have reached, and see the arsenal tier list. Click the game to capture the mouse; Esc releases it and opens the menu, which pauses the game.

**Phones and tablets:** play it at https://jonathanweyermann.github.io/Radix/ with the device held sideways. On touch screens the game shows on-screen controls and a smaller cockpit. Touch anywhere on the left half of the screen and drag to steer; the stick appears under your thumb and reads the direction from where you first touched. Push up to climb, and the nose eases back to level when you let go. The PITCH button in the menu flips this to the mouse's inverted style. Hold THRUST or BRAKE to change speed, which stays where you leave it. Hold FIRE to shoot, and tap MSL to launch a missile. MAP and MENU sit at the top right, and the menu has a FULL SCREEN button. Strafing is keyboard only. Switching apps pauses the game. Add `?touch` to the address to force the touch controls on, `?desktop` to turn them off, or `?debugtouch` to show the raw touch coordinates on screen.

**Difficulty:** Easy spawns about two thirds as many enemies, lets 60% of incoming damage through, and enemies aim where you are. Normal enemies aim partly ahead of a moving ship. Hard spawns 30% more enemies, deals 35% more damage, and enemies lead their shots almost fully. Changing it mid-flight changes damage and aim at once, and enemy numbers from the next sector you start.

**Progress** is saved in the browser (localStorage) as you enter each sector: the last sector you flew, your difficulty, the cannon, launcher and missiles you last entered each sector with, and the best cannon and launcher you have ever reached (shown in the menu's tier list). Picking a sector from the menu starts it with that loadout and a full hull. Move the mouse to steer, with up/down inverted. Hold the left mouse button to fire the cannon, and press the right mouse button or C to launch seeker missiles. The weapons make short synthesized sounds.

The keyboard controls are W/A/S/D to strafe up, left, down, and right, Up to pitch down, Down to pitch up, Left/Right to turn, Q/E to roll, X to accelerate, Z to brake, F/J to fire, C to launch a missile, Tab to toggle the map, P to pause, and M to toggle music. Space also accelerates. Shoot hostile ships and the explosive barrels on the floor; barrel blasts also damage nearby enemies. The sky is visible, but a flight boundary prevents escape above the walls. Solid walls block your view and shots. The cockpit shows radar, shield, hull, speed, heading, altitude, sector, cannon tier, missile count (with the salvo size once the launcher is upgraded), target counts, and the name of the current area. A blue shield soaks up the first few hits before the hull takes damage; it holds about a third of a full hull, starts recharging four seconds after the last hit, and refills at 7% a second. Hits that only reach the shield flash the screen edge blue. If the hull reaches zero you are destroyed. Opening any gate or destroying a boss saves a checkpoint, so press R (or tap FIRE on a touch screen) to restart from the last one: the enemies you destroyed stay destroyed, used barrels and pickups stay gone, opened gates stay open, and you get back the loadout you had then with at least 60% hull. Shift+R restarts the sector from its start with the loadout you entered it with.

### Sectors

There are fifteen sectors. Each ends at a green warp gate; fly through it to move on to the next sector. The radar always shows the gate's bearing as a blinking green dot, pinned to the rim when the gate is out of range. Each warp repairs 25% of the hull and refills the shield, and your cannon, launcher and missiles carry over. Each sector has its own music and look, some open with a short objective, and enemies get a little tougher in every later sector. Each warp shows a results line with the hostiles you destroyed, the secrets you found and your time, and the menu keeps your best time for each sector. After the fifteenth sector, press R to fly again from the start.

1. **DELTA-9 Relay Station**: a dark, enclosed computer station with walls of consoles. From the entry hall, a chained gate opens into a control hub. Routes then run east across a sludge courtyard on a narrow walkway, through a computer annex and pump hall, or west through a yard stacked with cargo containers and a hidden armory. Both routes lead to a long gallery, and a last chained gate opens onto an exit approach crossed by a slow laser grid, then the uplink court and its warp gate.
2. **DELTA-9 Toxin Refinery**: a rusted refinery built around sludge. Walkways cross a settling basin, and chained gates lead east to a filter room and north, through a duct with a laser grid, to the refinery hall with its sludge vats. A lancer snipes from the tank yard to the west, which has its own chained gate into the hall. Two secret panels hide supply caches, and a final gate opens onto the outflow pool and its warp gate.
3. **EPSILON-5 Cryo Vaults**: frozen, mostly roofed vaults with ice walls and floors. A chained corridor opens into a vault hall of glowing crystal pillars, with stairs climbing to an upper gallery over a cold well that drops far below the rest of the station. Another chained gate leads into a chamber of cryo pods guarded by an aegis. A side route runs through a west cold store with a secret frost cache, and the exit vault holds the twin-seeker launcher.
4. **EPSILON-5 Magma Works**: an open-air foundry of basalt over molten slag. Causeways cross a lava field that now sits deep below them, with updraft vents in the pit that lift a falling ship back out. Three chained flues lead into a smelter yard where a miner lays mines. A secret panel in the east flue hides a cache. Stairs climb to the upper works, and a chained vent shaft leads up to the exit deck.
5. **EPSILON-5 Signal Spire**: a night-time climb in clean white tech panels under a taller sky. A tunnel cuts through the base of a glowing spire in an open plaza watched by lancers. Stairs rise to terraces split by a sludge moat, then to an upper terrace with an aegis. A chained tower bore with a laser grid and a chained west bore lead into the summit hall, where the Spire Overseer bars the long stair to the raised summit deck.
6. **TAU-3 Drowned Docks**: an overcast harbor of cargo containers. Piers cross a deep basin of real water where miners drift mines, with a chained hangar to the west and a chained fuel depot to the east, where a secret panel hides a cache. A chained channel leads to a dry dock of container stacks around a raised hull, and stairs climb to the crane deck and a last chained bore to the launch pad.
7. **TAU-3 Hive Warrens**: a dark, enclosed maze of hive resin at different heights. Broods hatch mites in the brood chamber and the egg vault. Both routes from the brood chamber end at chained gates into the nest, a tall chamber around a glowing core where the Hive Queen waits, and the stair beyond stays sealed until she dies. The stair climbs to the upper warren, whose secret royal cache holds the swarm pod, and a breach tunnel opens to the sky and the warp gate.
8. **TAU-3 Tether Anchor**: a bright, high-altitude climb under a taller sky. The anchor ring circles a lava pit around the glowing tether, with a chained maintenance bay and secret cache to the east. Two chained climbs reach the spoke deck, where lancers wait. From there you cross a lava gap that now drops far deeper, with an updraft island in the middle, to the summit ring and a chained docking bore up to a raised cradle.
9. **SIGMA-4 Refinery Terraces**: open-air terraces of rust and containers that climb from a canyon floor past a glowing slag pit. Skimmers, lancers and a miner hold the terraces, a climbing pipe tunnel leads to the upper terrace, and stairs climb to a higher summit.
10. **OMEGA Core Breach**: a covered drop chamber leads to an open arena of void panels around a reactor core with raised balconies, guarded by aegis, lancers and skimmers. Two bores at different heights lead to the vast crown hall, where the OMEGA Sentinel waits. The staircase to the escape deck stays sealed until it is destroyed.
11. **VOID-1 Abyss Shaft**: you start on a ledge high above a shaft more than a hundred units deep. Ledges, a central island, girders and crystal spires fill the shaft, with a secret gallery and a chained vault off its walls. At the bottom, a chained tunnel crossed by three timed laser grids leads to a vent chimney whose updraft carries you back up to a landing, a chained walk and the exit hall.
12. **VOID-2 Crystal Canyon**: a winding ice canyon under a bright sky, with shelves along its walls for lancers. It opens into the Needles, a field of crystal pillars below high cliffs with a secret ice cave, then a frozen stair, a chained high pass crossed by laser grids you can either time or fly over, and the carrier berth, a covered hangar where the Void Carrier waits.
13. **VOID-3 Drift Foundry**: a molten slot canyon leads into the atrium, a tall foundry shaft over lava with catwalk tiers at three heights, smelting columns, girders at every level and updraft vents that carry you up. A chained press gallery with laser grids runs from the top tier to the crucible, a raised molten vat with lower stores to the east and a secret high store to the west. A chained casting line climbs to the exit gantry.
14. **VOID-4 Mirror Archive**: a three-level maze of narrow data corridors around a central well. The archive's exit stays sealed until you destroy three data cores: one in a low east vault, one in a mid-level room to the west and one in a high vault to the east. Chained gates, laser grids at the junctions, stairs between the levels, ledges around the well at four heights and a secret cache off its west ledge tie the levels together.
15. **VOID-5 Heart of the Void**: a laser gauntlet leads into the shattered ring, a pit of floating platforms with an updraft at its centre and wings on either side, one behind a secret panel. A second laser corridor opens into the heart chamber and the final fight with the Void Herald.

**Chained gates** block some routes. **Core gates** stay shut until every data core in the sector (glowing teal crystals) is destroyed. Each gate has two glowing padlocks chained across its face, and shooting both apart sinks the gate into the floor. On the radar, closed gates show as orange outlines. **Secret panels** look almost like the surrounding wall apart from a faint glowing seam; shoot one a few times and it slides away to reveal a hidden room with supplies. **Toxic sludge** and **molten slag** damage the ship if you fly within a few units of the surface; slag burns harder. **Water** is harmless. **Updraft vents** are glowing fans in the floor whose rising streaks push the ship upward. **Laser grids** are stacks of red beams across a passage that switch on and off on a timer and flicker just before they switch on; flying into a live beam damages the ship.

The levels are built on a grid of 5-unit cells. Each cell has its own floor height, and covered cells have a ceiling with tunnel lights, so the ship must fit between floor and ceiling. Each sector sets its own sky height, so the tall ones stack ledges, shafts and pits far above and below each other. Raised floors can be dressed as container stacks, ice shelves or void platforms. Steel girders cross many routes at different heights, so you have to fly over, under or between them. Hazard-striped posts with amber beacons mark doorways and pillar corners, and the radar draws the walls around you.

### Bosses

Five sectors have a boss: sectors 5, 7, 10, 12 and 15. A health bar appears at the top of the screen once it sees you, the boss theme takes over the music, and the gate onward stays sealed until it is destroyed in a chain of explosions.

- **Spire Overseer** (sector 5): a broad hull that holds the summit hall, shielded by two turret relays that fire bursts at you. It fires five-bolt spreads and, every third volley, a charged beam that trails your ship; below 40% it fires faster and calls in drones.
- **Hive Queen** (sector 7): a swollen brood crown at the heart of the nest, shielded by four egg sacs that hatch mites while you are near. She sprays fans of slow green acid and lays mites; below 40% she lays broods as well.
- **OMEGA Sentinel** (sector 10): a huge turning crown. While any of its four blue shield pylons stand, shots bounce off it. It fires fans of seven bolts and launches homing missiles, two at a time once its shield is down; below 40% it fires faster and calls in hunters.
- **Void Carrier** (sector 12): a long hull that sweeps across its hangar, firing bolt fans and missile pairs and launching skimmers from its bays every other volley. Below 40% it launches mites instead and fires faster.
- **Void Herald** (sector 15): a great crystal crown shielded by three nodes that circle it and shoot back. It alternates spinning rings of bolts with a charged beam that trails your ship before it fires. With its nodes gone it rises and adds homing missiles, and below a third of its hull it fires faster and calls skimmers.

### Map

Press Tab to show or hide the map of the current sector. Rooms appear as they come into view; walls you have not seen stay hidden. Brighter floors are higher, sludge is green, slag is orange, water is dark blue and vents are amber. Areas you have entered are labelled, closed gates are outlined in orange, data cores you have seen show as teal diamonds (with a count of those left), the exit blinks green, and the white arrow is your ship. The game keeps running while the map is open.

### Enemies

- **Drones** (red) hover until they see you, then hold a middle distance and sidestep while firing single bolts.
- **Hunters** (amber, dart-shaped) are fragile, but once they see you they weave in and ram.
- **Wardens** (violet, large) take eight hits, grind forward and fire three-bolt spreads.
- **Strikers** (teal, wide-winged) launch slow homing missiles. A blinking MISSILE WARNING shows when one is close, and you can shoot incoming missiles down.
- **Sentries** (yellow) are turrets mounted on striped pylons that fire three-shot bursts.
- **Lancers** (crimson needles) perch high and paint you with a red aiming beam that trails your ship for about a second, then fire a fast, heavy bolt down it. Keep moving.
- **Aegis** (blue stars) link to up to three allies with blue beams; linked enemies glow blue and take no damage until the aegis dies.
- **Broods** (yellow bulbs) hatch mites while they see you and burst into four more when destroyed. **Mites** are tiny, fast rammers.
- **Skimmers** (green, flat) circle you at speed and fire quick pairs of bolts.
- **Phantoms** (pale blue, wide-winged) stay cloaked as a faint shimmer, invisible on radar and impossible to lock on to, until they fire a three-shot burst, get hit or come within close range.
- **Miners** (orange boxes) patrol back and forth laying mines. **Mines** drift toward a nearby ship, arm after a second and blow up when you get close; shooting one sets it off, which can catch other enemies.

A hostile that spots you wakes the others close to it. Big enemies sometimes leave a repair or missile crystal behind. From sector 6 on, some enemies are **elites**: gold-eyed and gold-tinted, with nearly twice the hull, and they fire a quarter faster. They grow more common in later sectors.

### Arsenal

Pick up a green crystal to repair 35% of the hull. A pink crystal adds six seeker missiles (up to 24).

An amber crystal upgrades the neutron cannon one tier. Amber crystals collected at the top tier repair 15% of the hull instead. The menu lists every tier you have found.

| Tier | Name | What it fires |
| --- | --- | --- |
| MK I | Pulse | a single bolt |
| MK II | Rapid | a faster single bolt |
| MK III | Twin | two barrels crossing at the reticle |
| MK IV | Trident | three heavy bolts |
| MK V | Scatter | the trident plus two bolts fanned outward for swarms |
| MK VI | Plasma | two plasma bolts that pass through up to three enemies and burst on impact, plus a heavy centre bolt |
| MK VII | Lance | the plasma volley plus, every third volley, an instant rail beam that hits everything in line out to the first wall |

A violet crystal upgrades the missile launcher (and adds four missiles):

| Tier | Name | Salvo |
| --- | --- | --- |
| 1 | Seeker | one missile per shot |
| 2 | Twin Seeker | two missiles per shot; the second picks another target |
| 3 | Swarm Pod | four missiles per shot at up to four targets |

Each shot uses one missile, however many the salvo holds. Keep an enemy near the reticle and an amber LOCKING square closes in on it, turning into a red LOCKED square once the lock is held. Missiles fired then home on that enemy (and any extra salvo missiles on others ahead of you), and a green TRACKING square follows each target until the missile hits. Missiles hit hard, damage nearby enemies, and set off barrels; with nothing ahead, they fly straight.

Main routes carry enough upgrades to reach the top tiers by the later sectors; secret rooms carry more, so thorough pilots get there sooner.

### Textures

All surfaces use textures painted in JavaScript at load time, with no image files. Each texture has a color layer, a height layer that becomes a normal map, and a glow layer for lights. Wall panels come in many variants, including consoles, vents, sealed doors, pipes, windows, signs, rust, frosted ice, hive resin, basalt with magma cracks, cargo containers, clean tech panels and void crystal. Floors include tread plate, glowing grates, landing pads, cracked foundry plates, sludge, slag, ice, resin, water, vents and void tiles. The WebGL renderer adds perspective-correct mapping, mipmaps, a low sun, sky light, the ship's headlight, and colored light from shots and explosions.

### Music

Every sector has its own original track, synthesized in JavaScript, plus a boss theme that takes over during boss fights. Music starts after your first click or key press. Each track has its own tempo, key, chord loop, lead melody and drum kit:

| Track | Sectors | Style |
| --- | --- | --- |
| Relay | 1 | industrial, D minor, 122 BPM |
| Toxin | 2 | half-time grind, E Phrygian, 98 BPM |
| Cryo | 3 | ambient bells, F# minor, 88 BPM |
| Magma | 4 | foundry drive with toms, C minor, 136 BPM |
| Spire | 5 | synthwave, A minor, 126 BPM |
| Docks | 6 | dub with off-beat stabs and echo, G minor, 112 BPM |
| Hive | 7 | tribal toms and shakers, B minor, 116 BPM |
| Tether | 8 | bright synthwave, C# minor, 120 BPM |
| Terraces | 9 | synthwave, D Dorian, 118 BPM |
| Omega | 10 | foundry drive, G minor, 138 BPM |
| Abyss | 11 | dark ambient, B-flat minor, 84 BPM |
| Canyon | 12 | synthwave, E minor, 124 BPM |
| Drift | 13 | foundry drive, A minor, 130 BPM |
| Archive | 14 | glassy synthwave with bells, C minor, 108 BPM |
| Void | 15 | industrial, F minor, 144 BPM |
| Boss | boss fights | foundry drive, D minor, 150 BPM |

Tracks cycle through intro, drive, assault and breakdown sections. The instruments include kick, snare, clap, rimshot, toms, shaker, hi-hats, metallic hits, a filtered or sub bass, pads, chord stabs, an arpeggio, bells and a lead, with reverb and echo. When hostiles are near, the music adds extra hi-hats and an arpeggio, and the bass gets brighter.

## Run in a terminal

```sh
node radix.js
```

Use an interactive terminal at least 60 columns wide. Hold **W/S** or the up/down arrows to pitch, **A/D** or the left/right arrows to turn, **Q/E** to roll, **Space** to accelerate, and **X** to brake. **P** pauses; **Esc** or **Ctrl+C** quits. The browser version uses different keys: **W/A/S/D** strafe, **Up** pitches down, **Down** pitches up, and **X** accelerates.

The ship, stars, and rotating wireframe beacons are projected from 3D coordinates into the terminal. This is a starting point for a larger game.
