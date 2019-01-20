var todoModel = (function() {

    var todos = []

    var maxId = 0

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

    function findMaxId() {
        todos.forEach(function(e) {
            maxId = Math.max(maxId, e.id)
        })
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

        getTodos: function() {
            return todos
        },

        putTodo: function(header, msg, createDate, dueDate) {
            maxId++
            var todo = new Todo(maxId, header, msg, createDate, dueDate)
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
            if(todo) {
                todos = todo
                findMaxId()
            }

        }
    }

})()

var todoView = (function() {

    var DOM = {
        selector: {
            nearestData: 'p',
            nearestDelete: '.delete',
            nearestComplete: '.complete',
            todo: '.todo'
        },
        id: {
            content: 'content'
        },
        data: {
            id: 'data-id',
            type: 'data-type'
        },
        classes: {
            todo: 'todo',
            nearestDelete: 'delete',
            nearestComplete: 'complete',
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
            var insertStr = `<${DOM.selector.nearestData} class="${DOM.classes.todo}" ${DOM.data.id}="${todo.id}"><b>${todo.header}</b>&emsp;${todo.msg}&emsp;<i>Created: ${dateStr(todo.createDate)} Due: ${dateStr(todo.dueDate)}</i>&emsp;<a href="#" class="${DOM.classes.nearestComplete}">[complete]</a>&emsp;<a href="#" class="${DOM.classes.nearestDelete}">[delete]</a></${DOM.selector.nearestData}>`
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

    function parseDate(dateStr) {
        var dateArr = dateStr.split(/(?:\/|-|\s)/)
        var date = dateArr[0]
        var month = dateArr[1]
        var year = dateArr[2]
        var d = new Date()
        d.setHours(23, 59, 59, 999)
        d.setFullYear(year, month-1, date)
        return d
    }

    function update() {
        var type = document.getElementById(DOM.id.content).getAttribute(DOM.data.type)
        todos = type === 'todo'? model.getNotCompleted() : model.getCompleted()
        view.update(todos)

        save(model.getTodos())
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
            if(e.target.className.toUpperCase() === DOM.classes.nearestDelete.toUpperCase()) {
                var closest = e.target.closest(DOM.selector.nearestData)
                var id = closest.getAttribute(DOM.data.id)
                model.deleteTodo(parseInt(id))
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