const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('content', function(req, res) {
    const body = req.body
    return JSON.stringify(body)
});

var logger = morgan(':method :url :status :res[content-length] - :response-time ms :content')

app.use(logger)

let persons = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    var maara = persons.length
    var d = new Date()
    res.send(`<div>
    <p>Phonebook has info for ${maara} people</p>
    <p>${d}</p>
    </div>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    person = persons.filter(person => person.id !== id)
    console.log(person)
    persons = [...person]
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random()*10000)
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'Some content is missing' 
        })
    }
    persont = persons.filter(person => person.name === body.name)
    if(persont.length > 0){
        return response.status(400).json({ 
            error: 'name must be unique' 
            })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})