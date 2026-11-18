#!/bin/sh
set -e
node --check public/data.js
node --check public/webgl.js
node --check public/app.js
node --check netlify/functions/chat.mjs
node - <<'JS'
const vm=require('vm'),fs=require('fs'),context={window:{}};
vm.runInNewContext(fs.readFileSync('public/data.js','utf8'),context);
const data=context.window.LEGIE_DATA;
if(data.questions.length!==30)throw new Error('Kvíz nemá 30 otázek.');
for(let i=0;i<data.questions.length;i++){
 const q=data.questions[i];
 if(q.length!==5||q[1].length!==4||!Number.isInteger(q[2])||q[2]<0||q[2]>3||!data.sources[q[4]])throw new Error('Nekonzistentní otázka '+(i+1));
}
if(Object.keys(data.uniforms).length!==3)throw new Error('Nesprávný počet 3D uniforem.');
console.log('OK: 30 otázek, 3 uniformy, funkční JS syntaxe a odkazy na prameny.');
JS
