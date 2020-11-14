
const players = {};
const bullets = [];
const zombies = {};
var gamePage = document.querySelector("#game-page");
var startButton= document.querySelector("#start");
let createHero = (player) => {
    const {x, y, health, id} = player;
    const heroRadius = 25;
    players[id] = {x, y, radius: heroRadius, health:0};
    let hero = document.createElement("div");
    hero.id = "hero";
    hero.style.backgroundImage = "url(../images/Cowboy.png)";
    hero.style.backgroundSize = "90%";
    hero.style.backgroundRepeat = "no-repeat";
    hero.style.left = players[id].x + 'px';
    hero.style.top = players[id].y + 'px';
    hero.style.position = 'absolute';
    hero.style.width = players[id].radius * 2 + 'px';
    hero.style.height = players[id].radius * 2 + 'px';
    document.getElementById('board').appendChild(hero);
    healthBar = document.createElement('div');
    healthBar.classList.add('health');
    healthBar.style.left = players[id].x -  6+ 'px';
    healthBar.style.top = players[id].y - 15 + 'px';
    healthBar.id = id;
    document.getElementById('board').appendChild(healthBar);
    filled = document.createElement('div');
    filled.classList.add('filled');
    filled.style.width = (health / 100) * 60 + 'px';
    healthBar.appendChild(filled);
    players[id].hero = hero;
};

document.addEventListener('click', e => {

    x = players[socket.id].x + Math.cos(players[socket.id].rotation) * 15;
    y = players[socket.id].y + Math.sin(players[socket.id].rotation) * 10;
    dx = Math.cos(Math.atan((e.clientY-window.innerHeight/2)/(e.clientX-window.innerWidth/2)))
    dy = Math.sin(Math.atan((e.clientY-window.innerHeight/2)/(e.clientX-window.innerWidth/2)))
    if ((e.clientX-window.innerWidth/2) < 0){
        dx = -dx;
        dy = -dy;
    }
    socket.emit("bullet", x, y, dx, dy)
});

document.addEventListener('mousemove', e => {
    let newAngle = getAngle( (e.clientX-window.innerWidth/2),(e.clientY-window.innerHeight/2));
    socket.emit('rotatePlayer', newAngle);
})


socket.on("rotatePlayer", ({rotation, id}) => {

    players[id].rotation = rotation;
    players[id].hero.style.transform = `rotate(${(rotation * (180/Math.PI)) + 90}deg)`;

})

socket.on('move', ({x, y, id}) => {
    if (id === socket.id) {
        gameX += players[id].x - x;
        gameY += players[id].y - y;
        document.getElementById("board").style.left = gameX + 'px';
        document.getElementById("board").style.top = gameY + 'px';
    }
    players[id].x = x;
    players[id].y = y;
    document.getElementById(id).style.left = players[id].x - 6 + 'px';    
    document.getElementById(id).style.top = players[id].y - 15 + 'px';                                                                                 
    players[id].hero.style.left = players[id].x + 'px';
    players[id].hero.style.top = players[id].y + 'px';
})
socket.on("createBullet", (x, y, dx, dy, id) => {
    let bullet = document.createElement("div")
    bullet.id = "bullet";
    bullet.style.left = x + 'px';
    bullet.style.top = y + 'px';
    bullet.style.width = "9px";
    bullet.style.height = "9px";
    bullet.style.position = 'absolute';
    bullet.style.backgroundColor = "grey";
    bullet.style.borderRadius = "50%";
    document.getElementById('board').appendChild(bullet)
    bullets.push({x, y, dx, dy, bullet, id});
});

startButton.onclick = function () {
    socket.emit("zombie", window.innerWidth, window.innerHeight)
}
socket.on("createZombie", (x, y, id, health) => {
    if (startButton !== null) {
        gamePage.removeChild(startButton);
        startButton = null;
    }
    let zombie = document.createElement("div")
    zombie.id = "zombie";
    zombie.style.left = x + "px";
    zombie.style.top = y + 'px';
    zombie.style.border = "5px solid transparent";
    zombie.style.width = "40px";
    zombie.style.borderRadius = "50%";
    zombie.style.height = "40px";
    zombie.style.backgroundSize = "100%";
    zombie.style.backgroundRepeat = "no-repeat";
    zombie.style.position = 'absolute';
    zombie.style.backgroundImage = "url(../images/Zombie.png";
    document.getElementById('board').appendChild(zombie)
    zombies[id] = {x, y, zombie, id};
    healthBar = document.createElement('div');
    healthBar.classList.add('health');
    healthBar.style.left = x -  6+ 'px';
    healthBar.style.top = y - 15 + 'px';
    healthBar.id = id;
    document.getElementById('board').appendChild(healthBar);
    filled = document.createElement('div');
    filled.classList.add('filled');
    filled.style.width = (health / 100) * 60 + 'px';
    healthBar.appendChild(filled);
});

socket.on("moveZombie", thisZombie => {
    const {x, y, rotation, id} = thisZombie;
    if (zombies[id]) {
        zombies[id].x = x;
        zombies[id].y = y;
        if (document.getElementById(id)) {
            document.getElementById(id).style.left = x -  6+ 'px';
            document.getElementById(id).style.top = y - 15 + 'px';
        }
        zombies[id].zombie.style.left = x + 'px';
        zombies[id].zombie.style.top = y + 'px';
        zombies[id].zombie.style.transform = `rotate(${rotation*(180/Math.PI) + 90}deg)`;
    }
})

socket.on("deleteZombie", id => {
    document.getElementById('board').removeChild(document.getElementById(id));
    document.getElementById('board').removeChild(zombies[id].zombie);
    delete zombies[id];
});

socket.on("hitPlayer", (id, health) => {
    players[id].health = health;
    document.getElementById(id).firstChild.style.width = (health / 100) * 60 + 'px';
})

socket.on("hitZombie", ({id, health, x, y}) => {
    zombies[id].x = x;
    zombies[id].y = y;
    zombies[id].health = health;
    document.getElementById(id).firstChild.style.width = (health / 100) * 60 + 'px';
    document.getElementById(id).style.left = x -  6+ 'px';
    document.getElementById(id).style.top = y - 15 + 'px';
    zombies[id].zombie.style.left = x + 'px';
    zombies[id].zombie.style.top = y + 'px';
});

socket.on("moveBullet", (index, x, y) => {
    bullet = bullets.find(bul => bul.id == index);
    if (bullet) {
        bullet.x = x;
        bullet.y = y;
        bullet.bullet.style.left = bullet.x + 'px';
        bullet.bullet.style.top = bullet.y + 'px';
    }
})

socket.on('deleteBullet', id => {
    index = bullets.findIndex(bul => bul.id == id);
    document.getElementById('board').removeChild(bullets[index].bullet);
    bullets.splice(index, 1);
});