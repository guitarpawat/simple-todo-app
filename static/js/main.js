var todoModel = (function() {

    var todos = []

    var Todo = function(id, header, msg, createDate, dueDate) {
        this.id = id
        this.header = header
        this.msg = msg
        this.createDate = createDate
        this.dueDate = dueDate
        this.complete = false
    }

    function getTodo(completed) {
        var res = []
        todos.forEach(function(todo) {
            if(todo.complete === completed) {
                res.push(todo)
            }
        })
        return res
    }

    return {
        /* For testing purpose only
        getTodos: function() {
            return todos
        },
        */

        getNotCompleted: function() {
            return getTodo(false)
        },

        getCompleted: function() {
            return getTodo(true)
        },

        putTodo: function(header, msg, createDate, dueDate) {
            var id
            if(todos.length === 0) {
                id = 1
            } else {
                id = todos[todos.length - 1].id + 1
            }
            var todo = new Todo(id, header, msg, createDate, dueDate)
            todos.push(todo)
            return todo
        },

        deleteTodo(id) {
            var index = todos.findIndex(function(todo) {
                return todo.id === id
            })

            return todos.splice(index, 1)
        },
    }

})()

var todoView = (function() {

    var DOM_ID = {
        content: 'content'
    }

    var dateStr = function(date) {
        return `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    return {
        addTodo: function(todo) {
            var insertStr = `<p><b>${todo.header}</b>&emsp;${todo.msg}&emsp;<i>Due by ${dateStr(todo.dueDate)}</i></p>`
            document.getElementById(DOM_ID.content).insertAdjacentHTML('afterbegin', insertStr)
        },
    }

})()

var todoController = (function(model, view) {

    var parseDate = function(dateStr) {
        var dateArr = dateStr.split(/(?:\/|-|\s)/)
        var date = dateArr[0]
        var month = dateArr[1]
        var year = dateArr[2]
        var d = new Date()
        d.setFullYear(year, month-1, date)
        console.log(dateStr, dateArr, d)
        return d
    }

    return {
        makeTodo: function(header, msg, dueDate) {
            var todo = model.putTodo(header, msg, new Date(), parseDate(dueDate))
            view.addTodo(todo)
        }
    }

})(todoModel, todoView)