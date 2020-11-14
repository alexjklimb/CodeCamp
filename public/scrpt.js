const socket = io();
const keys = {};
let gameX;
let gameY;
let gameWidth;
let gameHeight;


document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
})

document.addEventListener('keyup', function(e) {
    keys[e.key] = false;
})

socket.on("createGame", (width, height, allPlayers, allZombies) => {
    let board = document.createElement('div');
    board.id = 'board';
    board.style.height = width + 'px';
    board.style.width = height + 'px';
    board.style.position = 'absolute';
    board.style.zIndex = "-2"
    gameX = -width/2 + window.innerWidth/2;
    gameY = -height/2 + window.innerHeight/2;
    gameWidth = width;
    gameHeight = height;
    board.style.left = -width/2 + window.innerWidth/2 + 'px';
    board.style.top = -height/2 + window.innerHeight/2 + 'px';
    board.style.backgroundImage = "url(../images/grass.png";
    gamePage.appendChild(board)
    let tower = document.createElement("div");
    tower.id = "tower";
    tower.style.backgroundImage = "url(../images/castle.png)";
    tower.style.backgroundSize = '170%';
    tower.style.backgroundPosition = '-105px -60px';
    tower.style.width = "300px";
    tower.style.height = "300px";
    tower.style.position = 'absolute';
    tower.style.left = width/2 - 150 + 'px';
    tower.style.top = height/2 - 150 + 'px';
    document.getElementById('board').appendChild(tower); 
    for (player in allPlayers) {
        createHero(allPlayers[player]);
    }
    for (key in allZombies) {
        let newZombie = allZombies[key];
        if (startButton !== null) {
            gamePage.removeChild(startButton);
            startButton = null;
        }
        let zombie = document.createElement("div")
        zombie.id = "zombie";
        zombie.style.left = newZombie.x + "px";
        zombie.style.top = newZombie.y + 'px';
        zombie.style.border = "5px solid transparent";
        zombie.style.width = "40px";
        zombie.style.borderRadius = "50%";
        zombie.style.height = "40px";
        zombie.style.backgroundSize = "100%";
        zombie.style.backgroundRepeat = "no-repeat";
        zombie.style.position = 'absolute';
        zombie.style.backgroundImage = "url(../images/Zombie.png";
        document.getElementById('board').appendChild(zombie)
        zombies[newZombie.id] = {x: newZombie.x, y: newZombie.y, id: newZombie.id, health:100, zombie};
        healthBar = document.createElement('div');
        healthBar.classList.add('health');
        healthBar.style.left = newZombie.x -  6+ 'px';
        healthBar.style.top = newZombie.y - 15 + 'px';
        healthBar.id = newZombie.id;
        document.getElementById('board').appendChild(healthBar);
        filled = document.createElement('div');
        filled.classList.add('filled');
        filled.style.width = (newZombie.health / 100) * 60 + 'px';
        healthBar.appendChild(filled);
    }
});

socket.on('createPlayer', (x, y, id) => {
    createHero(x, y, id);
})

socket.on('removePlayer', id => {
    document.getElementById('board').removeChild(players[id].hero);
    document.getElementById('board').removeChild(document.getElementById(id));
    delete players[id];
})
function getAngle(x, y) {
    let angle = Math.atan(y/x);
    if (x < 0) angle = angle - Math.PI;
    return angle
}

setInterval(function() {
    let dx = 0;
    let dy = 0;
    if (keys['w']) {
        dy = -1;
    }
    if (keys['a']) {
        dx = -1;
    }
    if (keys['s']) {
        dy = 1;
    }
    if (keys['d']) {
        dx = 1;
    }
    
    if (dx + dy > 1) {
       if (dx < 0) dx = -Math.cos(Math.PI/4);
       else dx = Math.cos(Math.PI/4);
       if (dy < 0) dy = -Math.cos(Math.PI/4);
       else dy = Math.cos(Math.PI/4);
    }
    if (dx != 0 || dy != 0) socket.emit('move', dx, dy);

}, 10)