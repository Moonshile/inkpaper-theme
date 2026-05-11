#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templateDir = path.join(__dirname, 'template')
const targetDir = process.argv[2] || '.'

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      if (fs.existsSync(destPath)) {
        console.log(`  skip ${path.relative(targetDir, destPath)} (already exists)`)
        continue
      }
      fs.copyFileSync(srcPath, destPath)
      console.log(`  create ${path.relative(targetDir, destPath)}`)
    }
  }
}

const resolvedTarget = path.resolve(targetDir)

console.log(`\nScaffolding inkpaper blog in ${resolvedTarget}\n`)

copyDir(templateDir, resolvedTarget)

const rel = path.relative(process.cwd(), resolvedTarget)
const cdHint = targetDir === '.' ? '' : `  cd ${rel.startsWith('..') ? resolvedTarget : rel}\n`

console.log(`
Done. Next steps:

${cdHint}  npm install
  npm run dev
`)
