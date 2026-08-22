const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give your password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://akmalsyam67_db_user:${password}@cluster0.vxwq1wx.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, {family : 4})

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phoneSchema)

if (process.argv.length > 3) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person
    .find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}