// biome-ignore lint/style/useNodejsImportProtocol: Node.js script for automation
const fs = require('fs')
// biome-ignore lint/style/useNodejsImportProtocol: Node.js script for automation
const path = require('path')

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'))
const manifestPath = path.resolve(__dirname, '../public/manifest.json')
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

manifest.version = pkg.version
manifest.start_url = `/?v=${pkg.version}`

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Updated manifest.json version to ${pkg.version}`)
