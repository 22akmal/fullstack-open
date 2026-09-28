import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import BlogBody from './components/BlogBody'
import blogService from './services/blogs'
import Login from './components/Login'
import Blog from './components/Blog'
import Create from './components/Create'
import Notif from './components/Notif'


const App = () => {
  const [notification, setNotification] = useState({message: null, type: 'success'})
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const navigate = useNavigate()

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

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const handleCreate = async (data) => {
    try {
      const newBlog = await blogService.create(data)
      setNotification({message: `a new blog ${data.title} by ${user.name} added`, type: 'success'})
      setTimeout(() => {
        setNotification({message: null, type: 'success'})
      }, 5000)
      setBlogs(blogService.sortBlog(blogs.concat(newBlog)))
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (blogId, title, author) => {
    try {
      if (window.confirm(`remove blog ${title} by ${author}`)) {
        await blogService.deleteBlog(blogId)
        const updatedBlogs = blogs.filter(blog => blog.id !== blogId)
        navigate('/')
        setBlogs(blogService.sortBlog(updatedBlogs))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const handleUpdate = async (blogId) => {
    const updatingBlog = blog
    try {
      await blogService.update(updatingBlog)
      const updatedBlogs = blogs.map(blog => blog.id === blogId ? { ...blog, likes: blog.likes + 1 } : blog)
      setBlogs(blogService.sortBlog(updatedBlogs))
    } catch (error) {
      console.error(error)
    }
  }

  const padding = { padding: 5 }

  return (
    <Container>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' component='div' sx={{flexGrow:1}}>
              Blog App
            </Typography>
            <Button color='inherit' component={Link} to='/'>blogs</Button>
            {user && <Button color='inherit' component={Link} to='/create'>new blog</Button>}
            {!user ? <Button color='inherit' component={Link} to='/login'>login</Button> : <Button color='inherit' onClick={handleLogout}>logout</Button>}
          </Toolbar>
        </AppBar>

        <Notif notification={notification}/>

        <Routes>
          <Route path='/blogs/:id' element={
            <Blog
              user={user}
              blog={blog}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
            />
          } />

          <Route path='/' element={
            <BlogBody
              blogs={blogs}
            />
          } />

          <Route path='/login' element={
            <Login
              notification={notification}
              handleMessage={setNotification}
              handleUser={setUser}
            />
          } />

          <Route path='/create' element={
            <Create onCreate={handleCreate} />
          } />
        </Routes>
    </Container>
  )
}

export default App