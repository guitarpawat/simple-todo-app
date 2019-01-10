const express = require('express')
const template = require('./template')
const app = express()
const port = 3000

app.use('/static', express.static('static'))

app.get('/', (req, res) => {
    res.send(template.todo({
        title: 'Home',
        text: 'Hello world',
        complete: false,
    }))
})

app.get('/completed', (req, res) => {
    res.send(template.todo({
        title: 'Completed',
        text: 'This is complete page',
        complete: true,
    }))
})

app.get('/add', (req, res) => {
    res.send(template.add({
        title: 'Add',
        text: 'This is add page',
    }))
})

app.listen(port, () => console.log(`Todo app listening on port ${port}!`))
