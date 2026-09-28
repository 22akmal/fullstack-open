import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import blogService from '../services/blogs'
import loginService from '../services/login'

const Login = ({ notification, handleUser, handleMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event, username, password) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      navigate('/')
      handleUser(user)
      setPassword('')
      setUsername('')
    } catch {
      handleMessage({message: 'wrong username or password', type: 'error'})
      setTimeout(() => {
        handleMessage({message: null, type: 'success'})
      }, 5000)
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={(event) => handleLogin(event, username, password)}>
        <div>
          <TextField label="username" variant='standard' type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          <TextField label="password" variant='standard' type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <Button variant='contained' style={{marginTop: 10}} type='submit'>login</Button>
      </form>
    </div>
  )
}

export default Login