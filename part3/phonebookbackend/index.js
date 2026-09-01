require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request, response) =>
  JSON.stringify(request.body)
)

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]
app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

app.get('/info', (request, response) => {
  const requestTime = new Date()
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${requestTime}</p>
    `)
})

const randomId = () => {
  const listId = new Set(persons.map(person => person.id))

  let id
  do {
    id = Math.floor(Math.random() * 10000)
  } while (listId.has(id))

  return String(id)
}

app.post('/api/persons', async (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  try {
    const isExist = await Person.exists({ name: body.name })

    if (isExist) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    } else {
      const person = new Person({
        name: body.name,
        number: body.number
      })

      person.save().then(result => {
        response.json(result)
      })
    }
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
module.exports = app