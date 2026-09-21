import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notif from './components/Notif'
import loginService from './services/login'
import Create from './components/Create'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [Message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogService.getAll()
        setBlogs(response)
      } catch (error) {
        console.error(error)
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const userLoginJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (userLoginJSON) {
      const userData = JSON.parse(userLoginJSON)
      setUser(userData)
      blogService.setToken(userData.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setPassword('')
      setUsername('')
    } catch {
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const handleCreate = async (data) => {
    try {
      const newBlog = await blogService.create(data)
      setMessage(`a new blog ${data.title} by ${user.name} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setBlogs(blogService.sortBlog(blogs.concat(newBlog)))
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdate = async (blogId) => {
    const updatingBlog = blogs.find(blog => blog.id === blogId)
    try {
      await blogService.update(updatingBlog)
      const updatedBlogs = blogs.map(blog => blog.id === blogId ? { ...blog, likes: blog.likes + 1 } : blog)
      setBlogs(blogService.sortBlog(updatedBlogs))
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (blogId, title, author) => {
    try {
      if (window.confirm(`remove blog ${title} by ${author}`)) {
        await blogService.deleteBlog(blogId)
        const updatedBlogs = blogs.filter(blog => blog.id !== blogId)
        setBlogs(blogService.sortBlog(updatedBlogs))
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (user === null) {
    return (<div>
      <h2>Log in to application</h2>
      <Notif message={Message} type='loginError' />
      <form onSubmit={handleLogin}>
        <div>
          <label>Username
            <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
          </label>
        </div>
        <div>
          <label>Password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notif message={Message} type='addingBlog' />
      <div className='userLoggedIn'>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <h2>Create New</h2>
      <Togglable buttonLable='create new blog'>
        <Create onCreate={handleCreate} />
      </Togglable>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} handleUpdate={handleUpdate} handleDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}

export default App