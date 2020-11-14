// index.js
// Get our dependencies
const path = require('path'); 
const http = require('http');
const express = require("express");
const socketio = require("socket.io");

// initialize our express app
var app = express();
const server = http.createServer(app);
const io = socketio(server);
var port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
let counter = 0;
let players = {};
let zombies = {};
let bullets = {};
let gameHeight = 3000;
let gameWidth = 3000;
let zombieCount = 0;
let bulletCount = 0;
let spawning = false;
let spawnTime = 0;
let spawnSpeed = 1000;
io.on('connection', socket => {
    if (counter === 0) socket.emit('createStartButton', counter);
    if (!players[socket.id]) {
        socket.emit('createGame', gameWidth, gameHeight, players, zombies);
        players[socket.id] = {id: socket.id, x:gameWidth / 2-25, y:gameHeight / 2-25, rotation:0, health:100};
        io.emit('createPlayer', players[socket.id]);
    }

    socket.on('move', (x, y) => {
        players[socket.id].x += x;
        players[socket.id].y += y;
        io.emit('move', players[socket.id], socket.id);
    });

    socket.on('bullet', (x, y, dx, dy) => {
        bulletCount += 1;
        bullets[bulletCount] = {x, y, dx, dy, id:bulletCount, distance:0};
        
        io.emit("createBullet", x, y, dx, dy, bulletCount)
    });

    // socket.on('hitZombie', (id, dx, dy) => {
    //     if (zombies[id]) {
    //         zombies[id].health -= 34;
    //         zombies[id].x += dx * 25;
    //         zombies[id].y += dy * 25;
    //         if (zombies[id].health <= 0 && Object.keys(zombies).length > 0) {
    //             delete zombies[id];
    //             io.emit("deleteZombie", id);
    //         } else {
    //             io.emit("hitZombie", zombies[id]);
    //         }
    //     }
    // })

    socket.on('rotatePlayer', angle => {
        players[socket.id].rotation = angle;
        io.emit("rotatePlayer", players[socket.id], angle)
    })

    socket.on('disconnect', () => {
        io.emit('removePlayer', socket.id);
        delete players[socket.id];
    });

    socket.on('zombie', (x, y) => {
        spawning = true;
        let randomSpots = pickRandom();
        zombieCount += 1;
        zombies[zombieCount] = {x:randomSpots[0], y:randomSpots[1], rotation:0, id:zombieCount, health:100};
        io.emit("createZombie", x, y, zombieCount, 100)
    });
});

function pickRandom () {
    let randomSpots = [];
    let x = Math.floor(Math.random() * Math.floor(gameWidth));
    let y = Math.floor(Math.random() * Math.floor(gameHeight));
    randomSpots.push(x)
    randomSpots.push(y)
    return randomSpots
}

function getAngle(x, y) {
    let angle = Math.atan(y/x);
    if (x < 0) angle = angle - Math.PI;
    return angle
}

setInterval(function() {
    for (key in zombies) {
        zombie = zombies[key];
        if (Object.keys(players).length !== 0) {
            let closestPlayer = null;
            let closestDistance = 100000000;
            for (key in players) {
                let player = players[key];
                let newDistance = Math.sqrt((player.x - zombie.x) ** 2 + (player.y - zombie.y) ** 2);
                if (newDistance < closestDistance) {
                    closestDistance = newDistance;
                    closestPlayer = player;
                }
            }
            let dx = Math.cos(Math.atan((closestPlayer.y - zombie.y)/(closestPlayer.x - zombie.x)));
            let dy = Math.sin(Math.atan((closestPlayer.y - zombie.y)/(closestPlayer.x - zombie.x)));
            if ((closestPlayer.x - zombie.x) < 0) {
                dx = -dx;
                dy = -dy;
            }
            zombie.x += dx * 0.5;
            zombie.y += dy * 0.5;
            zombie.rotation = getAngle((closestPlayer.x - zombie.x), (closestPlayer.y - zombie.y));
            for (key in players) {
                let player = players[key];
                if (Math.sqrt((zombie.x - player.x) ** 2 + (zombie.y - player.y) ** 2) < Math.sqrt(24.5**2)) {
                    player.health -= 0.5;
                    io.emit('hitPlayer', player.id, player.health);
                }
            }
            io.emit('moveZombie', zombie);
        }
        
    }
    
    if (spawning) {
        spawnTime += 1;
        console.log(spawnTime % spawnSpeed)
        if (spawnTime % spawnSpeed === 0) {
            spawnSpeed /= 1.1;
            let randomSpots = pickRandom();
            zombieCount += 1;
            zombies[zombieCount] = {x:randomSpots[0], y:randomSpots[1], rotation:0, id:zombieCount, health:100};
            io.emit("createZombie", randomSpots[0], randomSpots[1], zombieCount, 100)
        }
    }

    for (bKey in bullets) {
        let bullet = bullets[bKey];
            bullet.x += bullet.dx * 5;
            bullet.y += bullet.dy * 5;
            bullet.distance += 1;
            if (bullet.distance > 50) {io.emit('deleteBullet', bullets[bKey].id); delete bullets[bKey];}
            else io.emit('moveBullet', bKey, bullet.x, bullet.y);
            for (key in zombies) {
                let zombie = zombies[key];
                if (Math.sqrt((zombie.x - bullet.x) ** 2 + (zombie.y - bullet.y) ** 2) < Math.sqrt(24.5**2)) {
                    io.emit('deleteBullet', bullets[bKey].id);
                    delete bullets[bKey];
                    zombie.health -= 34;
                    zombie.x += bullet.dx * 25;
                    zombie.y += bullet.dy * 25
                    if (zombie.health <= 0 && Object.keys(zombies).length > 0) {
                        delete zombies[zombie.id];
                        io.emit("deleteZombie", zombie.id);
                    } else {
                        io.emit('hitZombie', {id:zombie.id, x:zombie.x, y:zombie.y, health:zombie.health});
                    }
                }
        //             io.emit('hitZombie', zombie.id, bullet.dx, bullet.dy);

        //             if (zombie) {
        //                 zombie.health -= 34;
        //                 zombie.x += dx * 25;
        //                 zombie.y += dy * 25;
        //                 if (zombie.health <= 0 && Object.keys(zombies).length > 0) {
        //                     delete zombies[id];
        //                     io.emit("deleteZombie", id);
        //                 } else {
        //                     io.emit("hitZombie", zombies[id]);
        //                 }
        //             }
        //             return;
        //         }
        // return bullet;
    }

}
}, 10);


// have our app start listening
server.listen(port, () => console.log(`Server running on port ${port}`));

// Specify a directory to serve static files

// initialize our socket by passing in our express server
// var sock = socket(server);

// respond to initial connection with our server
// sock.on("connection", function(socket) {
//   console.log("made connection with socket " + socket.id);
// });
