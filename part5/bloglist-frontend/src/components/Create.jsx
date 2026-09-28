import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const Create = ({ onCreate }) => {
  const [formData, setFormData] = useState({ title: '', author: '', url: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCreate = async event => {
    event.preventDefault()
    navigate('/')
    onCreate(formData)
    setFormData({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          <TextField style={{marginBottom: 5}} label="title" name="title" type="text" value={formData.title} onChange={handleChange} />
        </div>
        <div>
          <TextField style={{marginBottom: 5}} label="author" name="author" type="text" value={formData.author} onChange={handleChange} />
        </div>
        <div>
          <TextField style={{marginBottom: 5}} label="url" name="url" type="text" value={formData.url} onChange={handleChange} />
        </div>
        <Button type='submit' variant='contained' style={{ marginTop: 10 }}>create</Button>
      </form>
    </div>
  )
}

export default Create
