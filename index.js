const express = require('express')
const template = require('./template')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send(template.todo({
        title: 'Home',
        text: 'Hello world'
    }))
})

app.get('/completed', (req, res) => {
    res.send(template.completed({
        title: 'Completed',
        text: 'This is complete page'
    }))
})

app.get('/add', (req, res) => {
    res.send(template.add({
        title: 'Add',
        text: 'This is add page'
    }))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))