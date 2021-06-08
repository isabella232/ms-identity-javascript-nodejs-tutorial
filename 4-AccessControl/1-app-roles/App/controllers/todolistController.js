const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./data/db.json');
const db = lowdb(adapter);
const { nanoid } = require('nanoid')

exports.getTodos = (req, res) => {
    const owner = req.session.account.idTokenClaims['preferred_username'];

    const todos = db.get('todos')
        .filter({ owner: owner })
        .value();

    res.render('todolist', { isAuthenticated: req.session.isAuthenticated, todos: todos });
}

exports.postTodo = (req, res) => {
    const newTodo = {
        id: nanoid(),
        name: req.body.name,
        owner: req.session.account.idTokenClaims['preferred_username'],
    };

    db.get('todos').push(newTodo).write();
    res.redirect('/todolist');
}

exports.deleteTodo = (req, res) => {
    const id = req.params.id;
    const owner = req.session.account.idTokenClaims['preferred_username'];

    db.get('todos')
        .remove({ owner: owner, id: id })
        .write();

    res.redirect('/todolist');
}