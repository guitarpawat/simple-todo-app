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

    function sortTodos(a, b) {
        return new Date(b.dueDate) - new Date(a.dueDate)
    }

    return {
        //For testing purpose only
        // getTodos: function() {
        //     return todos
        // },

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
            todos.sort(sortTodos)
            return todo
        },

        deleteTodo: function(id) {
            var index = todos.findIndex(function(todo) {
                return todo.id === id
            })

            return todos.splice(index, 1)
        },

        loadTodos: function(todo) {
            if(todo) todos = todo
        }
    }

})()

var todoView = (function() {

    var DOM = {
        selector: {
            nearestData: 'p',
            nearestDelete: 'a',
            todo: '.todo'
        },
        id: {
            content: 'content'
        },
        data: {
            id: 'data-id'
        },
        classes: {
            todo: 'todo'
        }
    }

    function dateStr(date) {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    function clear() {
        var todos = document.querySelectorAll(DOM.selector.todo)
        todos.forEach(function(e) {e.parentNode.removeChild(e)})
    }

    return {
        addTodo: function(todo) {
            var insertStr = `<${DOM.selector.nearestData} class="${DOM.classes.todo}" ${DOM.data.id}="${todo.id}"><b>${todo.header}</b>&emsp;${todo.msg}&emsp;<i>Created: ${dateStr(todo.createDate)} Due: ${dateStr(todo.dueDate)}</i>&emsp;<${DOM.selector.nearestDelete} href="#">[delete]</${DOM.selector.nearestDelete}></${DOM.selector.nearestData}>`
            document.getElementById(DOM.id.content).insertAdjacentHTML('afterbegin', insertStr)
        },

        getDom: function() {
            return DOM
        },

        update: function(todos) {
            clear()
            if(todos) {
                var _this = this
                todos.forEach(function(e) {_this.addTodo(e)})
            }
        },
    }

})()

var todoController = (function(model, view) {

    var DOM = view.getDom()
    var local = {
        todos: 'todos'
    }

    function parseDate(dateStr, isDue = false) {
        var dateArr = dateStr.split(/(?:\/|-|\s)/)
        var date = dateArr[0]
        var month = dateArr[1]
        var year = dateArr[2]
        var d = new Date()
        d.setHours(23, 59, 59, 999)
        return d
    }

    function update() {
        var todos = model.getNotCompleted()
        save(todos)
        view.update(todos)
    }

    function load() {
        var todos = JSON.parse(localStorage.getItem(local.todos))
        todos = todos? todos : []
        todos.forEach(function(e) {
            e.createDate = new Date(e.createDate)
            e.dueDate = new Date(e.dueDate)
        })
        return todos
    }

    function save(todos) {
        if(todos) {
            localStorage.removeItem(local.todos)
            localStorage.setItem(local.todos, JSON.stringify(todos))
        }
    }

    function addTodoViewEvent() {
        document.getElementById(DOM.id.content).addEventListener('click', function(e) {
            if(e.target.tagName.toUpperCase() === DOM.selector.nearestDelete.toUpperCase()) {
                var closest = e.target.closest(DOM.selector.nearestData)
                var id = closest.getAttribute(DOM.data.id)
                model.deleteTodo(id)
                update()
            }
        })
    }

    function isTodoPage() {
        return !!document.getElementById(DOM.id.content)
    }

    return {
        makeTodo: function(header, msg, dueDate) {
            model.putTodo(header, msg, new Date(), parseDate(dueDate))
            update()
        },

        init: function() {
            if(isTodoPage()) {
                addTodoViewEvent()
                model.loadTodos(load())
                update()
            }
        }
    }

})(todoModel, todoView)

todoController.init()