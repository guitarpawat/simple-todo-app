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
            todos.push(new Todo(id, header, msg, createDate, dueDate))
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

})()

var todoController = (function() {

})()