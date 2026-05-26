/**
 * Ink diffusion background effect engine.
 * Framework-agnostic — call initInkEffect(canvas, options) to start.
 */

const EFFECTS = {
  inkDrop: createInkDrop,
  fiberBleed: createFiberBleed,
  splash: createSplash,
  waterCloud: createWaterCloud,
  bleedEdge: createBleedEdge,
  layeredInk: createLayeredInk,
}

export function initInkEffect(canvas, options = {}) {
  const effect = options.effect || 'inkDrop'
  const opacity = options.opacity ?? 1
  const factory = EFFECTS[effect]
  if (!factory) return () => {}

  const ctx = canvas.getContext('2d')
  let W, H
  let animId = null
  let intervalId = null

  let cachedZone = null
  let cacheTime = 0

  function getContentExclusionZone() {
    // Cache for 2 seconds to avoid layout thrashing
    const now = Date.now()
    if (cachedZone && now - cacheTime < 2000) return cachedZone

    // Try to find the prose/content element
    const selectors = [
      '.doc-content',
      '.doc-content-container',
      '.vp-doc',
      '.VPDoc .content-container',
      '.inkpaper-prose',
      'article',
      'main',
    ]
    for (const sel of selectors) {
      const el = document.querySelector(sel)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      // Must be a real content column — not full-width
      if (rect.width > 0 && rect.width < W - 100) {
        cachedZone = { left: rect.left, right: rect.right }
        cacheTime = now
        return cachedZone
      }
    }
    // Fallback: estimate content area from viewport center
    // Typical blog content is 700-800px wide, centered (possibly offset by sidebar)
    const sidebar = document.querySelector('.VPSidebar, .doc-sidebar')
    const sidebarWidth = sidebar ? sidebar.getBoundingClientRect().width : 0
    const availableWidth = W - sidebarWidth
    const contentWidth = Math.min(750, availableWidth * 0.7)
    const contentLeft = sidebarWidth + (availableWidth - contentWidth) / 2
    cachedZone = { left: contentLeft, right: contentLeft + contentWidth }
    cacheTime = now
    return cachedZone
  }

  function resize() {
    W = canvas.width = window.innerWidth
    H = canvas.height = window.innerHeight
  }

  function randomSidePosition(drops, minDist) {
    const zone = getContentExclusionZone()
    let attempts = 0, x, y
    do {
      if (zone && W > 768) {
        const leftWidth = Math.max(zone.left, 0)
        const rightWidth = Math.max(W - zone.right, 0)
        const totalMargin = leftWidth + rightWidth
        if (totalMargin < 60) {
          // Screen too narrow for margins — skip generation
          return { x: -9999, y: -9999 }
        }
        // Pick side weighted by available width
        const side = Math.random() < (leftWidth / totalMargin) ? 'left' : 'right'
        if (side === 'left') {
          x = Math.random() * leftWidth
        } else {
          x = zone.right + Math.random() * rightWidth
        }
      } else {
        // Mobile/narrow: allow anywhere
        x = Math.random() * W
      }
      y = Math.random() * H
      attempts++
    } while (attempts < 30 && drops.some(d => Math.hypot(d.x - x, d.y - y) < minDist))
    return { x, y }
  }

  resize()
  window.addEventListener('resize', resize)

  const { drops, addDrop, draw, interval } = factory(ctx, () => W, () => H, randomSidePosition)
  addDrop()
  intervalId = setInterval(addDrop, interval)

  function animate() {
    const now = performance.now()
    ctx.clearRect(0, 0, W, H)
    ctx.globalAlpha = opacity
    draw(now)
    ctx.globalAlpha = 1
    animId = requestAnimationFrame(animate)
  }
  animate()

  return function destroy() {
    if (animId) cancelAnimationFrame(animId)
    if (intervalId) clearInterval(intervalId)
    window.removeEventListener('resize', resize)
  }
}

function createInkDrop(ctx, gW, gH, randomPos) {
  const drops = []
  const minDist = 150

  class Drop {
    constructor(x, y) {
      this.x = x; this.y = y
      this.maxR = 70 + Math.random() * 50
      const n = 36
      const raw = Array.from({length: n}, () => 0.75 + Math.random() * 0.5)
      for (let pass = 0; pass < 1; pass++) {
        for (let i = 0; i < n; i++) {
          const prev = raw[(i-1+n)%n], next = raw[(i+1)%n]
          raw[i] = raw[i]*0.5 + (prev+next)*0.25
        }
      }
      this.shape = raw
      this.born = performance.now()
      this.duration = 12000 + Math.random() * 6000
    }
    draw(now) {
      const t = (now - this.born) / this.duration
      if (t > 1) return false
      const r = this.maxR * Math.pow(t, 0.4)
      const alpha = 0.15 * (1 - t)
      ctx.save(); ctx.filter = 'blur(3px)'; ctx.beginPath()
      const n = this.shape.length
      for (let i = 0; i <= n; i++) {
        const idx = i % n, ang = (Math.PI * 2 / n) * i
        const pr = r * this.shape[idx]
        i === 0 ? ctx.moveTo(this.x + Math.cos(ang)*pr, this.y + Math.sin(ang)*pr) : ctx.lineTo(this.x + Math.cos(ang)*pr, this.y + Math.sin(ang)*pr)
      }
      ctx.closePath(); ctx.fillStyle = `rgba(10,8,5,${alpha})`; ctx.fill(); ctx.restore()
      return true
    }
  }

  return {
    drops,
    interval: 7000,
    addDrop() {
      const { x, y } = randomPos(drops, minDist)
      if (x < -999) return
      drops.push(new Drop(x, y))
    },
    draw(now) {
      let i = drops.length
      while (i--) { if (!drops[i].draw(now)) drops.splice(i, 1) }
    },
  }
}

function createFiberBleed(ctx, gW, gH, randomPos) {
  const drops = []
  const minDist = 120

  class Fiber {
    constructor(x, y) {
      this.x = x; this.y = y
      this.born = performance.now(); this.duration = 11000 + Math.random() * 4000
      this.baseR = 20 + Math.random() * 15
      this.fibers = []
      const count = 30 + Math.floor(Math.random() * 25)
      for (let i = 0; i < count; i++) {
        const startAngle = Math.random() * Math.PI * 2
        const startR = this.baseR * (0.7 + Math.random() * 0.3)
        const sx = Math.cos(startAngle) * startR
        const sy = Math.sin(startAngle) * startR
        const path = [{x: sx, y: sy}]
        let dir = startAngle + (Math.random() - 0.5) * 1.5
        const segments = 3 + Math.floor(Math.random() * 5)
        let cx = sx, cy = sy
        for (let s = 0; s < segments; s++) {
          dir += (Math.random() - 0.5) * 1.4
          const step = 4 + Math.random() * 10
          cx += Math.cos(dir) * step; cy += Math.sin(dir) * step
          path.push({x: cx, y: cy})
          if (Math.random() < 0.3 && s < segments - 1) {
            const branchDir = dir + (Math.random() - 0.5) * 2
            const branchLen = 3 + Math.random() * 8
            path.push({x: cx + Math.cos(branchDir)*branchLen, y: cy + Math.sin(branchDir)*branchLen, branch: true})
          }
        }
        this.fibers.push({ path, width: 0.3 + Math.random() * 1.0 })
      }
      const n = 28
      const raw = Array.from({length: n}, () => 0.8 + Math.random() * 0.4)
      for (let pass = 0; pass < 4; pass++) {
        for (let i = 0; i < n; i++) {
          const prev = raw[(i-1+n)%n], next = raw[(i+1)%n]
          raw[i] = raw[i]*0.5 + (prev+next)*0.25
        }
      }
      this.blobShape = raw
    }
    draw(now) {
      const t = (now - this.born) / this.duration
      if (t > 1) return false
      const grow = Math.pow(Math.min(t * 2.5, 1), 0.5)
      const fade = 1 - t
      ctx.save(); ctx.filter = 'blur(4px)'; ctx.beginPath()
      const n = this.blobShape.length
      for (let i = 0; i <= n; i++) {
        const idx = i % n, ang = (Math.PI*2/n)*i
        const pr = this.baseR * this.blobShape[idx]
        i === 0 ? ctx.moveTo(this.x+Math.cos(ang)*pr, this.y+Math.sin(ang)*pr) : ctx.lineTo(this.x+Math.cos(ang)*pr, this.y+Math.sin(ang)*pr)
      }
      ctx.closePath(); ctx.fillStyle = `rgba(10,8,5,${0.07 * fade})`; ctx.fill(); ctx.restore()
      for (const f of this.fibers) {
        const totalPts = f.path.length
        const visiblePts = grow * totalPts
        if (visiblePts < 1) continue
        ctx.beginPath()
        let lastMain = f.path[0]
        ctx.moveTo(this.x + f.path[0].x, this.y + f.path[0].y)
        const fullSegs = Math.floor(visiblePts)
        for (let s = 1; s <= Math.min(fullSegs, totalPts - 1); s++) {
          const p = f.path[s]
          if (p.branch) {
            ctx.moveTo(this.x + lastMain.x, this.y + lastMain.y)
            ctx.lineTo(this.x + p.x, this.y + p.y)
          } else {
            ctx.lineTo(this.x + p.x, this.y + p.y)
            lastMain = p
          }
        }
        const frac = visiblePts - fullSegs
        if (frac > 0 && fullSegs < totalPts - 1) {
          const prev = f.path[fullSegs]
          const next = f.path[fullSegs + 1]
          if (next && !next.branch) {
            ctx.lineTo(this.x + prev.x + (next.x-prev.x)*frac, this.y + prev.y + (next.y-prev.y)*frac)
          }
        }
        ctx.strokeStyle = `rgba(10,8,5,${0.07 * fade})`
        ctx.lineWidth = f.width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke()
      }
      return true
    }
  }

  return {
    drops,
    interval: 5000,
    addDrop() {
      const { x, y } = randomPos(drops, minDist)
      drops.push(new Fiber(x, y))
    },
    draw(now) {
      let i = drops.length
      while (i--) { if (!drops[i].draw(now)) drops.splice(i, 1) }
    },
  }
}

function createSplash(ctx, gW, gH, randomPos) {
  const drops = []
  const minDist = 150

  class Splash {
    constructor(x, y) {
      this.x = x; this.y = y
      this.born = performance.now(); this.duration = 10000 + Math.random() * 4000
      const n = 24
      this.mainShape = Array.from({length: n}, () => 0.6 + Math.random() * 0.8)
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < n; i++) {
          const prev = this.mainShape[(i-1+n)%n], next = this.mainShape[(i+1)%n]
          this.mainShape[i] = this.mainShape[i]*0.5 + (prev+next)*0.25
        }
      }
      this.mainR = 20 + Math.random() * 15
      this.splats = []
      const count = 20 + Math.floor(Math.random() * 20)
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        const dist = 25 + Math.random() * 70
        const r = 2 + Math.random() * 8
        const sn = 8
        const shape = Array.from({length: sn}, () => 0.7 + Math.random()*0.6)
        for (let pass = 0; pass < 2; pass++) {
          for (let j = 0; j < sn; j++) {
            const prev = shape[(j-1+sn)%sn], next = shape[(j+1)%sn]
            shape[j] = shape[j]*0.5 + (prev+next)*0.25
          }
        }
        this.splats.push({ ox: Math.cos(a)*dist, oy: Math.sin(a)*dist, r, shape })
      }
    }
    draw(now) {
      const t = (now - this.born) / this.duration
      if (t > 1) return false
      const expand = 1 + Math.pow(t, 0.4) * 0.8
      const fade = 1 - t
      const alpha = 0.15 * fade
      ctx.save(); ctx.filter = 'blur(2px)'; ctx.beginPath()
      const mn = this.mainShape.length
      for (let i = 0; i <= mn; i++) {
        const idx = i % mn, ang = (Math.PI*2/mn)*i
        const r = this.mainR * this.mainShape[idx] * expand
        const px = this.x + Math.cos(ang)*r, py = this.y + Math.sin(ang)*r
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath()
      for (const s of this.splats) {
        const sn = s.shape.length
        const sx = this.x + s.ox, sy = this.y + s.oy
        for (let i = 0; i <= sn; i++) {
          const idx = i % sn, ang = (Math.PI*2/sn)*i
          const r = s.r * s.shape[idx] * expand
          i === 0 ? ctx.moveTo(sx+Math.cos(ang)*r, sy+Math.sin(ang)*r) : ctx.lineTo(sx+Math.cos(ang)*r, sy+Math.sin(ang)*r)
        }
        ctx.closePath()
      }
      ctx.fillStyle = `rgba(10,8,5,${alpha})`; ctx.fill(); ctx.restore()
      return true
    }
  }

  return {
    drops,
    interval: 5000,
    addDrop() {
      const { x, y } = randomPos(drops, minDist)
      drops.push(new Splash(x, y))
    },
    draw(now) {
      let i = drops.length
      while (i--) { if (!drops[i].draw(now)) drops.splice(i, 1) }
    },
  }
}

function createWaterCloud(ctx, gW, gH, randomPos) {
  const drops = []
  const minDist = 150

  class Cloud {
    constructor(x, y) {
      this.x = x; this.y = y
      this.born = performance.now(); this.duration = 14000 + Math.random() * 5000
      this.blobs = []
      for (let i = 0; i < 5 + Math.floor(Math.random()*3); i++) {
        this.blobs.push({ox: (Math.random()-0.5)*25, oy: (Math.random()-0.5)*25, maxR: 30+Math.random()*35, drift: {x:(Math.random()-0.5)*0.1, y:(Math.random()-0.5)*0.1}})
      }
    }
    draw(now) {
      const t = (now - this.born) / this.duration
      if (t > 1) return false
      const expand = Math.pow(t, 0.3)
      const fade = 1 - t
      for (const b of this.blobs) {
        const cx = this.x + b.ox + b.drift.x * t * 80
        const cy = this.y + b.oy + b.drift.y * t * 80
        const r = b.maxR * expand
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, `rgba(12,10,7,${0.08 * fade})`)
        g.addColorStop(0.5, `rgba(15,12,8,${0.04 * fade})`)
        g.addColorStop(1, 'rgba(20,15,10,0)')
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill()
      }
      return true
    }
  }

  return {
    drops,
    interval: 8000,
    addDrop() {
      const { x, y } = randomPos(drops, minDist)
      drops.push(new Cloud(x, y))
    },
    draw(now) {
      let i = drops.length
      while (i--) { if (!drops[i].draw(now)) drops.splice(i, 1) }
    },
  }
}

function createBleedEdge(ctx, gW, gH, randomPos) {
  const drops = []
  const minDist = 140

  class Bleed {
    constructor(x, y) {
      this.x = x; this.y = y
      this.born = performance.now(); this.duration = 10000 + Math.random() * 4000
      this.maxR = 55 + Math.random() * 50
      const base = []
      const n = 60
      for (let i = 0; i < n; i++) base.push(0.75 + Math.random() * 0.5)
      for (let pass = 0; pass < 6; pass++) {
        for (let i = 0; i < n; i++) {
          const prev = base[(i-1+n)%n], next = base[(i+1)%n]
          base[i] = base[i] * 0.5 + (prev + next) * 0.25
        }
      }
      this.shape = base
    }
    draw(now) {
      const t = (now - this.born) / this.duration
      if (t > 1) return false
      const expand = Math.pow(t, 0.35)
      const fade = 1 - t
      const r = this.maxR * expand
      ctx.save(); ctx.filter = 'blur(5px)'; ctx.beginPath()
      const n = this.shape.length
      for (let i = 0; i <= n; i++) {
        const idx = i % n, ang = (Math.PI*2/n)*i
        const pr = r * this.shape[idx]
        const px = this.x + Math.cos(ang)*pr, py = this.y + Math.sin(ang)*pr
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath(); ctx.clip()
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r)
      g.addColorStop(0, `rgba(10,8,5,${0.2 * fade})`)
      g.addColorStop(0.6, `rgba(10,8,5,${0.11 * fade})`)
      g.addColorStop(1, `rgba(10,8,5,${0.03 * fade})`)
      ctx.fillStyle = g; ctx.fillRect(this.x - r, this.y - r, r*2, r*2)
      ctx.restore()
      return true
    }
  }

  return {
    drops,
    interval: 5000,
    addDrop() {
      const { x, y } = randomPos(drops, minDist)
      drops.push(new Bleed(x, y))
    },
    draw(now) {
      let i = drops.length
      while (i--) { if (!drops[i].draw(now)) drops.splice(i, 1) }
    },
  }
}

function createLayeredInk(ctx, gW, gH, randomPos) {
  const groups = []
  const minDist = 130

  class Layer {
    constructor(cx, cy, delay) {
      this.x = cx + (Math.random()-0.5)*25; this.y = cy + (Math.random()-0.5)*25
      this.born = performance.now() + delay; this.duration = 8000 + Math.random()*3000
      this.maxR = 35 + Math.random()*45
      const raw = Array.from({length: 28}, () => 0.6 + Math.random()*0.8)
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < 28; i++) {
          const prev = raw[(i-1+28)%28], next = raw[(i+1)%28]
          raw[i] = raw[i]*0.5 + (prev+next)*0.25
        }
      }
      this.shape = raw
    }
    draw(now) {
      const elapsed = now - this.born
      if (elapsed < 0) return true
      const t = elapsed / this.duration
      if (t > 1) return false
      const expand = Math.pow(t, 0.35)
      const fade = 1 - t
      const r = this.maxR * expand
      ctx.save(); ctx.filter = 'blur(4px)'; ctx.beginPath()
      for (let i = 0; i <= 28; i++) {
        const idx = i % 28, ang = (Math.PI*2/28)*i
        const pr = r * this.shape[idx]
        i === 0 ? ctx.moveTo(this.x+Math.cos(ang)*pr, this.y+Math.sin(ang)*pr) : ctx.lineTo(this.x+Math.cos(ang)*pr, this.y+Math.sin(ang)*pr)
      }
      ctx.closePath(); ctx.fillStyle = `rgba(10,8,5,${0.06 * fade})`; ctx.fill(); ctx.restore()
      return true
    }
  }

  class Group {
    constructor(cx, cy) {
      this.x = cx; this.y = cy
      this.layers = []
      for (let i = 0; i < 4 + Math.floor(Math.random()*3); i++) {
        this.layers.push(new Layer(cx, cy, i * 500))
      }
    }
    draw(now) { this.layers = this.layers.filter(l => l.draw(now)); return this.layers.length > 0 }
  }

  return {
    drops: groups,
    interval: 5000,
    addDrop() {
      const { x, y } = randomPos(groups, minDist)
      if (x < -999) return
      groups.push(new Group(x, y))
    },
    draw(now) {
      let i = groups.length
      while (i--) { if (!groups[i].draw(now)) groups.splice(i, 1) }
    },
  }
}
