function u(t) { // dwitter code goes here
    for(i=2e3,f=(X,Y,n=0)=>Y<9?f(X*X-Y*Y-.8,2*X*Y+.2,n+.16):x.fillStyle=`hsl(${i/9},75%,${n*n}%`;i--;x.fillRect(i,t*60,1,999))f(i/480-2,1-t/9);
}

let time = 0;
let frame = 0;
let FPS = 60;
let x = c.getContext('2d');
let S = Math.sin;
let C = Math.cos;
let T = Math.tan;
let R = (r,g,b,a=1) => `rgba(${r|0},${g|0},${b|0},${a})`;

let loop = (frameTime) =>
{
    requestAnimationFrame(loop);
    
    // update time
    time = frame++ / FPS;
    if (time*FPS|0 == frame-2)
    time += 1e-6; // fixup floating point
    
    // update user function
    u(time);
    
    {
    // fill window
    c.style.width = c.style.height = '';
    const aspect = c.width / c.height;
    if (aspect > innerWidth / innerHeight)
        c.style.height = '100%';
    else
        c.style.width = '100%';
    }
}

loop();