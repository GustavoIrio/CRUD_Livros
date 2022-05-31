const express = require('express')
const exphbs = require('express-handlebars')
const engine = exphbs.engine
const pool = require('./db/conn')
const port = 3000

const app = express()

// pegando dados do body, transformando em json
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

// executando o handlebars - template engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set('views', './views')

// arquivos estaticos
app.use(express.static('public'))

// home
app.get('/', (req, res) => {
    res.render('home')
})

// inserindo no banco
app.post('/books/insertbook', (req, res) => {
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `INSERT INTO books (??, ??) VALUES (?, ?)`
    const data = ['title', 'pageqty', title, pageqty]

    pool.query(sql, data, function(err){
        if (err) {
            console.log(err)
            return
        } 

        res.redirect('/books')
    })
})

// listando todos
app.get('/books', (req, res) => {
    const sql = "SELECT * FROM books"

    pool.query(sql, function(err, data){
        if (err) {
            console.log(err)
            return
        } 
        const books = data

        console.log(books)

        res.render('books', { books })

    })
})

// listando através do ID
app.get('/books/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id', id]

    pool.query(sql, data, function(err, data) {
        if (err) {
            console.log(err)
            return
        } 

        const book = data[0]

        res.render('book', { book })
    })
})

// editando campo
app.get('/books/edit/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id', id]

    pool.query(sql, data, function(err, data) {
        if (err) {
            console.log(err)
            return
        } 

        const book = data[0]

        res.render('editbook', { book })
    })
})

// inserindo campo editado
app.post('/books/updatebook', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ['title', title, 'pageqty', pageqty, 'id', id]

    pool.query(sql, data, function(err, data) {
        if (err) {
            console.log(err)
            return
        } 

        res.redirect('/books')
    })
})

// excluindo dados
app.post('/books/remove/:id', (req, res) => {
    const id = req.params.id

    const sql = `DELETE FROM books WHERE ?? = ?`
    const data = ['id', id]

    pool.query(sql, data, function(err, data) {
        if (err) {
            console.log(err)
            return
        } 

        res.redirect('/books')
    })
})

app.listen(port)