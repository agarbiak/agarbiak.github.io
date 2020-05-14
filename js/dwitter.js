function u(t) { // dwitter code goes here
    with(x)for(k=i=700;--i;m=i+t*k/2|0,fill(arc(k-i+(r=(S(t*4+m/k)/2+1)*(m%39?1e5:3e4)/i)*S(m*=m),k+C(m)*r,r/2,0,7)))beginPath(fillStyle=R(i/2));
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