// Bakes the homepage markup into dist/index.html so crawlers, link unfurlers
// and LLM agents that don't run JavaScript still see the real content.
import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href)

const indexPath = path.join(root, 'dist/index.html')
const template = await readFile(indexPath, 'utf8')
const html = render('/')
if (!html.includes('Enjoying The Show')) throw new Error('Prerender produced unexpected markup')

await writeFile(indexPath, template.replace('<div id="root"></div>', `<div id="root">${html}</div>`))
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`Prerendered / (${html.length} bytes)`)
