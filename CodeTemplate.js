//Paolo Torres

/*
CHECKLIST
- Idea ☑
- Multiple Screens ☑
- Instructions ☑
- Intuitive ☑
- 2D Arrays ☑
- Functions / Objects / Methods ☑
- Classes & Objects ☑
- Algorithms ☑
- Recursion ☑

COOL FEATURES
- 2D array background
- Zombies that teleport and multiply
- Zombies homing in
- Zombie boss
- Per second timer
- Power ups / traps
- Sorts and searches
*/

$(document).ready(function() {

document.body.onmousedown = function() { return false; } //so page is unselectable

	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var mx, my;

	var askUser; //asks the user for their name

	var screen; //controls which screen you are on

	//Images
	var menuScreen = new Image();
	var instructions = new Image();
	var winScreen = new Image();
	var loseScreen = new Image();
	var dangerZone = new Image();

	//Sounds
	var menuMusic = new Audio();
	var gameMusic = new Audio();
	var buttonClick = new Audio();
	var clickBack = new Audio();

	//2D Array Background
	var grid = [];
	var blockX;
	var blockY;

	//HUD (Heads-Up Display)
	var health;
	var healthStop;
	var peopleSaved;
	var timer;
	var stopTimer;
	var lose;

	//Player
	var pSizeX;
	var pSizeY;
	var px;
	var py;
	var pSize;
	var left;
	var up;
	var right;
	var down;
	var speed;
	var speedTimer;
	var timerStart;

	//Instructions
	var bSort = [];
	var ranNum;

	//High Score Page
	var names = [];
	var score = [];
	var search = false;

	//Credits
	var number = [];
	var roles = [];
	var search2 = false;
	var searchNum;

	/////////////////////////////////
	////////////////////////////////
	////////	GAME INIT
	///////	
	//////////////////////////////
	/////////////////////////////
	function init() {

	

	//////////
	///STATE VARIABLES

	askUser = prompt('What is your name?','Type here'); //asks the user for their name
	while (askUser == 'Type here') { //if the user accidentally clicks 'OK'
		askUser = prompt('What is your name?','Type here'); //ask the user again
	}
	alert("Welcome " + askUser);

	screen = 0; //starts off on the main menu screen

	//Images
	menuScreen.src = 'screen.jpg';
	instructions.src = 'instructions.jpg';
	winScreen.src = 'win.jpg';
	loseScreen.src = 'lose.png';
	dangerZone.src = 'danger.jpg';

	//Music
	menuMusic.src = 'menu.mp3';
	gameMusic.src = 'game.mp3';
	buttonClick.src = 'button.mp3';
	clickBack.src = 'back.mp3';

	//2D Array Background
	blockX = 140;
	blockY = 70;

	//HUD (Heads-Up Display)
	health = 100;
	healthStop = 0;
	peopleSaved = 0;
	timer = 0;
	stopTimer = 0;
	lose = 0;

	//Player
	pSizeX = 10;
	pSizeY = 10;
	px = 700;
	py = 615;
	pSize = 20;
	left = false;
	up = false;
	right = false;
	down = false;
	speed = 4;
	speedTimer = 0;
	timerStart = 0;

	//Instructions
	for (var i = 0; i < 22; i++) {
		ranNum = Math.floor(Math.random() * 100);
		bSort.push(ranNum);
	}

	//High Score Page
	names.push('Paolo');
	names.push('Christian');
	names.push('Bettina');
	names.push('Francis');
	names.push('Martin');
	score.push(123);
	score.push(216);
	score.push(100);
	score.push(174);
	score.push(158);

	//Credits
	number.push(5);
	number.push(4);
	number.push(3);
	number.push(2);
	number.push(1);
	roles.push('Producer');
	roles.push('Designer');
	roles.push('Programmer');
	roles.push('Tester');
	roles.push('Audio');

	//////////////////////////////////////////////////////
	////////	2D Array
	////////////////////////////////////////////////////

	for (var i = 0; i < blockX; i++) { //for all the blocks across the X-axis (140)
		grid[i] = []; //create 140 array indexes
		for (var j = 0; j < blockY; j++) { //and for all the blocks down the Y-axis (70)
		grid[i].push(Math.floor(Math.random() * 100)); //push 70 random numbers from 0-100 into the array
		}
	}

	//////////////////////
	///GAME ENGINE START

	if (typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}
	init();	

	//////////////////////////////////////////////////////
	////////	Classes & Objects
	////////////////////////////////////////////////////

	//Classes & Objects
	var people = []; //array for the people
	var numOfPeople = 50; //50 people in the game
	function makePeople() { //function to create these people
		var peopleX = Math.floor(Math.random() * 1380); //spawn in a random X-value
		var peopleY = Math.floor(Math.random() * 650) + 30; //spawn in a random Y-value
		return { //return
			x:peopleX, //X-value becomes a random value from 0-1380
			y:peopleY, //Y-value becomes a random value from 0-680
			w:20, //width is 20 pixels
			h:20, //height is 20 pixels
			saved:false, //they start off on the screen
			draw:function() { //draws each person
				ctx.fillStyle = 'white'; //black
				ctx.fillRect(this.x,this.y,this.w,this.h); //draws each person according to x,y,w,h values
			}
		}
	}
	for (var i = 0; i < numOfPeople; i++) { //for the amount of people
		people[i] = makePeople(); //draw this amount of people
	}

	//Classes & Objects
	var zombie = []; //array for the zombies
	var numOfZombie = 1; //starts off with 1 zombie on screen
	function makeZombie() { //function to create the zombies
		var zXSpeed = 2; //horizontal speed
		var zYSpeed = 2; //vertical speed
		var ranX = Math.floor(Math.random() * 1380); //spawns in random x-axis
		var ranY = Math.floor(Math.random() * 680); //spawns in random y-axis
		var ranXDir = Math.floor(Math.random() * 2); //spawns either going left or right
		var ranYDir = Math.floor(Math.random() * 2); //spawns either going up or down
		return { //return
			xSpeed:zXSpeed, //x speed
			ySpeed:zYSpeed, //y speed
			x:ranX, //x
			y:ranY, //y
			xDir:ranXDir, //x-axis direction
			yDir:ranYDir, //y-axis direction
			w:20, //width 20 pixels
			h:20, //height 20 pixels
			hit:false, //starts off active
			draw:function() { //draw
				ctx.fillStyle = 'green'; //green
                ctx.fillRect(this.x,this.y,this.w,this.h); //draws according to x, y, w, and h values
			},
			move:function() { //movement
				if (this.x < px - 200 || this.x > px + 200 || this.y < py - 200 || this.y > py + 200) { //if they are not within 200 pixels of the player
					if (this.xDir == 0) { //if xDir equals 0
						this.x -= this.xSpeed; //move left
					}
					if (this.xDir == 1) { //if xDir equals 1
						this.x += this.xSpeed; //move right
					}
					if (this.yDir == 0) { //if yDir equals 0
						this.y -= this.ySpeed; //move up
					}
					if (this.yDir == 1) { //if yDir equals 1
						this.y += this.ySpeed; //move down
					}
					if (this.x <= 0) { //if the x value is at the very left of the screen
						this.xSpeed *= -1; //reverse its direction
					}
					if (this.y <= 0) { //if the zombie's x value is at the very top of the screen
						this.ySpeed *= -1; //reverse its direction
					}
					if (this.x > w - 20) { //if the zombie's x value is at the very right of the screen
						this.xSpeed *= -1; //reverse its direction
					}
					if (this.y > h - 20) { //if the zombie's x value is at the very bottom of the screen
						this.ySpeed *= -1; //reverse its direction
					}
				}
				else { //if they are within 200 pixels of the player
					if (this.x < px) { //if the zombie's x value is less than the player's x value
						this.x += this.xSpeed;
					}
					if (this.y < py) { //if the zombie's y value is less than the player's y value
						this.y += this.ySpeed;
					}
					if (this.x > px) { //if the zombie's x value is greater than the player's x value
						this.x -= this.xSpeed;
					}
					if (this.y > py) { //if the zombie's y value is greater than the player's y value
						this.y -= this.ySpeed;
					}
					if (this.x <= 0) { //if the zombie's x value is at the very left of the screen
						this.xSpeed *= -1; //reverse its direction
					}
					if (this.y <= 0) { //if the zombie's y value is at the very top of the screen
						this.ySpeed *= -1; //reverse its direction
					}
					if (this.x > w - 20) { //if the zombie's x value is at the very right of the screen
						this.xSpeed *= -1; //reverse its direction
					}
					if (this.y > h - 20) { //if the zombie's y value is at the very bottom of the screen
						this.ySpeed *= -1; //reverse its direction
					}
					if (this.x < px + 20 && this.y < py + 20 && this.x > px - 20 && this.y > py - 20) { //if the zombie hits the player
						zombie.hit = true; //hit equals true
						if (healthStop == 0) { //if you are in the game screen
							health -= 1; //health goes down by 1
						}
					}
				}
			}
		}
	}
	for (var i = 0; i < numOfZombie; i++) { //for the number of zombies
		zombie[i] = makeZombie(); //zombie array equals the function
	}

	//Zombie Boss
	var boss; //variable for the boss
	function makeBoss() { //function to create the boss
		var bossYSpeed = 2; //boss's vertical speed
		return { //return
			ySpeed:bossYSpeed, //ySpeed equals 2
			x:1050, //x value is 1050
			y:0, //starts at the top
			w:350, //width is 350 pixels
			h:350, //height is 350 pixels
			gunX:1050, //gun's is aligned with the boss
			gunY:175, //gun is in the middle of the boss
			gunW:10, //width is 10 pixels
			gunH:10, //height is 10 pixels
			gunSpeed:50, //bullet moves 50 pixels per paint when shot
			counter:0, //makes bullet shoot forever
			counterStart:0, //makes bullet shoot forever
			dead:false, //starts off as not dead
			draw:function() { //draws the boss
				ctx.fillStyle = 'green'; //green boss
				ctx.fillRect(this.x,this.y,this.w,this.h); //draws the boss
			},
			move:function() { //boss movement
				this.y += this.ySpeed; //moves only in the y direction
				if (this.y <= 0) { //if the boss is at the very top of the screen
					this.ySpeed *= -1; //reverse its direction
				}
				if (this.y >= 350) { //if the boss is at the very bottom of the screen
					this.ySpeed *= -1; //reverse its direction
				}
			},
			gun:function() { //gun function
				ctx.fillStyle = 'green'; //green gun
				ctx.fillRect(this.gunX,this.gunY,this.gunW,this.gunH); //draws the gun
			},
			gunMove:function() { //gun movement
				this.gunY += this.ySpeed; //gun moves with the boss
			},
			shooting:function() { //shooting function
				if (this.health >= 0) { //if it is still alive
					this.counterStart += 1; //increase counterStart by 1
				}
				if (this.counterStart >= 1) { //if counterStart is greater than 1
					this.counter += 1; //increase counter by 1
				}
				if (this.counter <= 500) { //if counter is less than or equal to 500
					this.gunX -= this.gunSpeed; //the gun shoots
					if (this.gunX <= 0) { //if the bullet is at the very left of the screen
						this.gunSpeed *= -1; //reverse its direction
					}
					if (this.gunX >= 1100) { //if the gun comes back to the boss
						this.gunSpeed *= -1; //reverse its direction
					}
				}
				else { //if counter is greater than 100
					this.counterStart = 0; //reset counterStart
					this.counter = 0; //and reset counter, essentially creating a boomerang-like unlimited gun
				}
			}
		}
	}
	boss = makeBoss(); //variable boss equals this entire function

	//Power Ups
	var pUp; //power up
	function powerUp() { //function for the power up
		return { //return
			x:-100, //starts outside of the canvas
			y:h/2, //middle of the screen
			w:20, //width 20 pixels
			h:20, //height 20 pixels
			draw:function() { //function to draw the power up
				ctx.fillStyle = 'aqua'; //aqua colour
				ctx.fillRect(this.x,this.y,this.w,this.h); //draws the power up according to the values
			},
			move:function() { //moves the power up
				if (peopleSaved >= 10) { //if you save 10 people
					this.x += 10; //the power up starts moving across the screen
				}
			}
		}
	}
	pUp = powerUp();
	var pUp2;
	function powerUp2() {
		return {
			x:-100,
			y:h/2,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'aqua';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 20) {
					this.x += 10;
				}
			}
		}
	}
	pUp2 = powerUp2();
	var pUp3;
	function powerUp3() {
		return {
			x:-100,
			y:h/2,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'aqua';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 30) {
					this.x += 10;
				}
			}
		}
	}
	pUp3 = powerUp3();

	//Traps
	var trap;
	function makeTrap() { //function to make this trap
		return { //return
			x:1410, //starts off of the screen to the right
			y:20, //starts at the top half
			w:20, //width is 20 pixels
			h:20, //height is 20 pixels
			draw:function() { //draws the function
				ctx.fillStyle = 'green'; //green trap
				ctx.fillRect(this.x,this.y,this.w,this.h); //draw this trap
			},
			move:function() { //trap movement
				if (peopleSaved >= 15) { //trap initiates when you have saved 15 people
					this.x -= 30; //begins the trap
				}
			}
		}
	}
	trap = makeTrap(); //trap array becomes this function
	var trap2;
	function makeTrap2() {
		return {
			x:1410,
			y:70,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 30) {
					this.x -= 30;
				}
			}
		}
	}
	trap2 = makeTrap2();
	var trap3;
	function makeTrap3() {
		return {
			x:1410,
			y:120,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 15) {
					this.x -= 30;
				}
			}
		}
	}
	trap3 = makeTrap3();
	var trap4;
	function makeTrap4() {
		return {
			x:1410,
			y:170,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 30) {
					this.x -= 30;
				}
			}
		}
	}
	trap4 = makeTrap4();
	var trap5;
	function makeTrap5() {
		return {
			x:1410,
			y:220,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 15) {
					this.x -= 30;
				}
			}
		}
	}
	trap5 = makeTrap5();
	var trap6;
	function makeTrap6() {
		return {
			x:1410,
			y:270,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 30) {
					this.x -= 30;
				}
			}
		}
	}
	trap6 = makeTrap6();
	var trap7;
	function makeTrap7() {
		return {
			x:1410,
			y:320,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 15) {
					this.x -= 30;
				}
			}
		}
	}
	trap7 = makeTrap7();
	var trap8;
	function makeTrap8() {
		return {
			x:1410,
			y:370,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 30) {
					this.x -= 30;
				}
			}
		}
	}
	trap8 = makeTrap8();
	var trap9;
	function makeTrap9() {
		return {
			x:1410,
			y:420,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 15) {
					this.x -= 30;
				}
			}
		}
	}
	trap9 = makeTrap9();
	var trap10;
	function makeTrap10() {
		return {
			x:1410,
			y:470,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 30) {
					this.x -= 30;
				}
			}
		}
	}
	trap10 = makeTrap10();
	var trap11;
	function makeTrap11() {
		return {
			x:1410,
			y:520,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 15) {
					this.x -= 30;
				}
			}
		}
	}
	trap11 = makeTrap11();
	var trap12;
	function makeTrap12() {
		return {
			x:1410,
			y:570,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 30) {
					this.x -= 30;
				}
			}
		}
	}
	trap12 = makeTrap12();
	var trap13;
	function makeTrap13() {
		return {
			x:1410,
			y:620,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 15) {
					this.x -= 30;
				}
			}
		}
	}
	trap13 = makeTrap13();
	var trap14;
	function makeTrap14() {
		return {
			x:1410,
			y:670,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 30) {
					this.x -= 30;
				}
			}
		}
	}
	trap14 = makeTrap14();
	var trap15;
	function makeTrap15() {
		return {
			x:1410,
			y:720,
			w:20,
			h:20,
			draw:function() {
				ctx.fillStyle = 'green';
				ctx.fillRect(this.x,this.y,this.w,this.h);
			},
			move:function() {
				if (peopleSaved >= 15) {
					this.x -= 30;
				}
			}
		}
	}
	trap15 = makeTrap15();

	//Timer
	var countdown = 15; //cool down start value
	function gameTimer() { //function for a per second timer
		if (countdown <= 0) { //if the cool down finishes
			timer += 1; //increase the timer by 1
			countdown += 15; //reset the cool down
		}
		if (countdown > 0) { //if the cool down resets
			countdown -= 1; //start the cool down
		}
		ctx.fillStyle = 'white'; //white writing
		ctx.fillText('Time: ' + timer + ' s',650,30); //writing on screen
	}

	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	function paint()
	{

		//Main Menu
		if (screen == 0) {
			menuMusic.play();
			gameMusic.pause();
			ctx.drawImage(menuScreen,0,0,w,h);
			box(0); //Recursion
			ctx.fillRect(1000,62,200,30);
			ctx.font = '30px Arial';
			ctx.fillStyle = 'black';
			ctx.fillText('Credits',1055,88);
			ctx.fillText('Instructions',223,625);
			ctx.fillText('Play',675,625);
			ctx.fillText('High Scores',1018,624);
			ctx.font = '50px Arial';
			ctx.fillStyle = 'white';
		}

		//Instructions Page
		if (screen == 1) {
			menuMusic.play();
			gameMusic.pause();
			ctx.drawImage(instructions,0,0,w,h + 40);
			ctx.font = '40px Arial';
			ctx.fillStyle = 'white';
			ctx.fillRect(1160,177,200,30);
			ctx.fillStyle = 'black';
			ctx.fillText('Instructions',500,125);
			ctx.fillRect(470,130,260,1);
			ctx.fillText('Use the WASD keys to move',215,180);
			ctx.fillText('Save all civilians',215,235);
			ctx.fillRect(525,205,30,30);
			ctx.fillText('Avoid all zombies',215,290);
			ctx.fillText('Collect helpful power ups',215,345);
			ctx.fillText('Defeat the zombie boss',215,400);
			ctx.fillText('Watch out for the danger zone',215,455);
			ctx.font = '30px Arial';
			ctx.fillText('Back',1230,203);
			ctx.fillStyle = 'green';
			ctx.fillRect(545,260,30,30);
			ctx.fillStyle = 'aqua';
			ctx.fillRect(680,315,30,30);
			ctx.fillStyle = 'red';
			ctx.font = '40px Arial';
			ctx.fillText('Warning: Zombies teleport and duplicate!',215,510);

			//Algorithms
			var swap; //swap
			for (var i = 0; i < bSort.length; i++) { //runs when i is less than bSort.length
				if (bSort[i] > bSort[i+1]) { //if spot 1 is less than spot 2
					var temp = bSort[i] //temp variable becomes spot 1
					bSort[i] = bSort[i+1]; //while spot 2 takes the place of spot 1
					bSort[i+1] = temp; //spot 2 now becomes the temp variable
					swap = true; //swaps
				}
			}

			for (var i = 0; i < bSort.length; i++) { //for the length of the array
				ctx.font = '10px Arial'; //font is 10 pixels Arial
				ctx.fillStyle = 'black'; //black writing
				ctx.fillText(bSort[i],170,100 + i * 20); //write it on the left side of the scroll
				ctx.fillText(bSort[i],1090,100 + i * 20); //write it also on the right side of the scroll
			}
		}

		//Game Screen
		if (screen == 2) {
			menuMusic.pause();
			gameMusic.play();
			ctx.fillStyle = 'black';
			ctx.fillRect(0,0,w,h);
			ctx.fillStyle = 'white';

			//2D Array
			for (var i = 0; i < blockX; i++) { //for all the blocks across the X-axis (140)
				for (var j = 0; j < blockY; j++) { //and for all the blocks down the Y-axis (70)
					ctx.fillStyle = "black";
					ctx.fillRect(1.1 * pSizeX * i, 1.1 * pSizeY * j, pSizeX, pSizeY); //draw a square in each spot
				}
			}

			if (peopleSaved >= 35 && peopleSaved < 40) { //if you have saved 35 people
				ctx.drawImage(dangerZone,1050,0,350,h); //draws the danger zone (where the boss spawns)
			}

			if (peopleSaved >= 40 && health > 0) { //if you have saved 40 people and still alive
				boss.draw(); //create the zombie boss
				boss.move(); //create the zombie boss
				boss.gun(); //create the zombie boss
				boss.gunMove(); //create the zombie boss
				boss.shooting(); //create the zombie boss
				if (px <= boss.x + 350 && py <= boss.y + 350 && px >= boss.x && py >= boss.y) { //if you are inside of the boss
					health -= 500; //instantly die
				}
				if (px <= boss.gunX + 30 && py <= boss.gunY + 30 && px >= boss.gunX - 30 && py >= boss.gunY - 30) {
					health -= 5;
				}
			}

			//Player
			ctx.fillStyle = 'red'; //red player
			ctx.fillRect(px,py,pSize,pSize); //draws player
			if (px < 0) { //if you are at the very left of the screen
				px += pSize; //reverse its direction
			}
			if (py < 0) { //if you are at the very top of the screen
				py += pSize; //reverse its direction
			}
			if (px > w - pSize) { //if you are at the very right of the screen
				px -= pSize; //reverse its direction
			}
			if (py > h - pSize) { //if you are at the very bottom of the screen
				py -= pSize; //reverse its direction
			}
			function move() { //function to move the player
				if (left == true) { //if you are pressing the "a" key
					px -= speed; //move the player left
				}
				if (up == true) { //if you are pressing the "w" key
					py -= speed; //move the player up
				}
				if (right == true) { //if you are pressing the "d" key
					px += speed; //move the player right
				}
				if (down == true) { //if you are pressing the "s" key
					py += speed; //move the player down
				}
			}
			move(); //calls the move function

			//Classes & Objects
			for (var i = 0; i < numOfPeople; i++) { //for the number of people
				if (px > people[i].x - 20 && px < people[i].x + 20 && py > people[i].y - 20 && py < people[i].y + 20) { //if your player is over a civilian
					people[i].x = 2000; //move the civilian off of the screen
					peopleSaved += 1; //add 1 to peopleSaved
					numOfZombie += 1; //add 1 to the number of zombies
					zombie.push(makeZombie()); //push this new zombie into the array
					for (var i = 0; i < numOfZombie; i++) { //for the new number of zombies
						zombie[i] = makeZombie(); //this new number equals their function
						zombie[i].draw(); //this new number equals the draw function
						zombie[i].move(); //this new number equals the move function
					}
					people[i].saved == true; //you have saved a person
				}
				if (people[i].saved == true) { //if you have saved a person
					numOfPeople -= 1; //subtract 1 to the people remaining
					people.splice(i, 1); //splice that person you saved out of the array
				}
				people[i].draw(); //draw the people
			}

			//Classes & Objects
			for (var i = 0; i < numOfZombie; i++) { //for the number of zombies
				zombie[i].draw(); //draw this amount of zombies
				zombie[i].move(); //zombie movement
			}

			//Power Ups
			if (px > pUp.x - 20 && px < pUp.x + 20 && py > pUp.y - 20 && py < pUp.y + 20) { //if you collect the power up
				pUp.x = 2000; //power up moves off of the screen
				health += 50; //your health increases by 50
			}
			pUp.draw(); //draw this power up
			pUp.move(); //power up movement
			if (px > pUp2.x - 20 && px < pUp2.x + 20 && py > pUp2.y - 20 && py < pUp2.y + 20) {
				pUp2.x = 2000;
				health += 50;
			}
			pUp2.draw();
			pUp2.move();
			if (px > pUp3.x - 20 && px < pUp3.x + 20 && py > pUp3.y - 20 && py < pUp3.y + 20) { //if you collect the power up
				pUp3.x = 2000; //power up moves off of the screen
				speed += 4; //makes your player move faster
				timerStart += 1; //prevents it from being a permanent power up
			}
			pUp3.draw();
			pUp3.move();
			if (timerStart == 1) { //if you collect the speed boost power up
				speedTimer += 1; //timer for the speed boost starts
			}
			if (speedTimer == 200) { //after 12 seconds
				speed -= 4; //speed goes back to normal
			}

			//Traps
			if (px > trap.x - 20 && px < trap.x + 20 && py > trap.y - 20 && py < trap.y + 20) { //if you get hit by the trap
				health -= 10; //your health decreases by 10
			}
			trap.draw(); //draw this trap
			trap.move(); //trap movement
			if (px > trap2.x - 20 && px < trap2.x + 20 && py > trap2.y - 20 && py < trap2.y + 20) {
				health -= 10;
			}
			trap2.draw();
			trap2.move();
			if (px > trap3.x - 20 && px < trap3.x + 20 && py > trap3.y - 20 && py < trap3.y + 20) {
				health -= 10;
			}
			trap3.draw();
			trap3.move();
			if (px > trap4.x - 20 && px < trap4.x + 20 && py > trap4.y - 20 && py < trap4.y + 20) {
				health -= 10;
			}
			trap4.draw();
			trap4.move();
			if (px > trap5.x - 20 && px < trap5.x + 20 && py > trap5.y - 20 && py < trap5.y + 20) {
				health -= 10;
			}
			trap5.draw();
			trap5.move();
			if (px > trap6.x - 20 && px < trap6.x + 20 && py > trap6.y - 20 && py < trap6.y + 20) {
				health -= 10;
			}
			trap6.draw();
			trap6.move();
			if (px > trap7.x - 20 && px < trap7.x + 20 && py > trap7.y - 20 && py < trap7.y + 20) {
				health -= 10;
			}
			trap7.draw();
			trap7.move();
			if (px > trap8.x - 20 && px < trap8.x + 20 && py > trap8.y - 20 && py < trap8.y + 20) {
				health -= 10;
			}
			trap8.draw();
			trap8.move();
			if (px > trap9.x - 20 && px < trap9.x + 20 && py > trap9.y - 20 && py < trap9.y + 20) {
				health -= 10;
			}
			trap9.draw();
			trap9.move();
			if (px > trap10.x - 20 && px < trap10.x + 20 && py > trap10.y - 20 && py < trap10.y + 20) {
				health -= 10;
			}
			trap10.draw();
			trap10.move();
			if (px > trap11.x - 20 && px < trap11.x + 20 && py > trap11.y - 20 && py < trap11.y + 20) {
				health -= 10;
			}
			trap11.draw();
			trap11.move();
			if (px > trap12.x - 20 && px < trap12.x + 20 && py > trap12.y - 20 && py < trap12.y + 20) {
				health -= 10;
			}
			trap12.draw();
			trap12.move();
			if (px > trap13.x - 20 && px < trap13.x + 20 && py > trap13.y - 20 && py < trap13.y + 20) {
				health -= 10;
			}
			trap13.draw();
			trap13.move();
			if (px > trap14.x - 20 && px < trap14.x + 20 && py > trap14.y - 20 && py < trap14.y + 20) {
				health -= 10;
			}
			trap14.draw();
			trap14.move();
			if (px > trap15.x - 20 && px < trap15.x + 20 && py > trap15.y - 20 && py < trap15.y + 20) {
				health -= 10;
			}
			trap15.draw();
			trap15.move();

			//HUD (Heads-Up Display)
			ctx.font = '20px Arial';
			ctx.fillStyle = 'white';
			if (stopTimer == 0) { //prevents the timer from counting up in the win / lose screen
				gameTimer(); //timer function
			}
			ctx.fillText('Health: ' + health,1290,30);
			ctx.fillText('Civilians Saved: ' + peopleSaved + ' / 50',10,30);
		}

		//High Score Page
		if (screen == 3) {
			menuMusic.play();
			gameMusic.pause();
			ctx.fillStyle = 'black';
			ctx.fillRect(0,0,w,h);
			ctx.fillStyle = 'white';
			ctx.font = '80px Arial';
			ctx.fillText('High Scores',500,75);
			ctx.fillRect(730,100,1,h);
			ctx.fillRect(100,100,1,h);
			ctx.fillRect(0,100,w,1);
			line(0); //Recursion
			ctx.font = '30px Arial';
			ctx.fillText('Rank',15,160);
			ctx.fillText('Name',120,160);
			ctx.fillText('Time Completed (Seconds)',750,160);

			//////////////////////////////////////////////////////
			////////	Algorithms
			////////////////////////////////////////////////////

			//Algorithms (Selection Sort)
			var lowestNum; //lowestNum
			var swap; //swap
			for (var i = 0; i < score.length; i++) { //for the length of the array
				lowestNum = i; //lowestNum becomes a random index value in the array
				for (var j = i + 1; j < score.length; j++) { //for the length of the array
					if (score[j] < score[lowestNum]) { //if the value after lowestNum is less than its current value
						lowestNum = j; //lowestNum becomes that value
					}
				}
				if (!(i == lowestNum)) { //if i index value does not equal lowestNum
					var temp = score[lowestNum]; //temp becomes the value of lowestNum
					score[lowestNum] = score[i]; //the lowestNum array index becomes that i index value
					score[i] = temp; //the i array index takes the value of temp
					swap = true; //the numbers swap
				}
			}
			for (var i = 0; i < score.length; i++) { //for the length of the array
				ctx.fillText(score[i],750,260 + i * 100); //write all of the numbers
			}

			//Recursion
			rank(1); //counter starts at 1
			ctx.fillRect(1060,35,200,30);
			ctx.fillStyle = 'black';
			ctx.fillText('Back',1130,60);
			nameRank(0); //counter starts at 0
		}

		//Credits
		if (screen == 4) {
			menuMusic.play();
			gameMusic.pause();
			ctx.fillStyle = 'black';
			ctx.fillRect(0,0,w,h);
			lineCredits(0); //counter starts at 0
			ctx.fillText('Role',120,160);
			role(0); //counter starts at 0
			ctx.font = '80px Arial';
			ctx.fillStyle = 'white';
			ctx.fillText('Credits',600,75);
			ctx.font = '30px Arial';
			ctx.fillText('Name',750,160);
			Paolo(0); //counter starts at 0
			CallofDuty(0);
			ctx.fillRect(730,100,1,h);
			ctx.fillRect(100,100,1,h);
			ctx.fillRect(0,100,w,1);
			ctx.fillRect(1060,35,200,30);
			ctx.fillStyle = 'black';
			ctx.fillText('Back',1130,60);

			//Algorithms (Insertion Sort)
			ctx.font = '30px Arial'; //font size 30 pixels and font style Arial
			ctx.fillStyle = 'white'; //white writing
			var x; //x variable
			var temp2; //temporary number
			var swap2; //swaps the number
			for (var i = 1; i < number.length; i++) { //for the length of the array
				x = i; //variable x becomes the value of i
				if (x > 0 && number[x] < number[x-1]) { //if a number before a number is greater
					temp2 = number[x-1]; //the number before becomes temporary
					number[x-1] = number[x]; //the value of the number before becomes the value of the number after
					number[x] = temp2; //the number that is temporary takes the after spot
					swapped = true; //swaps the numbers
				}
			}
			for (var i = 0; i < number.length; i++) { //for the length of the array
				ctx.fillText(number[i],43,260 + i * 100); //write the numbers on the screen
			}
		}

		//Win Screen
		if (peopleSaved >= 50 && health > 0) { //if you beat the game
			stopTimer += 1; //stop counting up the timer
			healthStop += 1; //stop counting down the health
			ctx.drawImage(winScreen,0,0,w,h + 30); //draws the win screen
			ctx.fillStyle = 'black'; //black text
			ctx.font = '30px Arial'; //font size 30 pixels and font style Arial
			ctx.fillText('Time: ' + timer + ' s', 1090,430); //writes your completed time
			ctx.fillRect(1070,340,200,30); //draws the play again button
			ctx.fillStyle = 'white'; //white writing
			ctx.font = '30px Arial'; //font size 30 pixels and font style Arial 
			ctx.fillText('Play Again?',1090,365); //play again text
		}

		//Lose Screen
		if (health <= 0) { //if you die
			stopTimer += 1; //stop counting up the timer
			healthStop += 1; //stop counting down the health
			ctx.drawImage(loseScreen,0,0,w,h); //draws the lose screen
			ctx.fillStyle = 'lime'; //lime text
			ctx.font = '30px Arial'; //font size 30 pixels and font style Arial
			ctx.fillText('Time: ' + timer + ' s', 615,230); //writes the time when you died
			ctx.fillRect(590,465,200,30); //draws the play again button
			ctx.fillStyle = 'black'; //black writing
			ctx.font = '30px Arial'; //font size 30 pixels and font style Arial 
			ctx.fillText('Try Again?',620,490); //play again text
		}

	}////////////////////////////////////////////////////////////////////////////////END PAINT / GAME ENGINE

	//////////////////////////////////////////////////////
	////////	Recursion
	////////////////////////////////////////////////////

	function box(count) { //recursion for the main menu buttons
		ctx.fillStyle = 'white'; //white
		ctx.fillRect(200 + count * 400, 600, 200,30); //spaces each button out
		if (count > 1) {} //if the value of count is greater than 1 do nothing (base case)
		else box(count + 1); //else add 1 to count (recursive case)
	}
	function line(count2) {
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 100 + count2 * 100, w, 1);
		if (count2 > 4) {}
		else line(count2 + 1);
	}
	function rank(count3) {
		ctx.fillStyle = 'white';
		ctx.fillText(count3,43,160 + count3 * 100);
		if (count3 > 4) {}
		else rank(count3 + 1);
	}
	function nameRank(count4) {
		ctx.fillStyle = 'white';
		ctx.fillText(names[0],120,260);
		ctx.fillText(names[1],120,360);
		ctx.fillText(names[2],120,460);
		ctx.fillText(names[3],120,560);
		ctx.fillText(names[4],120,660);
		if (count4 > 1) {}
		else nameRank(count4 + 1);
	}
	function lineCredits(count5) {
		ctx.fillStyle = 'white';
		ctx.fillRect(0,100 + count5 * 100,w,1);
		if (count5 > 4) {}
		else lineCredits(count5 + 1);
	}
	function role(count6) {
		ctx.fillStyle = 'white';
		for (var i = 0; i < roles.length; i++) {
			ctx.fillText(roles[i],120,260 + i * 100);
		}
		if (count6 > 1) {}
		else role(count6 + 1);
	}
	function Paolo(count7) {
		ctx.fillStyle = 'white';
		for (var i = 0; i < 4; i++) {
			ctx.fillText('Paolo Torres',750,260 + i * 100);
		}
		if (count7 > 1) {}
		else Paolo(count7 + 1);
	}
	function CallofDuty(count8) {
		ctx.fillStyle = 'white';
		ctx.fillText('Call of Duty',750,660);
		if (count8 > 1) {}
		else CallofDuty(count8 + 1);
	}

	//Algorithms (Binary Search)
	function bSearch(number, searchNum, min, max) { //function for binary search
		var mid; //middle value
		if (number[min] == searchNum) { //if the lowest number equals the number input
			alert('This Number is at Index: ' + min + '.'); //alert this number
		}
		if (number[max] == searchNum) { //if the lowest number equals the number input
			alert('This Number is at Index: ' + max + '.'); //alert this number
		}
		mid = (min + max) / 2; //middle number is the lowest number plus the highest number divided by 2
		if (number[mid] > searchNum) { //if the middle number is greater than the number input
			bSearch(number, searchNum, min+1, mid); //add 1 to the lowest number
		}
		if (number[mid] < searchNum) { //if the middle number is less than the number input
			bSearch(number, searchNum, mid, max-1); //subtract 1 to the highest number
		}
		if (number[mid] == searchNum) { //if the middle number equals the number input
			alert('This Number is at Index: ' + mid + '.'); //alert this number
		}
	}

	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	/////	MOUSE LISTENER 
	//////////////////////////////////////////////////////
	/////////////////////////////////////////////////////






	/////////////////
	// Mouse Click
	///////////////
	canvas.addEventListener('click', function (evt) {

		//Button Click Checking
		if (screen == 0 && mx <= 400 && my <= 630 && mx >= 200 && my >= 600) {
			screen += 1; //instructions page
			buttonClick.play();
		}
		if (screen == 1 && mx <=  1360 && my <= 210 && mx >= 1160 && my >= 180) {
			screen -= 1; //back to main menu
			clickBack.play();
		}
		if (screen == 0 && mx <= 800 && my <= 630 && mx >= 600 && my >= 600) {
			screen += 2; //game screen
			buttonClick.play();
		}
		if (screen == 0 && mx <= 1200 && my <= 630 && mx >= 1000 && my >= 600) {
			screen += 3; //high scores page
			buttonClick.play();
		}
		if (screen == 3 && mx <= 1260 && my <= 65 && mx >= 1060 && my >= 35) {
			screen -= 3; //back to main menu
			clickBack.play();
		}
		if (screen == 0 && mx <= 1200 && my <= 90 && mx >= 1000 && my >= 60) {
			screen += 4; //credits page
			buttonClick.play();
		}
		if (screen == 4 && mx <= 1260 && my <= 65 && mx >= 1060 && my >= 35) {
			screen -= 4; //back to main menu
			clickBack.play();
		}
		if (peopleSaved >= 50 && health > 0) { //on the win screen
			if (mx <= 1260 && my <= 370 && mx >= 1060 && my >= 340) { //if you click the play again button
				location.reload(); //reload the page
			}
		}
		if (health <= 0) { //on the lose screen
			if (mx <= 780 && my <= 480 && mx >= 580 && my >= 450) { //if you click the play again button
				location.reload(); //reload the page
			}
		}

	}, false);




	canvas.addEventListener ('mouseout', function() {pause = true;}, false);
	canvas.addEventListener ('mouseover', function() {pause = false;}, false);

      	canvas.addEventListener('mousemove', function(evt) {
        	var mousePos = getMousePos(canvas, evt);

		mx = mousePos.x;
		my = mousePos.y;

      	}, false);


	function getMousePos(canvas, evt) 
	{
	        var rect = canvas.getBoundingClientRect();
        	return {
          		x: evt.clientX - rect.left,
          		y: evt.clientY - rect.top
        		};
      	}


	///////////////////////////////////
	//////////////////////////////////
	////////	KEY BOARD INPUT
	////////////////////////////////

	window.addEventListener('keydown', function(evt) {
		var key = evt.keyCode;

		//Algorithms
		if (key == 13 && screen == 3) { //if you press the enter key in the high scores page
			search = true; //search equals true
			if (search == true) { //if you are searching for a number
			choose = Number(prompt('Search for any number in the array.','Type here')); //prompt the user for a number in the array
			}
			if (search == true) { //if you are searching for a number
				var k = 0; //k equals 0
				while (choose != score[k] && k <= score.length) { //while the number you searched for does not equal an array value
					k += 1; //increase k by 1
				}
				if (choose == score[k]) { //if the number you searched for does equal an array value
					alert('This number is at index: ' + k +'.'); //alert the index value
				}
				else alert('The number you searched for is not in the array.'); //else alert that the value is not in the array
			}
		}
		if (key == 13 && screen == 4) { //if you press the enter key in the credits page
			search2 = true; //search equals true
		}
		if (search2 == true) { //if you are searching for a number
			searchNum = prompt('Search for any number in the array.','Type here'); //prompt the user for a number
			while(!(searchNum >= number[0] && searchNum <= number[4])) { //while the number they enter does not equal a value in the array
				searchNum = prompt('This Number is Not in the Array!','Try Again'); //prompt the user again
			}
			bSearch(number,searchNum,0,4); //starting parameters for the binary search
			search2 = false; //prevents it from prompting forever
		}

		//Movement Checking
		function movePlayerTrue() { //if you are pressing the movement keys
			if (key == 65) { //if you press the "a" key
				left = true; //move left
			}
			if (key == 87) { //if you press the "w" key
				up = true; //move up
			}
			if (key == 68) { //if you press the "d" key
				right = true; //move right
			}
			if (key == 83) { //if you press the "s" key
				down = true; //move down
			}
		}
		movePlayerTrue(); //calls the function
	}, false);
	
	//Movement Checking
	window.addEventListener('keyup', function(evt) {
		var key = evt.keyCode;
		function movePlayerFalse() { //if you are not pressing the movement keys
			if (key == 65) { //if you do not press the "a" key
				left = false; //do not move left
			}
			if (key == 87) { //if you do not press the "w" key
				up = false; //do not move up
			}
			if (key == 68) { //if you do not press the "d" key
				right = false; //do not move right
			}
			if (key == 83) { //if you do not press the "s" key
				down = false; //do not move down
			}
		}
		movePlayerFalse(); //calls the function
	}, false);

})

//Paolo Torres