'use strict';

var STORAGE_KEY = 'todosDB';
var gFilterBy = 'all';
var gSortBy = 'txt';
var gTodos;
_createTodos();

function getTodosForDisplay() {
    sortTodos()
    if (gFilterBy === 'all') return gTodos;
    var todos = gTodos.filter(function (todo) {
        return todo.isDone && gFilterBy === 'done' ||
            !todo.isDone && gFilterBy === 'active'

    })
    return todos;
}

function sortTodos() {
    // debugger
    if (gSortBy === 'txt') {
        gTodos.sort(function (a, b) {
            if (a.txt > b.txt) return 1;
            if (b.txt > a.txt) return -1;
            return 0;
        })
    } else if (gSortBy === 'created') {
        gTodos.sort(function (a, b) {
            if (a.createdAt > b.createdAt) return 1;
            if (b.createdAt > a.createdAt) return -1;
            return 0;
        })
    } else if (gSortBy === 'importance') {
        gTodos.sort(function (a, b) {
            if (a.importance > b.importance) return 1;
            if (b.importance > a.importance) return -1;
            return 0;
        })
    }
}

function noTodos(todos) {
    if (!todos.length) {
        var elTodoList = document.querySelector('.todo-list ul')
        if (gFilterBy === 'all') {
            elTodoList.innerHTML = `there are no Todos`
        }else elTodoList.innerHTML = `there are no ${gFilterBy} Todos`
    }
            
}

function getTotalCount() {
    return gTodos.length;
}
function getActiveCount() {
    var todos = gTodos.filter(function (todo) {
        return !todo.isDone;
    })
    return todos.length;
}

function removeTodo(todoId) {
    var idx = gTodos.findIndex(function (todo) {
        return todo.id === todoId
    })
    if (confirm('are you sure?')) {
        gTodos.splice(idx, 1);
        _saveTodosToStorage();
    }
}

function toggleTodo(todoId) {
    var todo = gTodos.find(function (todo) {
        return todo.id === todoId
    })
    todo.isDone = !todo.isDone;
    _saveTodosToStorage();
}

function addTodo(txt) {
    var todo = _createTodo(txt);
    gTodos.unshift(todo);
    _saveTodosToStorage();
}


function setFilter(filterBy) {
    gFilterBy = filterBy
}

function setSort(sortBy) {
    gSortBy = sortBy
}


function _makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function _saveTodosToStorage() {
    saveToStorage(STORAGE_KEY, gTodos);
}
function _createTodos() {
    var todos = loadFromStorage(STORAGE_KEY)
    if (!todos || todos.length === 0) {
        var todos = [
            _createTodo('Study HTML'),
            _createTodo('Learn CSS'),
            _createTodo('Master Javascript')
        ];
    }
    gTodos = todos;
    _saveTodosToStorage();
}

function _createTodo(txt) {
    var todo = {
        id: _makeId(),
        txt: txt,
        isDone: false,
        createdAt: Date(),
        importance: onSetimportance()
    }
    return todo;
}

function onSetimportance() {
    var elImportance = document.querySelector('.add-todo [name=importance]')
    var importance = elImportance.value
    return importance
}