//~~~~~~~~~~~~~~~~~~~~~~~//
// Author: James Sudimak //
// Battle game prototype //
//   Date: 02.08.2016    //
//~~~~~~~~~~~~~~~~~~~~~~~//


// Player object template
function Player(hp, atk, mp) {
	this.hp = hp;
	this.atk = atk;
	this.mp = mp;
}

// Enemy object template
function Enemy(name, hp, atk) {
	this.name = name;
	this.hp = hp;
	this.atk = atk;
}

// Player object instantiation
var player = new Player(200, 10, 50);

// Enemy object instantiation
var enemyRat = new Enemy("Rat", 20, 5);
var enemyOgre = new Enemy("Ogre", 60, 15);
var enemyKraken = new Enemy("Kraken", 120, 30);
var enemyDragon = new Enemy("Dragon", 180, 45);
var enemyBat = new Enemy("Bat", 230, 20);

// Function declares RNG object
var RNG = function(max, min) {
	var rng = Math.floor((Math.random() * max) + min);
	return rng;
} // End function

// Function returns player's health bar
var healthBar = function(curHealth, maxHealth) {
	if (curHealth < 0) {
		curHealth = 0;
	}
	var bar = "||";
	var difference = maxHealth - curHealth;
	for (var i = 0; i < curHealth; i+=10) {
		bar += "=";
	}
	for (var j = 0; j < difference; j+=10) {
		bar += "-";
	}
	bar += "||";
	
	return bar;
} // End function

// Function returns one of the enemy objects instantiated above
var encounter = function() {
	var num = Math.floor((Math.random() * 13) + 1);
	if (num >= 1 && num <= 3) {
		return enemyRat;
	} else if (num >= 4 && num <= 6) {
		return enemyOgre;
	} else if (num >= 7 && num <= 9) {
		return enemyKraken;
	} else if (num >= 10 && num <= 12) {
		return enemyDragon;
	} else { // 13 (1 in 13 chance)
		return enemyBat;
	}
} // End function


// MAIN //

// Battle condition variable
var battle = true;
// Player max HP variable
var playerMaxHP = player.hp;
// Player health bar variable
var playerHealthBar;
// Player move variable
var playerAction;
// Player attack attempt variable
var playAtkNum;
// Run attempt variable
var runNum;
// Player overdrive counter
var overdriveCount = 0;
// Player overdrive value
var overdrive;
// Player healing counter
var playHealCount = 3;

// Generate enemy
var enemy = encounter();
// Store enemy's max HP
var enemyMaxHP = enemy.hp;
// Enemy health bar variable
var enemyHealthBar;
// Enemy attack attempt variable
var enemyAtkNum;
// Enemy attack value
var enemyAtk;
// Rat splinter variables
var splinter = 100;
var splinterAtk;
// Bat multihit variables
var multihitNum, multiHitDmg;
var multihitCounter = 1;

// Display enemy type and its appearance!
confirm("A wild " + enemy.name + " appears!");

// START BATTLE
top:
while (battle) {
	// PLAYER TURN!
	if (overdriveCount === 5) {
		confirm("OVERDRIVE ready!");
		playerAction = prompt("Your move:\nATTACK(atk, a)\nOVERDRIVE(o)\nHEAL(h)\nCHARGE(c)\nRUN(r)").toLowerCase();
	} else {
		playerAction = prompt("Your move:\nATTACK(atk, a)\nHEAL(h)\nCHARGE(c)\nRUN(r)").toLowerCase();
	}
if (playerAction === "attack" || playerAction === "atk" || playerAction === "a") {
		// Generate num between 1 and 4
		playAtkNum = RNG(4, 1);
		if (playAtkNum === 1) { // 1 is a miss
			confirm("You miss!");
		} else { // 2, 3, and 4 are a hit
			enemy.hp -= player.atk;
			enemyHealthBar = healthBar(enemy.hp, enemyMaxHP);
			if (enemy.hp < (-0.4 * enemyMaxHP)) {
				enemyHealthBar += "     OVERKILL";
			}
			confirm(enemy.name + " takes " + player.atk + " damage!\n" + enemy.name + 
			" HP: " + enemyHealthBar);
			if (overdriveCount < 5) {
				overdriveCount++;
			}
			// Dead?
			if (enemy.hp <= 0) {
				// Victory! End battle
				confirm("Victory! Wild " + enemy.name + " has been slain!");
				break;
			}
		}
	}
	else if (playerAction === "heal" || playerAction === "h") {
		if (playHealCount === 3) {
			player.hp += player.mp;
			if (player.hp > playerMaxHP) {
				player.hp -= (playerMaxHP - player.hp);
			}
			playerHealthBar = healthBar(player.hp, playerMaxHP);
			confirm("You heal yourself for " + player.mp + " HP!\n" + 
			"Player HP: " + playerHealthBar);
			playHealCount = 0;
		} else {
			confirm("HEAL is not yet ready!\n" + 
			"Turns remaining: " + (4 - playHealCount));
			continue top;
		}
	} else if (playerAction === "overdrive" || playerAction === "o") {
		if (overdriveCount === 5) {
			overdrive = player.atk * 3.2;
			enemy.hp -= overdrive;
			enemyHealthBar = healthBar(enemy.hp, enemyMaxHP);
			if (enemy.hp < (-0.4 * enemyMaxHP)) {
				enemyHealthBar += "     OVERKILL";
			}
			confirm("You used OVERDRIVE!\n" + enemy.name + " takes " + overdrive + 
			" damage!\n" + enemy.name + " HP: " + enemyHealthBar);
			overdriveCount = 0;
			// Dead?
			if (enemy.hp <= 0) {
				// Victory! End battle
				confirm("Victory! Wild " + enemy.name + " has been slain!");
				break;
			}
		}
		else { // No overdrive :[
			confirm("OVERDRIVE is not yet ready!\nAttacks remaining: " + (5 - overdriveCount));
			continue top;
		}
	} else if (playerAction === "charge" || playerAction === "c") {
		// Increase attack power
		player.atk += 10;
		confirm("You charge up.\nAttack power increased!");
	} else if (playerAction === "run" || playerAction === "r") {
		// Generate num between 1 and 3
		runNum = RNG(3, 1);
		if (runNum === 1 || runNum === 2) {
			confirm("Couldn't get away!");
		} else { // 3 is a run success!
			confirm("Got away safely!");
		}
	} else { // Invalid input
		// Return to top of loop
		continue top;
	}
	// Accumulate heal counter at end of player turn
	if (playHealCount < 3) {
		playHealCount++;
	}
	// Enemy dead? Player ran away successfully?
	if (runNum === 3 || enemy.hp <= 0) {
		// End battle
		break;
	}
	// ENEMY ATTACKS!
	// Generate num between 1 and 4
	enemyAtkNum = RNG(4, 1);
	if (enemyAtkNum === 1) { // 1 is a miss
		confirm(enemy.name + " misses!");
	} else { // 2, 3, and 4 are a hit
		if (enemy.name === "Rat") {
			splinter = RNG(60, 1);
			if (splinter === 50) {
				confirm(enemy.name + " used SPLINTERSPLINTERSPLINTERSPLINTERSPLINTER\n" + 
				"SPLINTERSPLINTERSPLINTERSPLINTERSPLINTERSPLINTER");
				splinterAtk = enemy.atk * 300;
				player.hp -= splinterAtk;
				playerHealthBar = healthBar(player.hp, playerMaxHP);
				confirm(enemy.name + " hits you for " + splinterAtk + " damage!\n" + 
				"Player HP: " + playerHealthBar);
				if (player.hp <= 0) {
					// Defeat! End battle
					confirm("Defeat! You have been slain.\nGAME OVER");
					battle = false;
				}
			} else {
				player.hp -= enemy.atk;
				playerHealthBar = healthBar(player.hp, playerMaxHP);
				confirm(enemy.name + " hits you for " + enemy.atk + " damage!\n" + 
				"Player HP: " + playerHealthBar);
				// Dead?
				if (player.hp <= 0) {
					// Defeat! End battle
					confirm("Defeat! You have been slain.\nGAME OVER");
					battle = false;
				}
			}
		}
		else if (enemy.name === "Bat") {
			player.hp -= enemy.atk;
			multihitNum = RNG(5, 1);
			while (multihitNum === 1 || multihitNum === 2) {
				player.hp -= enemy.atk;
				multihitCounter++;
				multihitNum = RNG(5, 1);
			}
			if (multihitCounter !== 1) { // Multihit!
				confirm("Wild " + enemy.name + " hit you " + multihitCounter + 
				" times!");
				multiHitDmg = (enemy.atk * multihitCounter);
				playerHealthBar = healthBar(player.hp, playerMaxHP);
				confirm(enemy.name + " hits you for " + multiHitDmg + " damage!\n" + 
				"Player HP: " + playerHealthBar);
				multihitCounter = 1;
				// Dead?
				if (player.hp <= 0) {
					// Defeat! End battle
					confirm("Defeat! You have been slain.\nGAME OVER");
					battle = false;
				}
			} else { // No multihit
				playerHealthBar = healthBar(player.hp, playerMaxHP);
				confirm(enemy.name + " hits you for " + enemy.atk + " damage!\n" + 
				"Player HP: " + playerHealthBar);
				// Dead?
				if (player.hp <= 0) {
					// Defeat! End battle
					confirm("Defeat! You have been slain.\nGAME OVER");
					battle = false;
				}
			}
		} else {
			player.hp -= enemy.atk;
			playerHealthBar = healthBar(player.hp, playerMaxHP);
			confirm(enemy.name + " hits you for " + enemy.atk + " damage!\n" + 
			"Player HP: " + playerHealthBar);
			// Dead?
			if (player.hp <= 0) {
				// Defeat! End battle
				confirm("Defeat! You have been slain.\nGAME OVER");
				battle = false;
			}
		}
	}
} // End battle