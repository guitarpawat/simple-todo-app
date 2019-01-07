const express = require('express')
const pug = require('pug')
const app = express()
const port = 3000

const index = pug.compileFile('./templates/todo.pug')

app.get('/', (req, res) => res.send(index({
    title: 'Home',
    text: 'Hello world'
})))

app.get('/completed', (req, res) => res.send(index({
    title: 'Completed',
    text: 'This is completed page'
})))

app.get('/add', (req, res) => res.send(index({
    title: 'Add',
    text: 'This is add page'
})))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))