class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        
        // green UI Background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(-1, 0);
        
        // add rocket (p2)
        this.p2Rocket = new Rocket2(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(1, 0);
        
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        
        // define general keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // define keys (p1)
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    
        // define keys (p2)
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //initialize score (p1)
        this.p1Score = 0;

        //initialize score (p2)
        this.p2Score = 0;

        //initialize High Score
        this.HScore = 0;

        // Create scoreConfig
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 100
        }

        // Create timerConfig
        let timerConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 60
        }


        // Display Time
        this.timerText = this.add.text(game.config.width/2 - borderUISize, borderUISize + borderPadding*2, formatTime(game.settings.gameTimer), timerConfig);

        // Get elapsed time
        var timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
        // Get Initial Time
        var initialTime = formatTime(game.settings.gameTimer);

        // Format Time
        function formatTime(miliseconds){
            // Seconds
            var Seconds = miliseconds/1000;
           
            // Returns formated time
            return Seconds;
        }

        // Change Timer
        function onEvent ()
        {
            if(initialTime>0){
                initialTime -= 1; // Initial Time - 1 second
                this.timerText.text = initialTime;
            } 
        }
        
        //display score (p1)
        this.scoreLeft1 = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        
        //display score (p2)
        this.scoreLeft2 = this.add.text(game.config.width - scoreConfig.fixedWidth - borderUISize - borderPadding, borderUISize + borderPadding*2, this.p2Score, scoreConfig);
        
        // GAME OVER flag
        this.gameOver = false;

        // Halftime flag
        this.halfTime = false;

        // Easy/Hard play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            if(this.p1Score == this.p2Score){
                this.add.text(game.config.width/2, game.config.height/2 + 32, 'Tie Game, You both lost!', scoreConfig).setOrigin(0.5);
            } else if (this.p1Score > this.p2Score){
                this.add.text(game.config.width/2, game.config.height/2 + 32, 'Player 1 Wins!', scoreConfig).setOrigin(0.5);
            } else {
                this.add.text(game.config.width/2, game.config.height/2 + 32, 'Player 2 Wins!', scoreConfig).setOrigin(0.5);
            }
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            //this.add.text(game.config.width/2, game.config.height/2 + 128, 'Highscore: ' + this.HScore, scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // Halftime Tracker
        this.clock = this.time.delayedCall(game.settings.gameHalf, () => {
            this.halfTime = true;
        }, null, this);
    }

    update() {
        // check key input for replay
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        // check key input for return to menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // increase speed at half
        if(this.halfTime){
            this.ship01.incSpeed();               // update spaceships (x3)
            this.ship02.incSpeed();
            this.ship03.incSpeed();
        }

        // background scroll
        if(this.gameOver){
            this.starfield.tilePositionX = 0;
        }else {
            this.starfield.tilePositionX -= 4;
        }

        // //High Score Update (if needed)
        // if (this.p1Score > this.HScore){
        //     this.HScore = this.p1Score;
        // }
        // if (this.p2Score > this.HScore) {
        //         this.HScore = this.p2Score;
        // }

        // sprite updates
        if (!this.gameOver) {
            this.p1Rocket.update();             // update rocket sprite p1
            this.p2Rocket.update();             // update rocket sprite p2
            this.ship01.update();               // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        }
        
        // check collisions (p1)
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        // check collisions (p2)
        if(this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship03);
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship02);
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    checkCollision(rocket2, ship) {
        // simple AABB checking
        if (rocket2.x < ship.x + ship.width && 
            rocket2.x + rocket2.width > ship.x && 
            rocket2.y < ship.y + ship.height &&
            rocket2.height + rocket2.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }
    

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });

        //score add and repaint (p1)
        this.p1Score += ship.points;
        this.scoreLeft1.text = this.p1Score;

        //explosion sound
        this.sound.play('sfx_explosion');
    }

    shipExplode2(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });

        //score add and repaint (p2)
        this.p2Score += ship.points;
        this.scoreLeft2.text = this.p2Score;

        //explosion sound
        this.sound.play('sfx_explosion');
    }
}