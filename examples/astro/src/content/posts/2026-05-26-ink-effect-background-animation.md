---
title: Ink Diffusion Background Effect
date: 2026-05-26
tags:
  - Theme
  - Animation
  - Configuration
---

# Ink Diffusion Background Effect

The inkpaper theme includes 6 built-in ink diffusion background animations. All effects slowly spread outward and gradually fade to transparent. Ink drop centers only appear in the page margins (outside the content area), ensuring readability is not affected.

## Available Effects

<style>
.ink-demo-cards{display:flex;flex-direction:column;gap:20px;margin:24px 0}
.ink-card{position:relative;overflow:hidden;background:#f5f2eb;border:1px solid #d5d0c8;border-radius:12px;height:240px}
.ink-card canvas{position:absolute;inset:0;width:100%;height:100%}
.ink-card-content{position:relative;z-index:1;padding:20px;background:linear-gradient(180deg,rgba(245,242,235,0.92) 0%,rgba(245,242,235,0.5) 60%,rgba(245,242,235,0) 100%)}
.ink-card-header{display:flex;align-items:baseline;gap:8px;margin-bottom:4px}
.ink-card-num{font-size:12px;color:#999}
.ink-card-title{font-size:18px;color:#222;font-weight:600;margin-bottom:6px}
.ink-card-desc{font-size:14px;color:#555;line-height:1.7}
</style>

<div class="ink-demo-cards">
<div class="ink-card" id="card1en"><canvas></canvas><div class="ink-card-content"><div class="ink-card-header"><span class="ink-card-num">Effect 1</span><code>inkDrop</code></div><div class="ink-card-title">Ink Drop Seepage</div><div class="ink-card-desc">Ink drops slowly seep outward from the center with irregular fibrous edges. Low frequency, calm and serene.</div></div></div>
<div class="ink-card" id="card2en"><canvas></canvas><div class="ink-card-content"><div class="ink-card-header"><span class="ink-card-num">Effect 2</span><code>fiberBleed</code></div><div class="ink-card-title">Rice Paper Fiber Bleed</div><div class="ink-card-desc">Light ink base with irregular fiber tendrils extending outward from edges, simulating ink absorbed along paper fibers.</div></div></div>
<div class="ink-card" id="card3en"><canvas></canvas><div class="ink-card-content"><div class="ink-card-header"><span class="ink-card-num">Effect 3</span><code>splash</code></div><div class="ink-card-title">Ink Splash</div><div class="ink-card-desc">Main ink blob and surrounding fine splatter dots appear simultaneously, then slowly spread and fade. Overlapping areas merge without color stacking.</div></div></div>
<div class="ink-card" id="card4en"><canvas></canvas><div class="ink-card-content"><div class="ink-card-header"><span class="ink-card-num">Effect 4</span><code>waterCloud</code></div><div class="ink-card-title">Ink-in-Water Diffusion</div><div class="ink-card-desc">Light ink clouds slowly expand, like ink dropped into clear water. Low frequency, misty and ethereal.</div></div></div>
<div class="ink-card" id="card5en"><canvas></canvas><div class="ink-card-content"><div class="ink-card-header"><span class="ink-card-num">Effect 5</span><code>bleedEdge</code></div><div class="ink-card-title">Ink Bleed</div><div class="ink-card-desc">Ink edges smoothly and slowly push outward, with density decreasing evenly. Soft natural edges.</div></div></div>
<div class="ink-card" id="card6en"><canvas></canvas><div class="ink-card-content"><div class="ink-card-header"><span class="ink-card-num">Effect 6</span><code>layeredInk</code></div><div class="ink-card-title">Layered Ink</div><div class="ink-card-desc">Multiple thin ink layers spread in succession, each fading after expansion, briefly forming depth before dissipating.</div></div></div>
</div>

<script>
(function(){
function initCard(id,effectFn){var card=document.getElementById(id);if(!card)return;var canvas=card.querySelector('canvas');var ctx=canvas.getContext('2d');var W,H;function resize(){var r=card.getBoundingClientRect();W=canvas.width=r.width;H=canvas.height=r.height}resize();window.addEventListener('resize',resize);effectFn(ctx,function(){return W},function(){return H})}
initCard('card1en',function(ctx,gW,gH){function Drop(x,y){this.x=x;this.y=y;this.maxR=70+Math.random()*50;var n=36;var raw=[];for(var i=0;i<n;i++)raw.push(0.75+Math.random()*0.5);for(var i=0;i<n;i++){var prev=raw[(i-1+n)%n],next=raw[(i+1)%n];raw[i]=raw[i]*0.5+(prev+next)*0.25}this.shape=raw;this.born=performance.now();this.duration=12000+Math.random()*6000}Drop.prototype.draw=function(now){var t=(now-this.born)/this.duration;if(t>1)return false;var r=this.maxR*Math.pow(t,0.4);var alpha=0.15*(1-t);ctx.save();ctx.filter='blur(3px)';ctx.beginPath();var n=this.shape.length;for(var i=0;i<=n;i++){var idx=i%n,ang=(Math.PI*2/n)*i;var pr=r*this.shape[idx];i===0?ctx.moveTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr):ctx.lineTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr)}ctx.closePath();ctx.fillStyle='rgba(10,8,5,'+alpha+')';ctx.fill();ctx.restore();return true};var drops=[];function add(){var W2=gW(),H2=gH(),a=0,x,y;do{x=Math.random()*W2;y=Math.random()*H2;a++}while(a<20&&drops.some(function(d){return Math.hypot(d.x-x,d.y-y)<120}));drops.push(new Drop(x,y))}add();setInterval(add,5000);(function run(){var now=performance.now();ctx.clearRect(0,0,gW(),gH());drops=drops.filter(function(d){return d.draw(now)});requestAnimationFrame(run)})()});
initCard('card2en',function(ctx,gW,gH){function Fiber(){this.x=Math.random()*gW();this.y=Math.random()*gH();this.born=performance.now();this.duration=11000+Math.random()*4000;this.baseR=20+Math.random()*15;this.fibers=[];var count=30+Math.floor(Math.random()*25);for(var i=0;i<count;i++){var sa=Math.random()*Math.PI*2;var sr=this.baseR*(0.7+Math.random()*0.3);var sx=Math.cos(sa)*sr,sy=Math.sin(sa)*sr;var path=[{x:sx,y:sy}];var dir=sa+(Math.random()-0.5)*1.5;var segs=3+Math.floor(Math.random()*5);var cx=sx,cy=sy;for(var s=0;s<segs;s++){dir+=(Math.random()-0.5)*1.4;var step=4+Math.random()*10;cx+=Math.cos(dir)*step;cy+=Math.sin(dir)*step;path.push({x:cx,y:cy});if(Math.random()<0.3&&s<segs-1){var bd=dir+(Math.random()-0.5)*2;var bl=3+Math.random()*8;path.push({x:cx+Math.cos(bd)*bl,y:cy+Math.sin(bd)*bl,branch:true})}}this.fibers.push({path:path,width:0.3+Math.random()*1})}var n=28;var raw=[];for(var i=0;i<n;i++)raw.push(0.8+Math.random()*0.4);for(var p=0;p<4;p++){for(var i=0;i<n;i++){var prev=raw[(i-1+n)%n],next=raw[(i+1)%n];raw[i]=raw[i]*0.5+(prev+next)*0.25}}this.blobShape=raw}Fiber.prototype.draw=function(now){var t=(now-this.born)/this.duration;if(t>1)return false;var grow=Math.pow(Math.min(t*2.5,1),0.5);var fade=1-t;ctx.save();ctx.filter='blur(4px)';ctx.beginPath();var n=this.blobShape.length;for(var i=0;i<=n;i++){var idx=i%n,ang=(Math.PI*2/n)*i;var pr=this.baseR*this.blobShape[idx];i===0?ctx.moveTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr):ctx.lineTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr)}ctx.closePath();ctx.fillStyle='rgba(10,8,5,'+(0.07*fade)+')';ctx.fill();ctx.restore();for(var fi=0;fi<this.fibers.length;fi++){var f=this.fibers[fi];var tp=f.path.length;var vp=grow*tp;if(vp<1)continue;ctx.beginPath();var lm=f.path[0];ctx.moveTo(this.x+f.path[0].x,this.y+f.path[0].y);var fs=Math.floor(vp);for(var s=1;s<=Math.min(fs,tp-1);s++){var p=f.path[s];if(p.branch){ctx.moveTo(this.x+lm.x,this.y+lm.y);ctx.lineTo(this.x+p.x,this.y+p.y)}else{ctx.lineTo(this.x+p.x,this.y+p.y);lm=p}}ctx.strokeStyle='rgba(10,8,5,'+(0.07*fade)+')';ctx.lineWidth=f.width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke()}return true};var drops=[];function add(){var a=0,x,y;do{x=Math.random()*gW();y=Math.random()*gH();a++}while(a<20&&drops.some(function(d){return Math.hypot(d.x-x,d.y-y)<120}));var f=new Fiber();f.x=x;f.y=y;drops.push(f)}add();setInterval(add,5000);(function run(){var now=performance.now();ctx.clearRect(0,0,gW(),gH());drops=drops.filter(function(d){return d.draw(now)});requestAnimationFrame(run)})()});
initCard('card3en',function(ctx,gW,gH){function Splash(){this.x=0;this.y=0;this.born=performance.now();this.duration=10000+Math.random()*4000;var n=24;this.mainShape=[];for(var i=0;i<n;i++)this.mainShape.push(0.6+Math.random()*0.8);for(var p=0;p<3;p++){for(var i=0;i<n;i++){var prev=this.mainShape[(i-1+n)%n],next=this.mainShape[(i+1)%n];this.mainShape[i]=this.mainShape[i]*0.5+(prev+next)*0.25}}this.mainR=20+Math.random()*15;this.splats=[];var count=20+Math.floor(Math.random()*20);for(var i=0;i<count;i++){var a=Math.random()*Math.PI*2;var dist=25+Math.random()*70;var r=2+Math.random()*8;var sn=8;var shape=[];for(var j=0;j<sn;j++)shape.push(0.7+Math.random()*0.6);for(var p=0;p<2;p++){for(var j=0;j<sn;j++){var prev=shape[(j-1+sn)%sn],next=shape[(j+1)%sn];shape[j]=shape[j]*0.5+(prev+next)*0.25}}this.splats.push({ox:Math.cos(a)*dist,oy:Math.sin(a)*dist,r:r,shape:shape})}}Splash.prototype.draw=function(now){var t=(now-this.born)/this.duration;if(t>1)return false;var expand=1+Math.pow(t,0.4)*0.8;var fade=1-t;var alpha=0.15*fade;ctx.save();ctx.filter='blur(2px)';ctx.beginPath();var mn=this.mainShape.length;for(var i=0;i<=mn;i++){var idx=i%mn,ang=(Math.PI*2/mn)*i;var r=this.mainR*this.mainShape[idx]*expand;i===0?ctx.moveTo(this.x+Math.cos(ang)*r,this.y+Math.sin(ang)*r):ctx.lineTo(this.x+Math.cos(ang)*r,this.y+Math.sin(ang)*r)}ctx.closePath();for(var si=0;si<this.splats.length;si++){var s=this.splats[si];var sn=s.shape.length;var sx=this.x+s.ox,sy=this.y+s.oy;for(var i=0;i<=sn;i++){var idx=i%sn,ang=(Math.PI*2/sn)*i;var r=s.r*s.shape[idx]*expand;i===0?ctx.moveTo(sx+Math.cos(ang)*r,sy+Math.sin(ang)*r):ctx.lineTo(sx+Math.cos(ang)*r,sy+Math.sin(ang)*r)}ctx.closePath()}ctx.fillStyle='rgba(10,8,5,'+alpha+')';ctx.fill();ctx.restore();return true};var drops=[];function add(){var a=0,x,y;do{x=Math.random()*gW();y=Math.random()*gH();a++}while(a<20&&drops.some(function(d){return Math.hypot(d.x-x,d.y-y)<150}));var s=new Splash();s.x=x;s.y=y;drops.push(s)}add();setInterval(add,5000);(function run(){var now=performance.now();ctx.clearRect(0,0,gW(),gH());drops=drops.filter(function(d){return d.draw(now)});requestAnimationFrame(run)})()});
initCard('card4en',function(ctx,gW,gH){function Cloud(){this.x=Math.random()*gW();this.y=Math.random()*gH();this.born=performance.now();this.duration=14000+Math.random()*5000;this.blobs=[];for(var i=0;i<5+Math.floor(Math.random()*3);i++){this.blobs.push({ox:(Math.random()-0.5)*25,oy:(Math.random()-0.5)*25,maxR:30+Math.random()*35,drift:{x:(Math.random()-0.5)*0.1,y:(Math.random()-0.5)*0.1}})}}Cloud.prototype.draw=function(now){var t=(now-this.born)/this.duration;if(t>1)return false;var expand=Math.pow(t,0.3);var fade=1-t;for(var i=0;i<this.blobs.length;i++){var b=this.blobs[i];var cx=this.x+b.ox+b.drift.x*t*80;var cy=this.y+b.oy+b.drift.y*t*80;var r=b.maxR*expand;var g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,'rgba(12,10,7,'+(0.08*fade)+')');g.addColorStop(0.5,'rgba(15,12,8,'+(0.04*fade)+')');g.addColorStop(1,'rgba(20,15,10,0)');ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()}return true};var drops=[];function add(){var a=0,x,y;do{x=Math.random()*gW();y=Math.random()*gH();a++}while(a<20&&drops.some(function(d){return Math.hypot(d.x-x,d.y-y)<150}));var c=new Cloud();c.x=x;c.y=y;drops.push(c)}add();setInterval(add,6000);(function run(){var now=performance.now();ctx.clearRect(0,0,gW(),gH());drops=drops.filter(function(d){return d.draw(now)});requestAnimationFrame(run)})()});
initCard('card5en',function(ctx,gW,gH){function Bleed(){this.x=Math.random()*gW();this.y=Math.random()*gH();this.born=performance.now();this.duration=10000+Math.random()*4000;this.maxR=55+Math.random()*50;var base=[];var n=60;for(var i=0;i<n;i++)base.push(0.75+Math.random()*0.5);for(var p=0;p<6;p++){for(var i=0;i<n;i++){var prev=base[(i-1+n)%n],next=base[(i+1)%n];base[i]=base[i]*0.5+(prev+next)*0.25}}this.shape=base}Bleed.prototype.draw=function(now){var t=(now-this.born)/this.duration;if(t>1)return false;var expand=Math.pow(t,0.35);var fade=1-t;var r=this.maxR*expand;ctx.save();ctx.filter='blur(5px)';ctx.beginPath();var n=this.shape.length;for(var i=0;i<=n;i++){var idx=i%n,ang=(Math.PI*2/n)*i;var pr=r*this.shape[idx];i===0?ctx.moveTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr):ctx.lineTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr)}ctx.closePath();ctx.clip();var g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,r);g.addColorStop(0,'rgba(10,8,5,'+(0.2*fade)+')');g.addColorStop(0.6,'rgba(10,8,5,'+(0.11*fade)+')');g.addColorStop(1,'rgba(10,8,5,'+(0.03*fade)+')');ctx.fillStyle=g;ctx.fillRect(this.x-r,this.y-r,r*2,r*2);ctx.restore();return true};var drops=[];function add(){var a=0,x,y;do{x=Math.random()*gW();y=Math.random()*gH();a++}while(a<20&&drops.some(function(d){return Math.hypot(d.x-x,d.y-y)<140}));var b=new Bleed();b.x=x;b.y=y;drops.push(b)}add();setInterval(add,5000);(function run(){var now=performance.now();ctx.clearRect(0,0,gW(),gH());drops=drops.filter(function(d){return d.draw(now)});requestAnimationFrame(run)})()});
initCard('card6en',function(ctx,gW,gH){function Layer(cx,cy,delay){this.x=cx+(Math.random()-0.5)*25;this.y=cy+(Math.random()-0.5)*25;this.born=performance.now()+delay;this.duration=8000+Math.random()*3000;this.maxR=35+Math.random()*45;var raw=[];for(var i=0;i<28;i++)raw.push(0.6+Math.random()*0.8);for(var p=0;p<3;p++){for(var i=0;i<28;i++){var prev=raw[(i-1+28)%28],next=raw[(i+1)%28];raw[i]=raw[i]*0.5+(prev+next)*0.25}}this.shape=raw}Layer.prototype.draw=function(now){var elapsed=now-this.born;if(elapsed<0)return true;var t=elapsed/this.duration;if(t>1)return false;var expand=Math.pow(t,0.35);var fade=1-t;var r=this.maxR*expand;ctx.save();ctx.filter='blur(4px)';ctx.beginPath();for(var i=0;i<=28;i++){var idx=i%28,ang=(Math.PI*2/28)*i;var pr=r*this.shape[idx];i===0?ctx.moveTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr):ctx.lineTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr)}ctx.closePath();ctx.fillStyle='rgba(10,8,5,'+(0.06*fade)+')';ctx.fill();ctx.restore();return true};function Group(cx,cy){this.x=cx;this.y=cy;this.layers=[];for(var i=0;i<4+Math.floor(Math.random()*3);i++){this.layers.push(new Layer(cx,cy,i*500))}}Group.prototype.draw=function(now){this.layers=this.layers.filter(function(l){return l.draw(now)});return this.layers.length>0};var groups=[];function add(){var a=0,x,y;do{x=Math.random()*gW();y=Math.random()*gH();a++}while(a<20&&groups.some(function(g){return Math.hypot(g.x-x,g.y-y)<130}));groups.push(new Group(x,y))}add();setInterval(add,5000);(function run(){var now=performance.now();ctx.clearRect(0,0,gW(),gH());groups=groups.filter(function(g){return g.draw(now)});requestAnimationFrame(run)})()});
})()
</script>

## Configuration

### VitePress

Configure in `.vitepress/config.mts`:

```ts
export default defineConfig({
  themeConfig: {
    inkEffect: 'bleedEdge',       // Effect name; omit or set to '' to disable
    inkEffectOpacity: 0.5         // Optional, overall opacity multiplier, default 1
  }
})
```

### Astro

Configure in `astro.config.mjs`:

```js
export default defineConfig({
  integrations: [
    inkpaper({
      inkEffect: 'bleedEdge',     // Effect name; omit or set to '' to disable
      inkEffectOpacity: 0.5       // Optional, overall opacity multiplier, default 1
    })
  ]
})
```

Available values: `inkDrop` | `fiberBleed` | `splash` | `waterCloud` | `bleedEdge` | `layeredInk`

Set to empty string or omit to disable. Disabled by default.
