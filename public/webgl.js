'use strict';
/* LE GIE 1918 — lightweight, dependency-free WebGL uniform sculptures.
   Educational stylizations, NOT scans or historically exact artifact models. */
(function(){
const palette={
 rusko:{cloth:'#77765d',cloth2:'#60654f',pants:'#676958',hat:'#73715d',leather:'#4c3327',metal:'#ad9a65',badge:'#d7c5a7'},
 francie:{cloth:'#839aaa',cloth2:'#6c8498',pants:'#758d9c',hat:'#7c94a5',leather:'#6b4a37',metal:'#d1b17d',badge:'#e2cfba'},
 italie:{cloth:'#6d796a',cloth2:'#546657',pants:'#626f60',hat:'#697a67',leather:'#513e2d',metal:'#a29c80',badge:'#f3e9d1'}
};
const vs=`attribute vec3 aPosition;attribute vec3 aColor;attribute vec3 aNormal;uniform float uYaw;uniform float uPitch;uniform float uDistance;uniform float uAspect;varying vec3 vColor;void main(){
 vec3 p=aPosition; p.y-=1.47;
 float c=cos(uYaw),s=sin(uYaw);p=vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);
 c=cos(uPitch);s=sin(uPitch);p=vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);
 float vz=p.z-uDistance;float near=.1,far=40.;float A=(far+near)/(near-far),B=(2.*far*near)/(near-far);
 gl_Position=vec4(p.x*3.1/uAspect,p.y*3.1,A*vz+B,-vz);
 vec3 n=aNormal;float diffuse=max(.0,dot(normalize(n),normalize(vec3(-.55,.9,1.3))));vColor=aColor*(.55+.48*diffuse);
}`;
const fs=`precision mediump float;varying vec3 vColor;void main(){gl_FragColor=vec4(vColor,1.);}`;
function hexColor(hex){return [parseInt(hex.slice(1,3),16)/255,parseInt(hex.slice(3,5),16)/255,parseInt(hex.slice(5,7),16)/255];}
function shade(hex,mult){const c=hexColor(hex);return c.map(v=>Math.min(1,v*mult));}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function norm(v){let d=Math.hypot(...v)||1;return v.map(x=>x/d);}
function sub(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function createMesh(front, highlight){
 const p=palette[front]||palette.rusko, P=[],C=[],N=[];
 function tint(col,part){if(!highlight||highlight!==part)return hexColor(col);let rgb=hexColor(col);return rgb.map((x,i)=>Math.min(1,x*.55+[.40,.24,.08][i]));}
 function addTri(a,b,c,col,part){let n=norm(cross(sub(b,a),sub(c,a)));let rgb=tint(col,part);for(const v of [a,b,c]){P.push(...v);C.push(...rgb);N.push(...n);}}
 function addQuad(a,b,c,d,col,part){addTri(a,b,c,col,part);addTri(a,c,d,col,part);}
 function xf(v,x,y,z,rx,rz){let [a,b,c]=v;let co=Math.cos(rx),si=Math.sin(rx),cy=b*co-c*si,cz=b*si+c*co;co=Math.cos(rz);si=Math.sin(rz);return [x+a*co-cy*si,y+a*si+cy*co,z+cz];}
 function box(x,y,z,w,h,d,col,part='other',rx=0,rz=0){const vx=[[-w/2,-h/2,-d/2],[w/2,-h/2,-d/2],[w/2,h/2,-d/2],[-w/2,h/2,-d/2],[-w/2,-h/2,d/2],[w/2,-h/2,d/2],[w/2,h/2,d/2],[-w/2,h/2,d/2]].map(v=>xf(v,x,y,z,rx,rz));for(const [a,b,c,d] of [[4,5,6,7],[1,0,3,2],[0,4,7,3],[5,1,2,6],[7,6,2,3],[0,1,5,4]])addQuad(vx[a],vx[b],vx[c],vx[d],col,part);}
 function cylinder(x,y,z,rTop,rBottom,h,col,part='other',rx=0,rz=0,segments=16){const top=[],bot=[];for(let i=0;i<segments;i++){const a=i*Math.PI*2/segments;top.push(xf([Math.cos(a)*rTop,h/2,Math.sin(a)*rTop],x,y,z,rx,rz));bot.push(xf([Math.cos(a)*rBottom,-h/2,Math.sin(a)*rBottom],x,y,z,rx,rz));}const ct=xf([0,h/2,0],x,y,z,rx,rz),cb=xf([0,-h/2,0],x,y,z,rx,rz);for(let i=0;i<segments;i++){let j=(i+1)%segments;addQuad(bot[i],bot[j],top[j],top[i],col,part);addTri(ct,top[i],top[j],col,part);addTri(cb,bot[j],bot[i],col,part);}}
 function sphere(x,y,z,rx,ry,rz,col,part='other',segments=12,rings=8){for(let j=0;j<rings;j++){let v0=j*Math.PI/rings,v1=(j+1)*Math.PI/rings;for(let i=0;i<segments;i++){let u0=i*2*Math.PI/segments,u1=(i+1)*2*Math.PI/segments;function pt(u,v){return [x+Math.sin(v)*Math.cos(u)*rx,y+Math.cos(v)*ry,z+Math.sin(v)*Math.sin(u)*rz];}addQuad(pt(u0,v0),pt(u0,v1),pt(u1,v1),pt(u1,v0),col,part);}}}
 // Low plinth remains visually distinct from the clothing.
 cylinder(0,-.10,0,.79,.84,.16,'#2e3f3c');cylinder(0,-.205,0,.87,.87,.06,'#a78d67');cylinder(0,-.27,0,.87,.9,.06,'#182625');
 // legs + boots
 for(const s of [-1,1]){
  cylinder(.20*s,.66,0,.205,.145,1.02,p.pants,'other',0,-s*.03);
  cylinder(.20*s,.135,.015,.146,.147,.33,'#2f2b24');
  sphere(.20*s,.04,.13,.17,.105,.29,'#312b24');
  box(.20*s,.41,.15,.275,.045,.06,'#a7a28b');
 }
 // tunic torso and lower hem
 cylinder(0,1.74,0,.45,.47,1.11,p.cloth,'jacket');
 cylinder(0,1.23,0,.46,.49,.16,p.cloth2,'jacket');
 // sleeve shoulders and cuffs
 for(const s of [-1,1]){
  sphere(s*.49,2.17,0,.25,.20,.25,p.cloth,'jacket');
  cylinder(s*.66,1.75,.04,.18,.15,.94,p.cloth,'jacket',.04,-s*.20);
  cylinder(s*.755,1.19,.065,.155,.155,.16,p.cloth2,'jacket',0,-s*.2);
  sphere(s*.765,1.055,.083,.135,.16,.145,'#c1a58c');
 }
 // neck & face: simplified mannequin
 cylinder(0,2.46,0,.145,.15,.24,'#c3a88f');
 sphere(0,2.73,.012,.275,.345,.25,'#c4a991');
 sphere(-.266,2.73,0,.047,.079,.067,'#b5967e');sphere(.266,2.73,0,.047,.079,.067,'#b5967e');
 // subtle jaw and nose; no caricature
 sphere(0,2.695,.254,.075,.096,.075,'#bfa28a');
 // collar and front central strip
 box(-.145,2.31,.255,.22,.17,.11,p.cloth2,'jacket',0,-.13);
 box(.145,2.31,.255,.22,.17,.11,p.cloth2,'jacket',0,.13);
 box(0,1.78,.465,.072,.94,.043,p.cloth2,'jacket');
 // chest pockets and flaps
 for(const s of [-1,1]){
  box(s*.25,1.90,.433,.24,.22,.055,p.cloth2,'jacket');
  box(s*.25,2.015,.46,.25,.049,.073,p.cloth,'jacket');
  sphere(s*.25,1.98,.505,.017,.017,.012,p.metal,'jacket');
 }
 for(let y=1.4;y<2.35;y+=.21)sphere(0,y,.497,.026,.026,.022,p.metal,'jacket');
 // belt around the jacket
 cylinder(0,1.39,0,.49,.49,.08,p.leather,'strap');
 box(0,1.39,.498,.14,.11,.044,p.metal,'strap');box(0,1.39,.526,.06,.053,.01,p.leather,'strap');
 // diag leather shoulder strap crossing left shoulder to right hip (front) for illustration
 box(-.007,1.84,.49,.115,1.08,.058,p.leather,'strap',0,-.48);
 // bag on the left hip
 box(-.55,1.25,.10,.29,.36,.22,p.leather,'strap');
 box(-.55,1.36,.24,.30,.085,.03,p.cloth2,'strap');
 if(front==='francie'){
  // domed approximation of French Adrian-style helmet with rim / ridge
  sphere(0,3.014,0,.355,.19,.31,p.hat,'cap');
  cylinder(0,2.88,0,.42,.39,.055,p.hat,'cap');
  box(0,3.10,0,.055,.16,.60,p.metal,'cap');
  box(0,2.95,.322,.11,.095,.025,p.metal,'cap');
 }else if(front==='italie'){
  // simplified Italian alpini-style cap with left decorative plume
  cylinder(0,2.995,0,.336,.35,.19,p.hat,'cap',0,.06);
  cylinder(0,2.885,.06,.38,.38,.05,p.hat,'cap',0,.08);
  sphere(0,2.983,.357,.055,.056,.026,p.badge,'cap');
  cylinder(-.32,3.19,-.08,.026,.018,.49,'#c6ba95','cap',.08,-.37);
  sphere(-.41,3.42,-.09,.067,.14,.047,'#aab09b','cap');
 }else{
  // Russian-inspired peaked cap, with brim and light band
  cylinder(0,2.975,0,.35,.33,.18,p.hat,'cap');
  cylinder(0,3.08,0,.385,.35,.065,p.cloth2,'cap');
  cylinder(0,2.897,0,.355,.355,.09,p.cloth2,'cap');
  sphere(0,2.878,.31,.30,.05,.14,'#30332b','cap');
  sphere(0,2.985,.345,.046,.052,.022,p.badge,'cap');
 }
 return {P:new Float32Array(P),C:new Float32Array(C),N:new Float32Array(N)};
}
function shader(gl,type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh;}
class UniformView{
 constructor(canvas){this.canvas=canvas;this.front='rusko';this.highlight=null;this.yaw=-.28;this.pitch=-.065;this.distance=6.35;this.drag=null;this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:false});if(!this.gl)throw Error('WebGL není dostupné');const gl=this.gl;let prog=gl.createProgram();gl.attachShader(prog,shader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(prog,shader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);this.prog=prog;this.attrs=['aPosition','aColor','aNormal'].map(n=>gl.getAttribLocation(prog,n));this.uniforms=['uYaw','uPitch','uDistance','uAspect'].map(n=>gl.getUniformLocation(prog,n));this.buffers=this.attrs.map(()=>gl.createBuffer());gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);this.setUniform('rusko');this.bind();this.resize();if(window.ResizeObserver){this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(canvas.parentElement);}else window.addEventListener('resize',()=>this.resize());}
 bind(){const c=this.canvas;c.addEventListener('pointerdown',e=>{this.drag={id:e.pointerId,x:e.clientX,y:e.clientY};c.setPointerCapture(e.pointerId);});c.addEventListener('pointermove',e=>{if(!this.drag||e.pointerId!==this.drag.id)return;let dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;this.drag.x=e.clientX;this.drag.y=e.clientY;this.yaw+=dx*.012;this.pitch=Math.max(-.35,Math.min(.42,this.pitch+dy*.006));this.render();});c.addEventListener('pointerup',()=>{this.drag=null;});c.addEventListener('pointercancel',()=>{this.drag=null;});c.addEventListener('wheel',e=>{e.preventDefault();this.zoom(e.deltaY>0?.3:-.3);},{passive:false});}
 resize(){const gl=this.gl,c=this.canvas;const r=c.getBoundingClientRect();if(!r.width||!r.height)return;const dpr=Math.min(devicePixelRatio||1,2);c.width=Math.round(r.width*dpr);c.height=Math.round(r.height*dpr);gl.viewport(0,0,c.width,c.height);this.render();}
 setUniform(front,highlight=null){this.front=front;this.highlight=highlight;const gl=this.gl,m=createMesh(front,highlight);this.count=m.P.length/3;[m.P,m.C,m.N].forEach((data,i)=>{gl.bindBuffer(gl.ARRAY_BUFFER,this.buffers[i]);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(this.attrs[i]);gl.vertexAttribPointer(this.attrs[i],3,gl.FLOAT,false,0,0);});this.render();}
 render(){const gl=this.gl;if(!gl||!this.canvas.width)return;gl.useProgram(this.prog);gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);for(let i=0;i<3;i++){gl.bindBuffer(gl.ARRAY_BUFFER,this.buffers[i]);gl.vertexAttribPointer(this.attrs[i],3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(this.attrs[i]);}gl.uniform1f(this.uniforms[0],this.yaw);gl.uniform1f(this.uniforms[1],this.pitch);gl.uniform1f(this.uniforms[2],this.distance);gl.uniform1f(this.uniforms[3],this.canvas.width/this.canvas.height);gl.drawArrays(gl.TRIANGLES,0,this.count);}
 turn(d){this.yaw+=d;this.render();}zoom(d){this.distance=Math.max(4.7,Math.min(9.1,this.distance+d));this.render();}reset(){this.yaw=-.28;this.pitch=-.065;this.distance=6.35;this.render();}
}
window.LegieUniformView=UniformView;
})();
