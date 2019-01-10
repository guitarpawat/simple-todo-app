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

    var DOM = {
        selector: {
            nearestData: 'p',
            nearestDelete: 'a'
        },
        id: {
            content: 'content'
        },
        data: {
            id: 'data-id'
        }
    }

    var dateStr = function(date) {
        return `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    return {
        addTodo: function(todo) {
            var insertStr = `<${DOM.selector.nearestData} ${DOM.data.id}="${todo.id}"><b>${todo.header}</b>&emsp;${todo.msg}&emsp;<i>Created: ${dateStr(todo.createDate)} Due: ${dateStr(todo.dueDate)}</i>&emsp;<${DOM.selector.nearestDelete} href="#">[delete]</${DOM.selector.nearestDelete}></${DOM.selector.nearestData}>`
            document.getElementById(DOM.id.content).insertAdjacentHTML('afterbegin', insertStr)
        },

        getDom: function() {
            return DOM
        },
    }

})()

var todoController = (function(model, view) {

    var DOM = view.getDom()

    var parseDate = function(dateStr) {
        var dateArr = dateStr.split(/(?:\/|-|\s)/)
        var date = dateArr[0]
        var month = dateArr[1]
        var year = dateArr[2]
        var d = new Date()
        d.setFullYear(year, month-1, date)
        return d
    }

    var addViewEvent = function() {
        document.getElementById(DOM.id.content).addEventListener('click', (e) => {
            if(e.target.tagName.toUpperCase() === DOM.selector.nearestDelete.toUpperCase()) {
            var closest = e.target.closest(DOM.selector.nearestData)
            var id = closest.getAttribute(DOM.data.id)
                model.deleteTodo(id)
                closest.parentNode.removeChild(closest)
            }
        })
    }

    return {
        makeTodo: function(header, msg, dueDate) {
            var todo = model.putTodo(header, msg, new Date(), parseDate(dueDate))
            view.addTodo(todo)
        },

        init: function() {
            addViewEvent()
        }
    }

})(todoModel, todoView)

todoController.init()