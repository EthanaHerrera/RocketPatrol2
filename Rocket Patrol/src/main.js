let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars (p1)
let keyF, keyR, keyLEFT, keyRIGHT;

// reserve keyboard vars (p2)
let keyP, keyA, keyD;

// Ethan Herrera RP2, 4/20/2022 ~13 hours
// Points breakdown:
// Multiplayer (30)
// Speed up at half (5)
// Game timer (10)
// Stopped scrolling sprite at end of game (?)
// Second player scoreboard (?)