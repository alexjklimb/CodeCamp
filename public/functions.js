function move() {
    let dx = 0;
    let dy = 0;
    if (keys['a']) dx = -1;
    if (keys['d']) dx = 1;
    if (keys['w']) dy = -1;
    if (keys['s']) dy = 1;

    if (Math.sqrt(dx ** 2 + dy ** 2) > 1) {
        let odx = dx;
        let ody = dy;
        dx = ((Math.PI/4)) * odx;
        dy = ((Math.PI/4)) * ody;
    }
};
