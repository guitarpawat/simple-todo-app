const path = require('path')
const pug = require('pug')

const files = ['add', 'todo']
const templateDir = path.join(__dirname, 'templates')

const compiled = {}

files.forEach(v => {
    const templateFile = path.join(templateDir, `${v}.pug`)
    compiled[v] = pug.compileFile(templateFile)
})

module.exports = compiled