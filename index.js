require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Phone = require('./models/phone')
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

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    var maara = 0
    Phone.find({}).then(phone => {
        phone.forEach(element => {
            maara ++
        })
        var d = new Date()
        res.send(`<div>
        <p>Phonebook has info for ${maara} people</p>
        <p>${d}</p>
        </div>`)
    })
    
})

app.get('/api/persons', (request, response) => {
    Phone.find({}).then(phone => {
        console.log(phone)
        response.json(phone)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Phone.findById(request.params.id).then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Phone.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const phone = new Phone ({
        name: body.name,
        number: body.number,    
    })

    phone.save().then(savedPhone => {
        response.json(savedPhone)
    })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Phone.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPhone => {
        response.json(updatedPhone.toJSON())
      })
      .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})