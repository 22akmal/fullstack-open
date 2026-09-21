import { useState } from 'react'

const Create = ({ onCreate }) => {
  const [formData, setFormData] = useState({ title: '', author: '', url: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCreate = async event => {
    event.preventDefault()
    onCreate(formData)
    setFormData({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <form onSubmit={handleCreate}>
        <div>
          <label>title:
            <input name="title" type="text" value={formData.title} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>author:
            <input name="author" type="text" value={formData.author} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>url:
            <input name="url" type="text" value={formData.url} onChange={handleChange} />
          </label>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default Create
