---
title: 墨汁扩散背景动效
date: 2026-05-26
tags:
  - 主题
  - 动效
  - 配置
---

# 墨汁扩散背景动效

inkpaper 主题内置了 6 种墨汁缓慢扩散晕染的背景动效，所有方案均为缓慢扩散、越散越淡直至消失的效果。墨滴中心只出现在页面两侧（正文区域之外），不干扰阅读。

## 可选方案

<div class="ink-demo-cards">
<div class="ink-card" id="card1"><canvas></canvas><div class="ink-card-content"><div class="ink-card-header"><span class="ink-card-num">方案 1</span><code>inkDrop</code></div><div class="ink-card-title">水墨滴落渗透</div><div class="ink-card-desc">墨滴从中心向外缓慢渗透扩散，边缘不规则如纤维渗透。出现频率低，沉静悠然。</div></div></div>
<div class="ink-card" id="card2"><canvas></canvas><div class="ink-card-content"><div class="ink-card-header"><span class="ink-card-num">方案 2</span><code>fiberBleed</code></div><div class="ink-card-title">宣纸纤维渗透</div><div class="ink-card-desc">淡墨底色配合从边缘向外延伸的不规则纤维丝，模拟墨汁沿宣纸纤维方向扩散。</div></div></div>
<div class="ink-card" id="card3"><canvas></canvas><div class="ink-card-content"><div class="ink-card-header"><span class="ink-card-num">方案 3</span><code>splash</code></div><div class="ink-card-title">泼墨飞溅</div><div class="ink-card-desc">主墨团与周围细密墨点同时出现，然后各自缓慢扩散消散。重叠部分图形融合不叠加颜色。</div></div></div>
<div class="ink-card" id="card4"><canvas></canvas><div class="ink-card-content"><div class="ink-card-header"><span class="ink-card-num">方案 4</span><code>waterCloud</code></div><div class="ink-card-title">墨汁入水扩散</div><div class="ink-card-desc">淡墨云团缓慢膨胀扩散，如墨汁滴入清水般柔和飘逸。出现频率低，氤氲朦胧。</div></div></div>
<div class="ink-card" id="card5"><canvas></canvas><div class="ink-card-content"><div class="ink-card-header"><span class="ink-card-num">方案 5</span><code>bleedEdge</code></div><div class="ink-card-title">墨迹洇开</div><div class="ink-card-desc">墨迹整体边界平滑地缓慢向外洇开推进，浓度均匀递减。边缘柔和自然，无突兀中心。</div></div></div>
<div class="ink-card" id="card6"><canvas></canvas><div class="ink-card-content"><div class="ink-card-header"><span class="ink-card-num">方案 6</span><code>layeredInk</code></div><div class="ink-card-title">积墨层染</div><div class="ink-card-desc">多层薄墨依次扩散叠加，每层扩散后渐淡，短暂形成浓淡层次后整体消退。</div></div></div>
</div>

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

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
function initCard(id, effectFn) {
  const card = document.getElementById(id);
  if (!card) return;
  const canvas = card.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { const r = card.getBoundingClientRect(); W = canvas.width = r.width; H = canvas.height = r.height; }
  resize(); window.addEventListener('resize', resize);
  effectFn(ctx, () => W, () => H);
}
initCard('card1', (ctx, gW, gH) => {
  class Drop { constructor(x,y){this.x=x;this.y=y;this.maxR=70+Math.random()*50;const n=36;const raw=Array.from({length:n},()=>0.75+Math.random()*0.5);for(let p=0;p<1;p++){for(let i=0;i<n;i++){const prev=raw[(i-1+n)%n],next=raw[(i+1)%n];raw[i]=raw[i]*0.5+(prev+next)*0.25}}this.shape=raw;this.born=performance.now();this.duration=12000+Math.random()*6000}draw(now){const t=(now-this.born)/this.duration;if(t>1)return false;const r=this.maxR*Math.pow(t,0.4);const alpha=0.15*(1-t);ctx.save();ctx.filter='blur(3px)';ctx.beginPath();const n=this.shape.length;for(let i=0;i<=n;i++){const idx=i%n,ang=(Math.PI*2/n)*i;const pr=r*this.shape[idx];i===0?ctx.moveTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr):ctx.lineTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr)}ctx.closePath();ctx.fillStyle=`rgba(10,8,5,${alpha})`;ctx.fill();ctx.restore();return true}}
  let drops=[];function add(){const W=gW(),H=gH();let a=0,x,y;do{x=Math.random()*W;y=Math.random()*H;a++}while(a<20&&drops.some(d=>Math.hypot(d.x-x,d.y-y)<120));drops.push(new Drop(x,y))}add();setInterval(add,5000);(function run(){const now=performance.now();ctx.clearRect(0,0,gW(),gH());drops=drops.filter(d=>d.draw(now));requestAnimationFrame(run)})()
});
initCard('card2', (ctx, gW, gH) => {
  class Fiber{constructor(){this.x=Math.random()*gW();this.y=Math.random()*gH();this.born=performance.now();this.duration=11000+Math.random()*4000;this.baseR=20+Math.random()*15;this.fibers=[];const count=30+Math.floor(Math.random()*25);for(let i=0;i<count;i++){const sa=Math.random()*Math.PI*2;const sr=this.baseR*(0.7+Math.random()*0.3);const sx=Math.cos(sa)*sr;const sy=Math.sin(sa)*sr;const path=[{x:sx,y:sy}];let dir=sa+(Math.random()-0.5)*1.5;const segs=3+Math.floor(Math.random()*5);let cx=sx,cy=sy;for(let s=0;s<segs;s++){dir+=(Math.random()-0.5)*1.4;const step=4+Math.random()*10;cx+=Math.cos(dir)*step;cy+=Math.sin(dir)*step;path.push({x:cx,y:cy});if(Math.random()<0.3&&s<segs-1){const bd=dir+(Math.random()-0.5)*2;const bl=3+Math.random()*8;path.push({x:cx+Math.cos(bd)*bl,y:cy+Math.sin(bd)*bl,branch:true})}}this.fibers.push({path,width:0.3+Math.random()*1})}const n=28;const raw=Array.from({length:n},()=>0.8+Math.random()*0.4);for(let p=0;p<4;p++){for(let i=0;i<n;i++){const prev=raw[(i-1+n)%n],next=raw[(i+1)%n];raw[i]=raw[i]*0.5+(prev+next)*0.25}}this.blobShape=raw}draw(now){const t=(now-this.born)/this.duration;if(t>1)return false;const grow=Math.pow(Math.min(t*2.5,1),0.5);const fade=1-t;ctx.save();ctx.filter='blur(4px)';ctx.beginPath();const n=this.blobShape.length;for(let i=0;i<=n;i++){const idx=i%n,ang=(Math.PI*2/n)*i;const pr=this.baseR*this.blobShape[idx];i===0?ctx.moveTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr):ctx.lineTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr)}ctx.closePath();ctx.fillStyle=`rgba(10,8,5,${0.07*fade})`;ctx.fill();ctx.restore();for(const f of this.fibers){const tp=f.path.length;const vp=grow*tp;if(vp<1)continue;ctx.beginPath();let lm=f.path[0];ctx.moveTo(this.x+f.path[0].x,this.y+f.path[0].y);const fs=Math.floor(vp);for(let s=1;s<=Math.min(fs,tp-1);s++){const p=f.path[s];if(p.branch){ctx.moveTo(this.x+lm.x,this.y+lm.y);ctx.lineTo(this.x+p.x,this.y+p.y)}else{ctx.lineTo(this.x+p.x,this.y+p.y);lm=p}}ctx.strokeStyle=`rgba(10,8,5,${0.07*fade})`;ctx.lineWidth=f.width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke()}return true}}
  let drops=[];function add(){let a=0,x,y;do{x=Math.random()*gW();y=Math.random()*gH();a++}while(a<20&&drops.some(d=>Math.hypot(d.x-x,d.y-y)<120));const f=new Fiber();f.x=x;f.y=y;drops.push(f)}add();setInterval(add,5000);(function run(){const now=performance.now();ctx.clearRect(0,0,gW(),gH());drops=drops.filter(d=>d.draw(now));requestAnimationFrame(run)})()
});
initCard('card3', (ctx, gW, gH) => {
  class Splash{constructor(){this.x=0;this.y=0;this.born=performance.now();this.duration=10000+Math.random()*4000;const n=24;this.mainShape=Array.from({length:n},()=>0.6+Math.random()*0.8);for(let p=0;p<3;p++){for(let i=0;i<n;i++){const prev=this.mainShape[(i-1+n)%n],next=this.mainShape[(i+1)%n];this.mainShape[i]=this.mainShape[i]*0.5+(prev+next)*0.25}}this.mainR=20+Math.random()*15;this.splats=[];const count=20+Math.floor(Math.random()*20);for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2;const dist=25+Math.random()*70;const r=2+Math.random()*8;const sn=8;const shape=Array.from({length:sn},()=>0.7+Math.random()*0.6);for(let p=0;p<2;p++){for(let j=0;j<sn;j++){const prev=shape[(j-1+sn)%sn],next=shape[(j+1)%sn];shape[j]=shape[j]*0.5+(prev+next)*0.25}}this.splats.push({ox:Math.cos(a)*dist,oy:Math.sin(a)*dist,r,shape})}}draw(now){const t=(now-this.born)/this.duration;if(t>1)return false;const expand=1+Math.pow(t,0.4)*0.8;const fade=1-t;const alpha=0.15*fade;ctx.save();ctx.filter='blur(2px)';ctx.beginPath();const mn=this.mainShape.length;for(let i=0;i<=mn;i++){const idx=i%mn,ang=(Math.PI*2/mn)*i;const r=this.mainR*this.mainShape[idx]*expand;i===0?ctx.moveTo(this.x+Math.cos(ang)*r,this.y+Math.sin(ang)*r):ctx.lineTo(this.x+Math.cos(ang)*r,this.y+Math.sin(ang)*r)}ctx.closePath();for(const s of this.splats){const sn=s.shape.length;const sx=this.x+s.ox,sy=this.y+s.oy;for(let i=0;i<=sn;i++){const idx=i%sn,ang=(Math.PI*2/sn)*i;const r=s.r*s.shape[idx]*expand;i===0?ctx.moveTo(sx+Math.cos(ang)*r,sy+Math.sin(ang)*r):ctx.lineTo(sx+Math.cos(ang)*r,sy+Math.sin(ang)*r)}ctx.closePath()}ctx.fillStyle=`rgba(10,8,5,${alpha})`;ctx.fill();ctx.restore();return true}}
  let drops=[];function add(){let a=0,x,y;do{x=Math.random()*gW();y=Math.random()*gH();a++}while(a<20&&drops.some(d=>Math.hypot(d.x-x,d.y-y)<150));const s=new Splash();s.x=x;s.y=y;drops.push(s)}add();setInterval(add,5000);(function run(){const now=performance.now();ctx.clearRect(0,0,gW(),gH());drops=drops.filter(d=>d.draw(now));requestAnimationFrame(run)})()
});
initCard('card4', (ctx, gW, gH) => {
  class Cloud{constructor(){this.x=Math.random()*gW();this.y=Math.random()*gH();this.born=performance.now();this.duration=14000+Math.random()*5000;this.blobs=[];for(let i=0;i<5+Math.floor(Math.random()*3);i++){this.blobs.push({ox:(Math.random()-0.5)*25,oy:(Math.random()-0.5)*25,maxR:30+Math.random()*35,drift:{x:(Math.random()-0.5)*0.1,y:(Math.random()-0.5)*0.1}})}}draw(now){const t=(now-this.born)/this.duration;if(t>1)return false;const expand=Math.pow(t,0.3);const fade=1-t;for(const b of this.blobs){const cx=this.x+b.ox+b.drift.x*t*80;const cy=this.y+b.oy+b.drift.y*t*80;const r=b.maxR*expand;const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,`rgba(12,10,7,${0.08*fade})`);g.addColorStop(0.5,`rgba(15,12,8,${0.04*fade})`);g.addColorStop(1,'rgba(20,15,10,0)');ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()}return true}}
  let drops=[];function add(){let a=0,x,y;do{x=Math.random()*gW();y=Math.random()*gH();a++}while(a<20&&drops.some(d=>Math.hypot(d.x-x,d.y-y)<150));const c=new Cloud();c.x=x;c.y=y;drops.push(c)}add();setInterval(add,6000);(function run(){const now=performance.now();ctx.clearRect(0,0,gW(),gH());drops=drops.filter(d=>d.draw(now));requestAnimationFrame(run)})()
});
initCard('card5', (ctx, gW, gH) => {
  class Bleed{constructor(){this.x=Math.random()*gW();this.y=Math.random()*gH();this.born=performance.now();this.duration=10000+Math.random()*4000;this.maxR=55+Math.random()*50;const base=[];const n=60;for(let i=0;i<n;i++)base.push(0.75+Math.random()*0.5);for(let p=0;p<6;p++){for(let i=0;i<n;i++){const prev=base[(i-1+n)%n],next=base[(i+1)%n];base[i]=base[i]*0.5+(prev+next)*0.25}}this.shape=base}draw(now){const t=(now-this.born)/this.duration;if(t>1)return false;const expand=Math.pow(t,0.35);const fade=1-t;const r=this.maxR*expand;ctx.save();ctx.filter='blur(5px)';ctx.beginPath();const n=this.shape.length;for(let i=0;i<=n;i++){const idx=i%n,ang=(Math.PI*2/n)*i;const pr=r*this.shape[idx];i===0?ctx.moveTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr):ctx.lineTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr)}ctx.closePath();ctx.clip();const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,r);g.addColorStop(0,`rgba(10,8,5,${0.2*fade})`);g.addColorStop(0.6,`rgba(10,8,5,${0.11*fade})`);g.addColorStop(1,`rgba(10,8,5,${0.03*fade})`);ctx.fillStyle=g;ctx.fillRect(this.x-r,this.y-r,r*2,r*2);ctx.restore();return true}}
  let drops=[];function add(){let a=0,x,y;do{x=Math.random()*gW();y=Math.random()*gH();a++}while(a<20&&drops.some(d=>Math.hypot(d.x-x,d.y-y)<140));const b=new Bleed();b.x=x;b.y=y;drops.push(b)}add();setInterval(add,5000);(function run(){const now=performance.now();ctx.clearRect(0,0,gW(),gH());drops=drops.filter(d=>d.draw(now));requestAnimationFrame(run)})()
});
initCard('card6', (ctx, gW, gH) => {
  class Layer{constructor(cx,cy,delay){this.x=cx+(Math.random()-0.5)*25;this.y=cy+(Math.random()-0.5)*25;this.born=performance.now()+delay;this.duration=8000+Math.random()*3000;this.maxR=35+Math.random()*45;const raw=Array.from({length:28},()=>0.6+Math.random()*0.8);for(let p=0;p<3;p++){for(let i=0;i<28;i++){const prev=raw[(i-1+28)%28],next=raw[(i+1)%28];raw[i]=raw[i]*0.5+(prev+next)*0.25}}this.shape=raw}draw(now){const elapsed=now-this.born;if(elapsed<0)return true;const t=elapsed/this.duration;if(t>1)return false;const expand=Math.pow(t,0.35);const fade=1-t;const r=this.maxR*expand;ctx.save();ctx.filter='blur(4px)';ctx.beginPath();for(let i=0;i<=28;i++){const idx=i%28,ang=(Math.PI*2/28)*i;const pr=r*this.shape[idx];i===0?ctx.moveTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr):ctx.lineTo(this.x+Math.cos(ang)*pr,this.y+Math.sin(ang)*pr)}ctx.closePath();ctx.fillStyle=`rgba(10,8,5,${0.06*fade})`;ctx.fill();ctx.restore();return true}}
  class Group{constructor(cx,cy){this.x=cx;this.y=cy;this.layers=[];for(let i=0;i<4+Math.floor(Math.random()*3);i++){this.layers.push(new Layer(cx,cy,i*500))}}draw(now){this.layers=this.layers.filter(l=>l.draw(now));return this.layers.length>0}}
  let groups=[];function add(){let a=0,x,y;do{x=Math.random()*gW();y=Math.random()*gH();a++}while(a<20&&groups.some(g=>Math.hypot(g.x-x,g.y-y)<130));groups.push(new Group(x,y))}add();setInterval(add,5000);(function run(){const now=performance.now();ctx.clearRect(0,0,gW(),gH());groups=groups.filter(g=>g.draw(now));requestAnimationFrame(run)})()
});
})
</script>

## 配置方法

### VitePress

在 `.vitepress/config.mts` 中配置：

```ts
export default defineConfig({
  themeConfig: {
    inkEffect: 'bleedEdge',       // 效果名称，不配置或空字符串则不启用
    inkEffectOpacity: 0.5         // 可选，整体不透明度叠加系数，默认 1
  }
})
```

### Astro

在 `astro.config.mjs` 中配置：

```js
export default defineConfig({
  integrations: [
    inkpaper({
      inkEffect: 'bleedEdge',     // 效果名称，不配置或空字符串则不启用
      inkEffectOpacity: 0.5       // 可选，整体不透明度叠加系数，默认 1
    })
  ]
})
```

可选值：`inkDrop` | `fiberBleed` | `splash` | `waterCloud` | `bleedEdge` | `layeredInk`

设为空字符串或不配置则不启用动效。默认不启用。
