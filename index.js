//Start Screen 
document.addEventListener("DOMContentLoaded", () => {
    startButton.addEventListener("click", function () {
        toggleScreen('start', false);
        toggleScreen('canvas', true);
        toggleScreen('canvas2', false);
    });
});

//===========================================
//Game Set Up
//===========================================
// Create the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width = 1300;
const canvasHeight = canvas.height = 650;

//Declare game constants
const heroArray = [];
const numberofSnowballs = 15; //how many obstacles we want
const snowballArray = []; //array to hold our obstalces 
const numberofMoose = 4;
const mooseArray = [];
const numberfRunningMoose = 0;
const runningMooseArray = [];
const numberofOwls = 1;
const owlArray = [];

let won = false;
let gameOverBool = false;
let prizeCount = 0;
let heroX = 700;
let heroY = 120;

let gameFrame = 0; //how fast sprites move
let modifier = 0;

//Declare Sound 
const soundCaught = "sound/christmas.wav"
const soundSnowBall = "sound/snowball.wav"
const soundMoose = "sound/beastroaring.wav"

const soundWin = "sound/festivemelody.wav"
const soundWon = "sound/fanfare.wav"
const soundLost = "sound/gameover.wav"
const soundBackground = "sound/blizzard.wav"

const soundEffects = document.getElementById("soundEffects")
const backgroundMusic = document.getElementById("backgroundMusic")

//Declare Images
var bgImage = new Image();
bgImage.src = "images/snowbackground.png";
//===========================================
//End Game Set Up
//===========================================


//===========================================
//Object Definitions
//===========================================
//Hero definiton 
// let heroImage = new Image();
// heroImage.src = "images/babyyoda.png";
// let hero = {
//     speed: 150, // movement in pixels per second
//     x: 0,  // where on the canvas are they?
//     y: 0  // where on the canvas are they?
// };

//Prize definition
let pancakeImage = new Image();
pancakeImage.src = "images/Pancake.png";
let prize = {
    // for this version, the monster does not move, so just and x and y
    x: 0,
    y: 0
};

//Snowball class object definition
class Hero {
    constructor() {
        this.image = new Image();
        this.image.src = 'images/bearsprite.png';
        this.x = heroX;
        this.y = heroY;
        this.speed = 600;
        this.spriteWidth = 224 / 4; //dimensions of each sprite image
        this.spriteHeight = 226 / 4;
        this.width = this.spriteWidth * 1.2;
        this.height = this.spriteHeight * 1.2;
        this.xframe = 0; //cycles through frames in update
        this.yframe = 0;
        // this.angle = Math.random()
    }
    heroUpdate() {
        //hero moving around
        this.y = heroY
        this.x = heroX

        if (38 in keysDown && this.y > 195) { //  holding up key

            if (gameFrame % 5 === 0) {
                // this.y = heroY
                // this.y = heroY - (this.speed * modifier);
                this.y -= this.speed * modifier;

                heroY = this.y;
                this.yframe = 3;

                //ternary operator 
                if (this.xframe > 2) {
                    this.xframe = 0
                } else this.xframe++
            }
        }

        if (40 in keysDown && this.y < canvas.height - (38)) { //  holding down key

            if (gameFrame % 5 === 0) {
                // this.y = heroY + (this.speed * modifier);
                this.y += this.speed * modifier;
                heroY = this.y;
                this.yframe = 0
                //ternary operator 
                if (this.xframe > 2) {
                    this.xframe = 0
                } else this.xframe++
            }
        }

        if (37 in keysDown && this.x > (8)) { // holding left key

            if (gameFrame % 5 === 0) {
                // this.x = heroX - (this.speed * modifier);

                this.x -= this.speed * modifier;
                heroX = this.x;
                this.yframe = 1;

                //ternary operator 
                if (this.xframe > 2) {
                    this.xframe = 0
                } else this.xframe++
            }
        }

        if (39 in keysDown && this.x < canvas.width - (35)) { // holding right key

            if (gameFrame % 5 === 0) {

                // this.x = heroX + (this.speed * modifier);

                this.x += this.speed * modifier;
                heroX = this.x;
                this.yframe = 2;

                //ternary operator 
                if (this.xframe > 2) {
                    this.xframe = 0
                } else this.xframe++
            }
        }
    }
    heroDraw() {
        ctx.drawImage(this.image, this.xframe * this.spriteWidth, this.yframe * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);    //(image, where on sprite sheet we want to start x, where on sprite sheet we want to start y, width we want to crop width, width we want to crop height, x location where we want to display image, y location were we want to display image, how much of canvas we want to take up width, how much of the canvas we want to take up height )
    }
    heroPrizeDetect() {
        //if hero and pancake collide
        if (
            prize.x <= (this.x + 32)
            && this.x <= (prize.x + 32)
            && prize.y <= (this.y + 32)
            && this.y <= (prize.y + 32)
        ) {
            ++prizeCount;       // keep track of our “score”
            if (prizeCount % 2 === 0) levelup()
            if (prizeCount % 3 === 0) moreMoose()
            if (prizeCount === 5) {
                won = true;
                gameOver()
                soundEffects.src = soundWin;
                soundEffects.play();
            } else {
                soundEffects.src = soundCaught;
                soundEffects.play();
                reset();    // start a new cycle
            }
        }
    }
}


//Snowball class object definition
class Snowball {
    constructor() {
        this.image = new Image();
        this.image.src = 'images/SnowballSprite.png';
        this.x = Math.random() * canvasWidth;
        this.y = ((Math.random() * canvasHeight) + 155);
        this.speed = Math.random() * 4 - 2; //random number between 0-3 but starting at -2, thus between -2 to +1
        this.spriteWidth = 240 / 3; //dimensions of each sprite image
        this.spriteHeight = 60;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.xframe = 0; //cycles through frames in update
        this.yframe = 0;

        this.angle = Math.random()
    }
    snowballUpdate() {
        this.speed
        this.x -= this.speed;

        //sprite animation
        if (this.x + this.width < 0) this.x = canvasWidth //if the sprite goes off the screen we reset x coordinate so we have infinite snowballs

        if (gameFrame % 9 === 0) {
            //if game frame element divisble by 5 only then do we do animation frame, run this code only every 5 loops, thus slow sprite animation down
            //ternary operator 
            if (this.xframe > 1 && this.yframe === 0) {
                this.xframe = 0
                this.yframe = 1
            } else if (this.xframe > 1 && this.yframe > 0) {
                this.xframe = 0
                this.yframe = 0
            } else this.xframe++
        }
    }
    snowballDraw() {
        ctx.drawImage(this.image, this.xframe * this.spriteWidth, this.yframe * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);    //(image, where on sprite sheet we want to start x, where on sprite sheet we want to start y, width we want to crop width, width we want to crop height, x location where we want to display image, y location were we want to display image, how much of canvas we want to take up width, how much of the canvas we want to take up height )
    }
    snowballHitDetect() {
        //if hero and snowball collide
        if (
            heroX <= (this.x + 15) // from left
            && this.x <= (heroX + 20) // from right
            && heroY <= (this.y + 40)
            && this.y <= (heroY + 30)
        ) {
            //sound effects
            soundEffects.src = soundSnowBall;
            soundEffects.play();
            if (prizeCount > 0) --prizeCount; //lose a pancake if you get hit by snowball
            //         heroY = 700 //location of hero on canvas
            heroX = 700
            heroY = 120
            //reset();
        }
    }
}

//Moose class object definition
class Moose {
    constructor() {
        this.image = new Image();
        this.image.src = 'images/MooseWalkSpriteSheet.png';
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * 350 + 200;
        this.speed = Math.random() * 1.5; //random number between 0-2
        this.spriteWidth = 3295 / 5; //dimensions of each sprite image
        this.spriteHeight = 1869 / 3;
        this.width = this.spriteWidth / 6.5;
        this.height = this.spriteHeight / 6.5;
        this.xframe = 0; //cycles through frames in update
        this.yframe = 0;
        this.angle = Math.random()
    }
    mooseUpdate() {
        this.x -= this.speed;
        // this.y += Math.sin(this.angle) //creating a sin wave for our up and down movement 
        // this.angle += 0.5; //increment angle

        //sprite animation
        if (this.x + this.width < 0) this.x = canvasWidth //if the sprite goes off the screen we reset xs coordinate so we have infinite moose

        if (gameFrame % 5 === 0) {
            //if game frame element divisble by 5 only then do we do animation frame, run this code only every 5 loops, thus slow sprite animation down
            //ternary operator 
            if (this.xframe > 3 && this.yframe === 0) {
                this.xframe = 0
                this.yframe = 1
            } else if (this.xframe > 3 && this.yframe === 1) {
                this.xframe = 0
                this.yframe = 2
            } else if (this.xframe > 3 && this.yframe === 2) {
                this.xframe = 0
                this.yframe = 0
            } else {
                this.xframe++
            }
        }
    }
    mooseDraw() {
        ctx.drawImage(this.image, this.xframe * this.spriteWidth, this.yframe * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height); //this.image, crop out area from 0/0 (this.frame * sprite width) to sprite.width/sprite.height, where on canvas we want to place the image 
    }
    mooseHitDetect() {
        //if hero and moose collide
        if (
            heroX <= (this.x + 65) //moose collide from back
            && this.x <= (heroX + 30) //moose collide from front
            && heroY <= (this.y + 60) //moose collide from below
            && this.y <= (heroY + 30) // mose collide from above
        ) {
            //sound effects
            soundEffects.src = soundMoose;
            soundEffects.play();
            gameOver();
        }
    }
}

//Moose class object definition
class RunningMoose {
    constructor() {
        this.image = new Image();
        this.image.src = 'images/RunningMooseSpriteSheet.png';
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * 350 + 200;
        this.speed = Math.random() * 2 - 3.5; //random number between 0-3 but starting at -2, thus between -2 to +1
        this.spriteWidth = 3295 / 5; //dimensions of each sprite image
        this.spriteHeight = 1869 / 3;
        this.width = this.spriteWidth / 6.5;
        this.height = this.spriteHeight / 6.5;
        this.xframe = 4; //cycles through frames in update
        this.yframe = 0;
        this.angle = Math.random()
    }
    runningMooseUpdate() { //moose follows hero around on canvas
        if (heroY < this.y) {
            this.y += this.speed / 4
        } else if (heroY > this.y) {
            this.y -= this.speed / 4
        } else this.y--

        this.x -= this.speed;

        //sprite animation
        if (this.x + this.width > 1300) this.x = 0 //if the sprite goes off the screen we reset xs coordinate so we have infinite moose

        if (gameFrame % 5 === 0) {
            //if game frame element divisble by 5 only then do we do animation frame, run this code only every 5 loops, thus slow sprite animation down
            //ternary operator 
            if (this.xframe === 0 && this.yframe === 0) {
                this.xframe = 4
                this.yframe = 1
            } else if (this.xframe === 0 && this.yframe === 1) {
                this.xframe = 4
                this.yframe = 2
            } else if (this.xframe === 0 && this.yframe === 2) {
                this.xframe = 0
                this.yframe = 0
            } else {
                this.xframe--
            }
        }
    }
    runningMooseDraw() {
        ctx.drawImage(this.image, this.xframe * this.spriteWidth, this.yframe * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height); //this.image, crop out area from 0/0 (this.frame * sprite width) to sprite.width/sprite.height, where on canvas we want to place the image 
    }
    runningMooseHitDetect() {
        //if hero and moose collide
        if (
            heroX <= (this.x + 65) //moose collide from back
            && this.x <= (heroX + 40) //moose collide from front
            && heroY <= (this.y + 80) //moose collide from below
            && this.y <= (heroY + 40) // mose collide from above
        ) {
            //sound effects
            soundEffects.src = soundMoose;
            soundEffects.play();
            gameOver();
        }
    }
}


//Owl class object definition
class Owl {
    constructor() {
        this.image = new Image();
        this.image.src = 'images/OwlSprite.png';
        this.x = 190;
        this.y = 0;
        this.speed = Math.random() * 2 - 7; //random number between 0-3 but starting at -2, thus between -2 to +1
        this.spriteWidth = 1809 / 20; //dimensions of each sprite image
        this.spriteHeight = 60;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.frame = 0; //cycles through frames in update
    }
    owlUpdate() {
        if (gameFrame % 7 === 0) {
            //if game frame element divisble by 5 only then do we do animation frame, run this code only every 5 loops, thus slow sprite animation down
            //ternary operator 
            this.frame > 18 ? this.frame = 0 : this.frame++ //if this.frame is greater than , set it back to 0, else add 1 
        }
    }
    owlDraw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);    //(image, where on sprite sheet we want to start x, where on sprite sheet we want to start y, width we want to crop width, width we want to crop height, x location where we want to display image, y location were we want to display image, how much of canvas we want to take up width, how much of the canvas we want to take up height )
    }
}

// Handle Keyboard Controls
let keysDown = {}; //object were we properties when keys go down
// and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down
addEventListener("keydown", function (e) {
    console.log(e.keyCode + " down")
    keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
    console.log(e.keyCode + " up")
    delete keysDown[e.keyCode];
}, false);
//===========================================
//End of Object Definitions
//===========================================



//===========================================
//Loop Part of Game
//===========================================
// The main game loop
function main() {
    let now = Date.now();
    let delta = now - then; //taking in the speed of computer to adjust speed of character
    modifier = delta / 1000;
    render();
    update();

    then = now;

    //  Request to do this again ASAP
    if (gameOverBool === false) {
        requestAnimationFrame(main);
    }
};

function update() {
}


function render() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.beginPath();
    backgroundCreation();

    ctx.drawImage(pancakeImage, prize.x, prize.y);

    //create hero 
    heroArray.forEach(obstacle => {
        obstacle.heroUpdate();
        obstacle.heroDraw();
        obstacle.heroPrizeDetect();
    });

    //create owl 
    owlArray.forEach(obstacle => { //iterate through our obstacle array and update & draw our obstacles
        obstacle.owlUpdate();
        obstacle.owlDraw();
    });

    //create snowball obstacles
    snowballArray.forEach(obstacle => { //iterate through our obstacle array and update & draw our obstacles
        obstacle.snowballUpdate();
        obstacle.snowballDraw();
        obstacle.snowballHitDetect();
    });

    //create charging moose obstacle
    runningMooseArray.forEach(obstacle => { //iterate through our obstacle array and update & draw our obstacles
        obstacle.runningMooseUpdate();
        obstacle.runningMooseDraw();
        obstacle.runningMooseHitDetect();
    });

    //create moose obstaces 
    mooseArray.forEach(obstacle => { //iterate through our obstacle array and update & draw our obstacles
        obstacle.mooseUpdate();
        obstacle.mooseDraw();
        obstacle.mooseHitDetect();
    });

    gameFrame++; //increase by one in every loop
    ctx.closePath();
}
//==========================================
//End of Loop
//==========================================


//===========================================
//Function Definitions
//===========================================
for (let i = 0; i < 1; i++) { //create hero
    heroArray.push(new Hero());
}

//Use for loop to create as many obstacles as we want and store them in our array
for (let i = 0; i < numberofSnowballs; i++) { //create snowballs
    snowballArray.push(new Snowball());
}

for (let i = 0; i < numberofMoose; i++) { //create moose
    mooseArray.push(new Moose());
}

for (let i = 0; i < numberfRunningMoose; i++) { //create moose
    runningMooseArray.push(new RunningMoose());
}

for (let i = 0; i < numberofOwls; i++) { //create owl
    owlArray.push(new Owl());
}

function backgroundCreation() {
    const bgImage = new Image();
    bgImage.src = "images/SnowBackground.png";
    ctx.drawImage(bgImage, 0, 0);

    let signImage = new Image(); //creating sign
    signImage.src = "images/Sign.png";
    ctx.drawImage(signImage, 200, 35);

    // Score
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.font = "22px Bangers";
    ctx.fillText("Pancakes " + prizeCount, 225, 98);

    // My Name
    ctx.fillStyle = "rgb(107,188,212)";
    ctx.font = "12px Bangers";
    ctx.fillText("By Alesia Cameron", 1180, 635);
}

function toggleScreen(id, toggle) { //hide and unhide start screen, canvas
    let element = document.getElementById(id);
    let display = (toggle) ? 'block' : 'none';
    element.style.display = display;
}

function gameOver() {
    // clearInterval(this.loop)
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    gameOverBool = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameOverScreen();
}

function levelup() {

    prize.x = (Math.random() * (canvas.width - 100));
    prize.y = 200 + (Math.random() * (canvas.height - 280));

    for (let i = 0; i < 5; i++) { //create snowballs
        snowballArray.push(new Snowball());
    }
}

function moreMoose() {
    for (let i = 0; i < 1; i++) { //create snowballs
        runningMooseArray.push(new RunningMoose());
    }
}

function reset() {
    prize.x = (Math.random() * (canvas.width - 100));
    prize.y = 200 + (Math.random() * (canvas.height - 280));
}
//===========================================
//End of Function Definitions
//===========================================

//Let's play!
let then = Date.now();
reset();
main();


//===========================================
//Second Canvas for game over
//===========================================
function gameOverScreen() {
    toggleScreen('start', false);
    toggleScreen('canvas', false);
    toggleScreen('canvas2', true)

    // Create the canvas
    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas2.getContext("2d");
    const canvas2Width = canvas2.width = 1300;
    const canvas2Height = canvas2.height = 650;

    let gameFrame2 = 0;
    const bearLostArray = [];
    const bearWonArray = [];

    const bgImage2 = new Image();
    bgImage2.src = "images/snowbackground.png";


    function gameOverAnimation() {
        if (won === true) {
            renderWon()
        }
        else {
            renderLoss()
        }
        requestAnimationFrame(gameOverAnimation);
    }

    if (won === true) {
        setTimeout(() => {
            soundEffects.src = soundWon;
            soundEffects.play();
        }
            , 3000);
    } else {
        setTimeout(() => {
            soundEffects.src = soundLost;
            soundEffects.play();
        }
            , 2000);
    }

    function renderLoss() {
        ctx2.clearRect(0, 0, canvas2Width, canvas2Height);
        ctx2.beginPath();
        ctx2.drawImage(bgImage2, 0, 0);
        ctx2.fillStyle = "rgb(68,132,117)";
        ctx2.font = "50px Bangers";
        ctx2.fillText("You lose!", 550, 560);

        let thoughImage = new Image(); //creating sign
        thoughImage.src = "images/Think.png";
        thoughImage.width = 100;
        ctx2.drawImage(thoughImage, 290, 150);

        ctx2.fillStyle = "rgb(68,132,117)";
        ctx2.font = "20px Bangers";
        ctx2.fillText("unbearable ...", 335, 215);

        ctx2.fillStyle = "rgb(68,132,117)";
        ctx2.font = "13px Bangers";
        ctx2.fillText("what an embearassment!", 313, 245);

        //create loser bear image on game over screen
        bearLostArray.forEach(obstacle => { //iterate through our array and update & draw our bear
            obstacle.bearLostUpdate();
            obstacle.bearLostDraw();
        });

        gameFrame2++
        ctx2.closePath();
    }

    function renderWon() {
        ctx2.clearRect(0, 0, canvas2Width, canvas2Height);
        ctx2.beginPath();
        ctx2.drawImage(bgImage2, 0, 0);
        ctx2.fillStyle = "rgb(68,132,117)";
        ctx2.font = "50px Bangers";
        ctx2.fillText("You win!", 550, 560);

        let thoughImage = new Image(); //creating sign
        thoughImage.src = "images/Think.png";
        thoughImage.width = 100 * .2;
        ctx2.drawImage(thoughImage, 250, 100);

        ctx2.fillStyle = "rgb(68,132,117)";
        ctx2.font = "13px Bangers";
        ctx2.fillText("Pawsitively Stupendous!", 265, 170);

        ctx2.fillStyle = "rgb(68,132,117)";
        ctx2.font = "13px Bangers";
        ctx2.fillText("King of the huckleberries!", 263, 198);


        //create winner bear image on game over screen
        bearWonArray.forEach(obstacle => { //iterate through our array and update & draw our bear
            obstacle.bearWonUpdate();
            obstacle.bearWonDraw();
        });

        gameFrame2++
        ctx2.closePath();
    }

    if (won === false) {
        //Bear Lost Object
        class BearLost {
            constructor() {
                this.image = new Image();
                this.image.src = 'images/DefeatSpriteSheet.png';
                this.x = 400;
                this.y = 100;
                this.speed = Math.random() * 2 - 7; //random number between 0-3 but starting at -2, thus between -2 to +1
                this.spriteWidth = 14586 / 17; //dimensions of each sprite image
                this.spriteHeight = 783;
                this.width = this.spriteWidth / 2;
                this.height = this.spriteHeight / 2;
                this.xframe = 0; //cycles through frames in update
            }
            bearLostUpdate() {
                if (this.xframe < 16) {
                    if (gameFrame2 % 11 === 0) {
                        //if game frame element divisble by 5 only then do we do animation frame, run this code only every 5 loops, thus slow sprite animation down
                        //ternary operator 
                        this.xframe++ //if this.frame is greater than , set it back to 0, else add 1 
                        // this.xframe > 16 ? this.xframe = 16 : this.xframe++ //if this.frame is greater than , set it back to 0, else add 1 
                    }
                }
            }
            bearLostDraw() {
                ctx2.drawImage(this.image, this.xframe * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);    //(image, where on sprite sheet we want to start x, where on sprite sheet we want to start y, width we want to crop width, width we want to crop height, x location where we want to display image, y location were we want to display image, how much of canvas we want to take up width, how much of the canvas we want to take up height )
            }
        }
        for (let i = 0; i < 1; i++) { //create 1 loser bear image :(
            bearLostArray.push(new BearLost());
        }
    } else if (won === true) {
        //Bear Won Object
        class BearWon {
            constructor() {
                this.image = new Image();
                this.image.src = 'images/BearWinSpriteSheet.png';
                this.x = 400;
                this.y = 100;
                this.speed = Math.random() * 2 - 7; //random number between 0-3 but starting at -2, thus between -2 to +1
                this.spriteWidth = 22308 / 26; //dimensions of each sprite image
                this.spriteHeight = 783;
                this.width = this.spriteWidth / 2;
                this.height = this.spriteHeight / 2;
                this.xframe = 0; //cycles through frames in update
            }
            bearWonUpdate() {
                if (this.xframe < 25) {
                    if (gameFrame2 % 11 === 0) {
                        //if game frame element divisble by 5 only then do we do animation frame, run this code only every 5 loops, thus slow sprite animation down
                        //ternary operator 
                        this.xframe++ //if this.frame is greater than , set it back to 0, else add 1 
                        // this.xframe > 16 ? this.xframe = 16 : this.xframe++ //if this.frame is greater than , set it back to 0, else add 1 
                    }
                }
            }
            bearWonDraw() {
                ctx2.drawImage(this.image, this.xframe * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);    //(image, where on sprite sheet we want to start x, where on sprite sheet we want to start y, width we want to crop width, width we want to crop height, x location where we want to display image, y location were we want to display image, how much of canvas we want to take up width, how much of the canvas we want to take up height )
            }
        }
        for (let i = 0; i < 1; i++) { //create 1 winner bear image :(
            bearWonArray.push(new BearWon());
        }
    }
    gameOverAnimation();
}