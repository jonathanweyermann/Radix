# Radix / Beyond the Void

A tiny dependency-free 3D space-flight prototype drawn with terminal characters.

## Run in a browser

Open `index.html` in a browser that supports WebGL 2. No installation or web server is needed. The game opens on a short story page (the menu theme starts once you tap or press a key), then a menu where you can continue, start a new game, pick a difficulty, choose any sector you have reached, and see the arsenal tier list. Starting a sector, from the menu or through a warp gate, first shows a mission briefing: a map of the Nadir system with the route from the last target to the next, and a few sentences on what the last sector achieved and what this one has to. Press LAUNCH or Enter to fly. The full story is in [STORY.md](STORY.md). Click the game to capture the mouse; Esc releases it and opens the menu, which pauses the game.

**Phones and tablets:** play it at https://jonathanweyermann.github.io/Radix/ with the device held sideways. On touch screens the game shows on-screen controls and a smaller cockpit. Touch anywhere on the left half of the screen and drag to steer; the stick appears under your thumb and reads the direction from where you first touched. Push up to climb, and the nose eases back to level when you let go. The PITCH button in the menu flips this to the mouse's inverted style. Hold THRUST or BRAKE to change speed, which stays where you leave it. Hold FIRE to shoot, and tap MSL to launch a missile. MAP and MENU sit at the top right, and the menu has a FULL SCREEN button. Strafing is keyboard only. Switching apps pauses the game. Add `?touch` to the address to force the touch controls on, `?desktop` to turn them off, or `?debugtouch` to show the raw touch coordinates on screen.

**Graphics:** the menu has HIGH, MEDIUM and LOW settings and shows your frame rate in flight. HIGH renders at up to twice the screen's pixel density with 16 dynamic lights; MEDIUM at the screen's own resolution with 8; LOW at 60% resolution with 4 lights, flat lighting without bump mapping or highlights, no clouds and fewer glows, which is about three to four times faster on weak graphics chips. LOW also turns off antialiasing once the page is reloaded. If the frame rate stays under 24 after a few seconds of flight, the game suggests LOW.

**Difficulty:** Easy spawns about two thirds as many enemies, lets 60% of incoming damage through, and enemies aim where you are. Normal enemies aim partly ahead of a moving ship. Hard spawns 30% more enemies, deals 35% more damage, and enemies lead their shots almost fully. Changing it mid-flight changes damage and aim at once, and enemy numbers from the next sector you start.

**Progress** is saved in the browser (localStorage) as you enter each sector: the last sector you flew, your difficulty, the cannon, launcher and missiles you last entered each sector with, and the best cannon and launcher you have ever reached (shown in the menu's tier list). Picking a sector from the menu starts it with that loadout and a full hull. Move the mouse to steer, with up/down inverted. Hold the left mouse button to fire the cannon, and press C to launch seeker missiles. Hold the right mouse button for full thrust; when you let go the ship drops back to the speed it had before. The weapons make short synthesized sounds.

The keyboard controls are W/A/S/D to strafe up, left, down, and right, Up to pitch down, Down to pitch up, Left/Right to turn, Q/E to roll, X to accelerate, Z to brake, F/J to fire, C to launch a missile, Tab to toggle the map, P to pause, and M to toggle music. Keys 1 to 5 fire any active powers you have bought (see Upgrades). Space also accelerates. Shoot hostile ships and the explosive barrels on the floor; barrel blasts also damage nearby enemies. The sky is visible, but a flight boundary prevents escape above the walls. Solid walls block your view and shots. The cockpit shows radar, shield, hull, speed, heading, altitude, sector, cannon tier, missile count (with the salvo size once the launcher is upgraded), target counts, and the name of the current area. A blue shield soaks up the first few hits before the hull takes damage; it holds about a third of a full hull, starts recharging four seconds after the last hit, and refills at 7% a second. Every hit shakes the view, harder for bigger hits. Hits that only reach the shield flash the screen edge blue with a crackling force-field sound; hits that reach the hull land with a heavy metal crunch, shake the view harder and wash the screen red. If the hull reaches zero you are destroyed. Opening any gate or destroying a boss saves a checkpoint, so press R (or tap FIRE on a touch screen) to restart from the last one: the enemies you destroyed stay destroyed, used barrels and pickups stay gone, opened gates stay open, and you get back the loadout you had then with at least 60% hull. Shift+R restarts the sector from its start with the loadout you entered it with.

### Sectors

There are twenty-eight sectors. Each ends at a green warp gate; fly through it to move on to the next sector. The radar always shows the gate's bearing as a blinking green dot, pinned to the rim when the gate is out of range. Each warp repairs 25% of the hull and refills the shield, and your cannon, launcher and missiles carry over. Each sector has its own music, look and sky, with its own banded planet hanging over it, some open with a short objective, and enemies get a little tougher in every later sector. Each warp shows a results line with the hostiles you destroyed, the secrets you found (hidden panels and reinforced walls) and your time, and the menu keeps your best time for each sector. After the twenty-eighth sector the game shows your run: the sector you started from, the total flight time and the hostiles destroyed. Press R to fly again from the start.

1. **DELTA-9 Relay Station**: a dark, enclosed computer station with walls of consoles. From the entry hall, a chained gate opens into a control hub. Routes then run east across a sludge courtyard on a narrow walkway, through a computer annex and pump hall, or west through a yard stacked with cargo containers and a hidden armory. Both routes lead to a long gallery, and a last chained gate opens onto an exit approach crossed by a slow laser grid and the uplink court. From there a covered stair climbs to the antenna field, an open plain around a glowing mast with raised platforms, girders at two heights and a reinforced wall hiding a relay vault. A second route reaches the field from the pump hall, through a chained coolant tunnel with a laser grid and a transformer yard with an updraft vent. A chained stair at the far end rises to the uplink dish and the warp gate.
2. **DELTA-9 Toxin Refinery**: a rusted refinery of round tanks and pools joined by ducts. Walkways cross a round settling basin, and chained gates lead east to a filter room and a tank farm of domed storage tanks, and north, through a duct with a laser grid, to the barrel-roofed refinery hall with its sludge vats. A lancer snipes from the tank yard to the west, which has its own chained gate into the hall. Two secret panels hide supply caches, and a final gate opens onto the outflow pool and its warp gate.
3. **EPSILON-5 Cryo Vaults**: frozen, mostly roofed vaults with ice walls and floors. A chained corridor opens into a barrel-vaulted hall of glowing crystal pillars, with stairs climbing to an upper gallery over a round cold well that drops far below the rest of the station. Another chained gate leads into a chamber of cryo pods guarded by an aegis. A side route runs through a west cold store with a secret frost cache, and the exit vault holds the twin-seeker launcher.
4. **EPSILON-5B Glacier Moon**: a frozen moon twice the usual size, curving away to a close horizon. Crystal spire fields stand among frozen lakes, craters and ice boulders, a glacier ridge has ice caves running through it, and a walled research base stands to the west. Its objectives: shatter four cryo pylons on the tallest spires, enter the ice caves and destroy three thaw pumps, break into the research base, destroy its three core samples, then reach the launch gate.
5. **EPSILON-5 Magma Works**: an open-air foundry of basalt over molten slag. Causeways cross a lava field that now sits deep below them, with updraft vents in the pit that lift a falling ship back out. Three chained flues lead into a smelter yard where a miner lays mines. A secret panel in the east flue hides a cache, and a chained duct off it leads to a cooling tower whose updraft lifts you to a high run, past a laser grid, that rejoins the upper works and skips the smelter yard. Stairs climb to the upper works, and a chained vent shaft leads up to the exit deck.
6. **EPSILON-5 Magma Gorge**: a slag plateau twice the usual size cut by a winding gorge more than a hundred units deep, with smooth basalt walls and a river of lava along its floor that burns if you fly low over it. Smelters, gun pads and molten vats stand on the rims, and girder bridges cross the gorge. Its objectives: destroy four smelter valves, dive into the gorge, destroy three magma pumps standing in the lava, silence four foundry guns, then reach the gate down in the gorge.
7. **EPSILON-5 Signal Spire**: a night-time climb in clean white tech panels under a taller sky. A tunnel cuts through the base of a glowing spire in an open plaza watched by lancers. Stairs rise to terraces split by a sludge moat, then to an upper terrace with an aegis. A chained tower bore with a laser grid and a chained west bore lead into the summit hall, where the Spire Overseer bars the long stair to the raised summit deck.
8. **TAU-3 Drowned Docks**: an overcast harbor of cargo containers. Piers cross a deep basin of real water where miners drift mines, with a chained hangar to the west and a chained fuel depot to the east, where a secret panel hides a cache. A chained channel leads to a dry dock of container stacks around a raised hull, and stairs climb to the crane deck and a last chained bore to the launch pad.
9. **TAU-3 Tide Drum**: a cylinder of sea twice the garden's size, its wooded islands, harbour towns, piers, cranes and lighthouses curving up round you to meet overhead. A sea wall rings the whole drum with one chained gate, and a desalination plant stands on the far shore, across the axis. Its objectives: destroy four harbour cranes, open the sea gate, cross to the far shore, destroy three desalination cores, then reach the end-cap gate.
10. **TAU-3 Hive Warrens**: a warren that was grown, not built: rounded chambers under resin domes, joined by tubes that wander as they run. Broods hatch mites in the brood chamber and the egg vault. Both routes from the brood chamber end at chained gates into the nest, a great domed chamber around a resin pillar where the Hive Queen waits, and the stair beyond stays sealed until she dies. The stair climbs to the upper warren, whose secret royal cache holds the swarm pod, and a breach tunnel opens to the sky and the warp gate.
11. **TAU-3 Brood Ark**: a living ship in open space, its rounded hive hull grown round a hold, with two smaller pods and egg spheres drifting round it. You enter through the maw into a deck of hive chambers, egg rooms and birthing halls. Its objectives: destroy four spore turrets on the hide, shoot the locks off the maw, burst four egg sacs, kill the brood mother (a Hive Queen, shielded by the eggs until they burst), then reach the gate beyond the ark.
12. **TAU-3 Tether Anchor**: a bright climb to the foot of a space elevator. The anchor ring circles a lava pit, with a chained maintenance bay and secret cache to the east. Two chained climbs reach the anchor well, a huge round pit of lava with the tether rising from its middle, through turning collars and out of sight. The spoke deck curves round its south side, lancers wait there, and the summit deck curves round its north side, with a chained docking bore up to a raised cradle.
13. **TAU-3 Orbital Garden**: the inside of a spinning garden cylinder. The map's width is the drum's circumference and wraps round at its edges, so meadows, lakes, groves, a river and a small town curve up on both sides and meet overhead, lit by a sun line down the axis, with the end caps closing off each end. There is no flight ceiling short of the axis: climb past it and you come out over the far side, turned over, and the ship rolls level to the new ground. Its objectives: destroy three seed towers spaced round the drum, fly up to the sun line, cross to the far shore and destroy the two irrigation pumps standing in its lake, then reach the end-cap gate. Trees block the ship and shots.
14. **TAU-3 Orbital Yards**: an industrial double cylinder, twice the garden's size. The outer drum's floor is steel plate cut by four canals of molten slag and sludge, crowded with presses, furnaces and container stacks, with gear wheels and molten vats turning among them, furnace vents, and catwalks and crane beams overhead. Above it is the inner cylinder, its underside lit with panels and hung with machinery, held off the floor by pillars. Two bulkheads ring the whole drum, each with one chained door, and gaps in the inner cylinder lead up into its core, where hoops circle the sun line. Nearly a hundred hostiles hold it. Its objectives: destroy four press controllers, shoot the first bulkhead's locks, destroy three coolant pumps standing in the canals, shoot the second bulkhead's locks, climb into the inner cylinder, destroy the four spindle dynamos spaced round it, then reach the end-cap gate.
15. **SIGMA-4 Refinery Terraces**: open-air terraces of rust and containers that climb from a canyon floor past a glowing slag pit. Skimmers, lancers and a miner hold the terraces, a climbing pipe tunnel leads to the upper terrace, and stairs climb to a higher summit.
16. **SIGMA-4B Shepherd Moon**: an open sector wrapped around a small moon about two kilometres across, so the grey ground curves away to a close horizon under a black, starry sky with Sigma-4 hanging overhead. There are no walls at its edge: amber marker lights show where the operations area ends, and flying past them stops the ship without damage. The flight ceiling is half again as high as usual. Craters, ridges with a rock arch between them, boulders, a mesa with antenna masts, roofed bunkers and a walled dome fill the plain, and you can fly over the buildings' roofs as well as through their doors. Its five objectives are taken in order: investigate a downed tanker in a crater, destroy four turrets on the comms mesa, shoot the locks off the dome's blast door, destroy the three power cores inside, then reach the extraction gate, which stays locked until the rest are done.
17. **SIGMA-4 Ore Belt**: open space crowded with nearly a hundred asteroids, some tumbling, the biggest bored by drill rigs and strung together by conveyor trusses, with ore crates tumbling among them, a rounded refinery and a survey pod. Its objectives: destroy four drill rigs, force the refinery door and destroy its three smelter cores, destroy the ore tug, then reach the belt gate.
18. **OMEGA High Station**: a station hanging in open space over the crown world, with stars on every side and the planet below. The operations area is a box about four hundred units each way; lights mark its edges, top and bottom, and reaching them stops the ship without harm. The hub is a rounded, domed hull inside a turning habitat ring, with round pods on trusses either side, fuel spheres, an antenna mast, solar arrays and a reactor caged by rings below. You approach from outside and fly in through the docking port to a whole deck inside: a docking bay, a concourse, hydroponics, an armory, crew quarters, engineering, a core hall and a command bridge, joined by crossways. A maintenance shaft in engineering drops out of the hull's underside to the reactor. Its objectives: destroy five turrets on the hulls, shoot the locks off the docking port, shut down three life-support cores, destroy the three control cores in the core hall, take the command bridge, dive under the station to destroy the three reactor stabilizers, then reach the departure gate.
19. **OMEGA Rift Lands**: a flat desert plateau split by a winding rift a hundred units deep, with side canyons, terraced sandstone walls, a thin river along the bottom, girder bridges across it and mesas standing above the plain, which runs on past the operations area. Its objectives: destroy three beacons on the rims, dive into the rift, destroy the two generators in the bunker on its floor, destroy the guns on the east mesa, then reach the gate down the rift.
20. **OMEGA Core Breach**: a covered drop chamber leads to a round open arena, with a walkway round its rim and the reactor core standing in the middle of its pit, guarded by aegis, lancers and skimmers. Two bores at different heights lead to the vast crown hall, where the OMEGA Sentinel waits. The staircase to the escape deck stays sealed until it is destroyed.
21. **VOID-1 Abyss Shaft**: you start on a ledge high above a round bored shaft nearly two hundred units deep. Ledges left in its walls, a central island, girders and tall crystals fill the shaft, with a secret gallery and a chained vault off its walls. At the bottom, a chained tunnel crossed by three timed laser grids leads to a vent chimney whose updraft carries you back up to a landing, a chained walk and the exit hall.
22. **VOID-1B Sunless Sea**: a cavern twice the usual size under the Void's crust, its rock roof hung with stalactites over a black underground sea, with glowing crystal stalagmites and floating crystals on the shores and a drowned shrine on an island in the middle. Its objectives: douse four void lanterns on the tallest crystals, cross the sea to the shrine, open it, silence its three echo cores, then reach the gate on the far shore.
23. **VOID-2 Crystal Canyon**: a winding gorge cut down through a glacier under a bright sky, its terraced walls running up past the top of the sector. It opens into the Needles, a bowl of leaning crystal shards with a secret ice cave, then a frozen stair, a chained gate in a dam of Void plating, a high pass crossed by laser grids you can either time or fly over, and the carrier berth, a covered hangar where the Void Carrier waits.
24. **VOID-3 Drift Foundry**: a molten slot canyon leads into the atrium, a tall foundry shaft over lava with catwalk tiers at three heights, smelting columns, girders at every level and updraft vents that carry you up. A chained press gallery with laser grids runs from the top tier to the crucible, a raised molten vat with lower stores to the east and a secret high store to the west. A chained casting line climbs to the exit gantry.
25. **THE ARK Reactor Spine**: inside the Choir's ark, a ship kilometres long, sealed under a hull ceiling. A docking bay of stacked cargo leads through chained docking clamps and a laser-crossed spine corridor into the cargo void, a chamber seventy units deep with blocks hanging in the air at every height, a catwalk across it, updraft vents at the bottom and a slowly tumbling cube. Beyond it the spin section is a true cylinder round the habitat drum, a huge ring lined with lit windows that turns for gravity between two counter-rotating end rings; you can fly straight through it. Then comes the reactor hall, a deep round well around a crackling reactor column caged by turning containment rings and two tilted hoops, and finally the bridge. A west crawlway with a store room and a secret armory, and a low east conduit trench with laser grids, give other routes. Its objectives: shoot the docking clamp locks, destroy the three gravity governors around the drum, destroy the three reactor regulators, then reach the bridge gate. The rings, column and cube block the ship and shots.
26. **VOID-4 Mirror Archive**: a three-level maze of narrow data corridors around a central well. The archive's exit stays sealed until you destroy three data cores: one in a low east vault, one in a mid-level room to the west and one in a high vault to the east. Chained gates, laser grids at the junctions, stairs between the levels, ledges around the well at four heights and a secret cache off its west ledge tie the levels together.
27. **VOID-5 Ash Mesas**: a dead plain running on to the horizon under a red sky, with stepped basalt mesas at a dozen heights, two winding lava rivers, a lava gorge down its east side and updraft vents. The hangar dug into the northern mesa stays sealed until three data cores are destroyed: one on top of the tallest mesa, one in a bunker reached through a reinforced wall in a western mesa, and one on a low mesa ringed by guards. You can take them in any order.
28. **VOID-6 Heart of the Void**: nothing runs straight here. A wandering laser gauntlet leads into the shattered ring, a broken circular deck round a drop, with floating platforms and an updraft at its centre and wings on either side, one behind a secret panel. A second laser corridor opens into the heart chamber, a vast dome with crystal growing up its walls, and the final fight with the Void Herald.

**Chained gates** block some routes. **Core gates** stay shut until every data core in the sector (glowing teal crystals) is destroyed. Each gate has two glowing padlocks chained across its face, and shooting both apart sinks the gate into the floor. On the radar, closed gates show as orange outlines. **Secret panels** look almost like the surrounding wall apart from a faint glowing seam; shoot one a few times and it slides away to reveal a hidden room with supplies. **Reinforced walls** are panels split by glowing orange cracks; cannon bolts bounce off them, but missiles, plasma bursts and the lance rail break them open. Four hide bonus caches of missiles and repairs: off the cryo chamber (sector 3), the crane deck (sector 8), the spoke deck (sector 12) and the upper terrace (sector 15). **Toxic sludge** and **molten slag** damage the ship if you fly within a few units of the surface; slag burns harder. **Water** is harmless. **Updraft vents** are glowing fans in the floor whose rising streaks push the ship upward. **Laser grids** are stacks of red beams across a passage that switch on and off on a timer and flicker just before they switch on; flying into a live beam damages the ship.

Set dressing (crate stacks, consoles, pipe clusters rising to the ceiling, storage tanks and lamp posts) stands along the walls of the bigger rooms in every sector, and blocks the ship like a wall. The levels are built on a grid of 5-unit cells. Each cell has its own floor height, and covered cells have a ceiling with tunnel lights, so the ship must fit between floor and ceiling. Each sector sets its own sky height, so the tall ones stack ledges, shafts and pits far above and below each other. Raised floors can be dressed as container stacks, ice shelves or void platforms. A cell can also have a roof: covered up to its ceiling, solid to its roof and open above it, which makes buildings you can fly over and blocks that hang in mid-air. Some sectors add spinning rings, reactor columns and tumbling cubes that block the ship as they turn. In open space a cell can also have open space below its floor, so whole modules float with room all round them. Steel girders cross many routes at different heights, so you have to fly over, under or between them. Hazard-striped posts with amber beacons mark doorways and pillar corners, and the radar draws the walls around you.

### Bosses

Six sectors have a boss: sectors 7, 10, 11, 20, 23 and 28. A health bar appears at the top of the screen once it sees you, the boss theme takes over the music, and the gate onward stays sealed until it is destroyed in a chain of explosions.

- **Spire Overseer** (sector 7): a broad hull that holds the summit hall, shielded by two turret relays that fire bursts at you. It fires five-bolt spreads and, every third volley, a charged beam that trails your ship; below 40% it fires faster and calls in drones.
- **Hive Queen** (sectors 10 and 11, where the Brood Ark's brood mother is one too): a swollen brood crown at the heart of the nest, shielded by four egg sacs that hatch mites while you are near. She sprays fans of slow green acid and lays mites; below 40% she lays broods as well.
- **OMEGA Sentinel** (sector 20): a huge turning crown. While any of its four blue shield pylons stand, shots bounce off it. It fires fans of seven bolts and launches homing missiles, two at a time once its shield is down; below 40% it fires faster and calls in hunters.
- **Void Carrier** (sector 23): a long hull that sweeps across its hangar, firing bolt fans and missile pairs and launching skimmers from its bays every other volley. Below 40% it launches mites instead and fires faster.
- **Void Herald** (sector 28): a great crystal crown shielded by three nodes that circle it and shoot back. It alternates spinning rings of bolts with a charged beam that trails your ship before it fires. With its nodes gone it rises and adds homing missiles, and below a third of its hull it fires faster and calls skimmers.

### Map

Press Tab to show or hide the map of the current sector. Rooms appear as they come into view; walls you have not seen stay hidden. Brighter floors are higher, sludge is green, slag is orange, water is dark blue and vents are amber. Areas you have entered are labelled, closed gates are outlined in orange, data cores you have seen show as teal diamonds (with a count of those left), the exit blinks green (a grey ring while it is locked), and the white arrow is your ship. In a sector with objectives, a yellow arrow bobs over the current one, its remaining targets show as yellow diamonds, the radar points to it in yellow, a yellow light column marks it in the world, and the objective, its progress and its distance show under the area name. The game keeps running while the map is open.

### Enemies

- **Drones** (red) hover until they see you, then hold a middle distance and strafe from side to side, bobbing up and down, while firing single bolts.
- **Hunters** (amber, dart-shaped) are fragile, but once they see you they weave in and ram.
- **Wardens** (violet, large) take eight hits, grind forward swaying from side to side and fire three-bolt spreads.
- **Strikers** (teal, wide-winged) hang back and strafe across your view, launching slow homing missiles. A blinking MISSILE WARNING shows when one is close, and you can shoot incoming missiles down.
- **Sentries** (yellow) are turrets mounted on striped pylons that fire three-shot bursts.
- **Lancers** (crimson needles) perch high and paint you with a red aiming beam that trails your ship for about a second, then fire a fast, heavy bolt down it. Keep moving.
- **Aegis** (blue stars) link to up to three allies with blue beams; linked enemies glow blue and take no damage until the aegis dies.
- **Broods** (yellow bulbs) hatch mites while they see you and burst into four more when destroyed. **Mites** are tiny, fast rammers.
- **Skimmers** (green, flat) circle you at speed and fire quick pairs of bolts.
- **Phantoms** (pale blue, wide-winged) stay cloaked as a faint shimmer, invisible on radar and impossible to lock on to, until they fire a three-shot burst, get hit or come within close range.
- **Shield bearers** are wardens, sentries, strikers, lancers and drones that carry a one-way shield: a glowing honeycomb disc held in front of them. It stops your bolts, missiles and the lance's rail from the front, and their own fire passes out through it. They set it down facing you and it stays where it was set, with the ones that fly keeping in cover straight behind it. It holds for 6 to 9 seconds and flickers just before it drops. They also drop it early if you get more than about 65 degrees round its edge or out of sight. Once it drops, for whatever reason, it takes about 30 seconds to recharge before they can set down another, so fly round the side or wait it out. They start appearing in sector 2 and are common from sector 5 on.
- **Miners** (orange boxes) patrol back and forth laying mines. **Mines** drift toward a nearby ship, arm after a second and blow up when you get close; shooting one sets it off, which can catch other enemies.

Drones, hunters, wardens, strikers, skimmers and phantoms jink sideways when you line one up and fire, or when you hit it, kicking out across your view and mostly away from the reticle; they jink less often on Easy and more often on Hard. The first time you meet each of the tougher types, a one-line tip appears; types you have met are remembered in your save. A hostile that spots you wakes the others close to it. The open-world sectors (the moons, cylinders, canyons, open space and the Sunless Sea) put three times as many hostiles in their open-air areas, since there is room there to outfly them; the rooms and buildings inside those sectors keep their usual numbers. From sector 8 on, some wardens fly with two escort drones that hold formation either side of them, on the side facing you, until the warden dies. Big enemies sometimes leave a repair or missile crystal behind. From sector 6 on, some enemies are **elites**: gold-eyed and gold-tinted, with nearly twice the hull, and they fire a quarter faster. They grow more common in later sectors.

### Arsenal

Pick up a green crystal to repair 35% of the hull. A pink crystal adds six seeker missiles (up to 24).

An amber crystal upgrades the neutron cannon one tier. Amber crystals collected at the top tier repair 15% of the hull instead. The menu lists every tier you have found. On the curved sectors, the moons and the cylinders, bolts and the rail fly straight as you see them, so they go where the reticle points instead of following the ground's curve.

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

### Upgrades

Finishing a sector earns one upgrade point, and the upgrade bay opens before the next briefing. Spend the point on a rank in a power or keep it for later; points spent there are fixed. Sector N is flown with N - 1 points, so a full campaign earns 27 points to use, fewer than the 30 ranks on offer, and the build is a choice. Picking any sector but the first from the menu opens the same screen as a test loadout, with N - 1 points to assign freely before it begins: sector 22 gets 21. A sector remembers the build it was last entered with. New Game clears it. The bar above the cockpit shows what you own and what is ready, and on a touch screen each power gets its own button.

A power opens once the one above it in its branch is at rank 2, and the singularity charge once any two tier 3 powers are.

| Branch | Power | Use | Rank 1 | Rank 2 | Rank 3 |
| --- | --- | --- | --- | --- | --- |
| Flight | Reverse thrusters | Hold brake | Reverse at 40% speed | 70%, and double-tap brake to flip 180 degrees while sliding on | Full speed, and fire 25% faster in reverse |
| Flight | Blink dash | Double-tap W/A/S/D | 12 units, 1 charge, 8 s recharge; untouchable mid-dash | 2 charges, 6 s recharge | 18 units, and homing missiles lose their lock |
| Flight | Overdrive | Key 3 | World at 50% speed for 3 s, 40 s cooldown | 40% for 4 s, 35 s cooldown | 35% for 5 s, and each kill adds 0.5 s |
| Defense | Aegis pulse | Key 1 | Blocks all damage for 2 s, 45 s cooldown | 3 s, 40 s cooldown | 4 s, and ramming destroys enemies |
| Defense | Deflector plating | Passive | 15% of enemy bolts glance off | 25% | 35%, and they fly back at the shooter |
| Defense | Phoenix protocol | Passive | Once per sector, a killing hit leaves 1% hull and 3 s of immunity | Also refills the shield and blasts enemies within 15 units | Recharges at every checkpoint and leaves 40% hull |
| Support | Decoy wingman | Passive | Holo-drone draws a third of enemy fire, takes 3 hits, rebuilds in 20 s | Draws half, takes 5 hits, rebuilds in 15 s | Shoots back, and shows cloaked phantoms on the radar |
| Support | EMP burst | Key 2 | Within 30 units drops enemy shields and stuns for 1.5 s, 35 s cooldown | 45 units, 2.5 s stun, sets off mines and enemy missiles | 60 units, shields stay down 60 s, stunned enemies take 50% more damage |
| Support | Turncoat hack | Key 4 | A drone or hunter near the reticle fights for you for 10 s, 60 s cooldown | Any non-boss, 15 s | Two at once, 20 s, and they blow up when it ends |
| Capstone | Singularity charge | Key 5 | Pulls enemies within 30 units together for 3 s, then implodes for 6, 60 s cooldown | 40 units, 10 damage | 50 units, swallows enemy bolts and missiles, 45 s cooldown |

### Curved rooms

A sector's rooms can be ovals, rings and winding tubes as well as rectangles, with domed ceilings and floors that climb. The grid underneath is still square, but the walls are drawn on the true curve and collisions follow it too, so the ship stops at the wall you can see. Small pillars can be drawn round the same way, and a sector can stand a sheet of rock or ice higher than its top and cut its route down through it.

### Textures

All surfaces use textures painted in JavaScript at load time, with no image files. Each texture has a color layer, a height layer that becomes a normal map, and a glow layer for lights. Wall panels come in many variants, including consoles, vents, sealed doors, pipes, windows, signs, rust, frosted ice, hive resin, basalt with magma cracks, cargo containers, clean tech panels and void crystal. Floors include tread plate, glowing grates, landing pads, cracked foundry plates, sludge, slag, ice, resin, water, vents and void tiles. The WebGL renderer adds perspective-correct mapping, mipmaps, a low sun, sky light, the ship's headlight, and colored light from shots and explosions.

### Music

Every sector has two original tracks, synthesized in JavaScript, that take turns: when one has played through, about a minute and a half in, the other takes over. There is also a boss theme that takes over during boss fights and a quiet theme for the menu. Music starts after your first click or key press. Each track has its own tempo, key, chord loop, lead melody and drum kit:

| Track | Sectors | Style |
| --- | --- | --- |
| Press | 1, 5, 14 | heavy industrial with hydraulic pistons, ringing anvils and a distorted stomping bass, E Phrygian, 128 BPM |
| Anvil | 12, 15, 25 | EBM stomp with a driven eighth-note bass, C minor, 140 BPM |
| Rivet | 6, 19, 24 | hard techno with a rumbling kick and bass, F minor, 146 BPM |
| Furnace | 8, 20, 21, 27 | slow doom industrial, D Phrygian, 84 BPM |
| Ascent | 4, 7, 16 | uplifting trance with a supersaw lead, a gated pad and a pumping mix, A minor, 138 BPM |
| Horizon | 9, 13, 18, 23 | progressive trance, D major, 132 BPM |
| Nadir | 3, 17, 22, 26 | dark trance, G minor, 136 BPM |
| Hivemind | 10, 11, 28 | psytrance with a rolling acid bass, F# Phrygian, 145 BPM |
| Acidbath | 2 | acid techno with a squelching resonant bassline, E minor, 134 BPM |
| Relay | 1 | industrial, D minor, 122 BPM |
| Toxin | 2 | half-time grind, E Phrygian, 98 BPM |
| Cryo | 3 | ambient bells, F# minor, 88 BPM |
| Glacier | 4 | ambient bells, D# minor, 92 BPM |
| Magma | 5 | foundry drive with toms, C minor, 136 BPM |
| Gorge | 6 | foundry drive with a saw lead, F minor, 140 BPM |
| Spire | 7 | synthwave, A minor, 126 BPM |
| Docks | 8 | dub with off-beat stabs and echo, G minor, 112 BPM |
| Tide | 9 | swung dub, D major, 104 BPM |
| Hive | 10 | tribal toms and shakers, B minor, 116 BPM |
| Brood | 11 | tribal half-time, B-flat minor, 112 BPM |
| Tether | 12 | bright synthwave, C# minor, 120 BPM |
| Garden | 13 | bright synthwave with bells, G major, 96 BPM |
| Yards | 14 | foundry drive, E minor, 126 BPM |
| Terraces | 15 | synthwave, D Dorian, 118 BPM |
| Belt | 17 | synthwave with a square arpeggio, A minor, 118 BPM |
| Station | 18 | synthwave with a saw lead, F# minor, 120 BPM |
| Rift | 19 | swung half-time, D minor, 108 BPM |
| Omega | 20 | foundry drive, G minor, 138 BPM |
| Abyss | 21 | dark ambient, B-flat minor, 84 BPM |
| Sunless | 22 | slow dark ambient with bells, A minor, 80 BPM |
| Canyon | 23 | synthwave, E minor, 124 BPM |
| Drift | 24 | foundry drive, A minor, 130 BPM |
| Ark | 25 | uneasy half-time with a saw lead, C# minor, 104 BPM |
| Archive | 26 | glassy synthwave with bells, C minor, 108 BPM |
| Mesa | 16, 27 | swung half-time, E Phrygian dominant, 100 BPM |
| Void | 28 | industrial, F minor, 144 BPM |
| Boss | boss fights | foundry drive, D minor, 150 BPM |
| Menu | the pause menu | ambient bells, D minor, 76 BPM |

Tracks cycle through intro, drive, assault and breakdown sections; on later passes the lead is doubled an octave down and tom fills join the drums. The instruments include kick, snare, clap, rimshot, toms, shaker, hi-hats, metallic hits, a filtered or sub bass, pads, chord stabs, an arpeggio, bells and a lead, with reverb and echo. When hostiles are near, the music adds extra hi-hats and an arpeggio, and the bass gets brighter.

## Run in a terminal

```sh
node radix.js
```

Use an interactive terminal at least 60 columns wide. Hold **W/S** or the up/down arrows to pitch, **A/D** or the left/right arrows to turn, **Q/E** to roll, **Space** to accelerate, and **X** to brake. **P** pauses; **Esc** or **Ctrl+C** quits. The browser version uses different keys: **W/A/S/D** strafe, **Up** pitches down, **Down** pitches up, and **X** accelerates.

The ship, stars, and rotating wireframe beacons are projected from 3D coordinates into the terminal. This is a starting point for a larger game.
