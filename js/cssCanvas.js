// Dwitter Shim by Frank Force 2020
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

function u(t) { // dwitter code goes here

// https://www.dwitter.net/d/18748
for(k=i=801;i--;x.fillRect(q?k+r*(S(m>>=4)*41+p*S(t+n)*5):0,r*(38+C(t/2)*13)-k,p?r/3:q?m%7*r+5*r:2e8,p?-r:q?-m%17*r:r))m=n=i+t*120,r=1e7/i/i,p=n%8>7,q=i%2,x.fillStyle=R(p*k,i/(p?1:(q?7:17)-n%8))

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