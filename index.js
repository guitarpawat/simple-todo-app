const express = require('express')
const pug = require('pug')
const app = express()
const port = 3000

const index = pug.compileFile('./templates/index.pug')

app.get('/', (req, res) => res.send(index( {
    text: 'Hello world'
})))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))