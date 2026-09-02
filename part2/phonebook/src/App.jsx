import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/phonebook'
import Notification from './components/Notification'

function App() {
  const [persons, setPersons] = useState([])
  const [notif, setNotif] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(dataInitial => setPersons(dataInitial))
  }, [])

  const addPerson = (newData) => {
    personService
      .create(newData)
      .then(newPerson => {
        setNotif(['added', newPerson.name])
        setTimeout(() => {
          setNotif(null)
        }, 5000)
        setPersons(persons.concat(newPerson))
      })
  }

  const updatePerson = (person, newNumber) => {
    const changedNumber = { ...person, number: newNumber }
    personService
      .update(person.id, changedNumber)
      .then(updatedNumber => {
        setNotif(['updated', updatedNumber.name])
        setTimeout(() => {
          setNotif(null)
        }, 5000)
        setPersons(persons.map(p => p.id === updatedNumber.id ? updatedNumber : p))
      })
      .catch(error => {
        setNotif(['error', changedNumber.name])
        setTimeout(() => {
          setNotif(null)
        }, 5000)
        personService
          .getAll()
          .then(dataInitial => setPersons(dataInitial))
      })
  }

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notif={notif} />
      <Filter persons={persons} />
      <h1>add a new</h1>
      <PersonForm persons={persons} onAddPerson={addPerson} onUpdatePerson={updatePerson} />
      <h2>Numbers</h2>
      <Persons persons={persons} onDeletePerson={handleDelete} />
    </div>
  )
}

export default App
