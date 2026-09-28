import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: "Prince",
  author: "William",
  likes: 0,
  url: 'https://jeiwuji',
  user: {
    name: "Adit",
    username: "adit"
  }
}

test("renders blog details without buttons for unauthenticated users", () => {
  const handleUpdate = vi.fn()
  const handleDelete = vi.fn()

  const { container } = render(<Blog user={null} blog={blog} handleDelete={handleDelete} handleUpdate={handleUpdate}/>)

  const div = container.querySelector('.blogDetail')
  expect(div).toHaveTextContent(`${blog.title} by ${blog.author}`)
  expect(div).toHaveTextContent(`${blog.url}`)
  expect(div).toHaveTextContent(`likes ${blog.likes}`)

  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test("shows only the like button for non-owner users", async () => {
  const user = {
    name: "Adam",
    username: "adam"
  }
  const handleUpdate = vi.fn()
  const handleDelete = vi.fn()
  const { container } = render(<Blog user={user} blog={blog} handleDelete={handleDelete} handleUpdate={handleUpdate}/>)

  const div = container.querySelector('.blogDetail')
  expect(div).toHaveTextContent(`${blog.title} by ${blog.author}`)
  expect(div).toHaveTextContent(`${blog.url}`)
  expect(div).toHaveTextContent(`likes ${blog.likes}`)
  expect(div).toHaveTextContent('like')

  expect(div).not.toHaveTextContent('remove')
})

test("The blog's creator is also shown the delete button", async () => {
  const user = {
    name: "Adit",
    username: "adit"
  }
  const handleUpdate = vi.fn()
  const handleDelete = vi.fn()
  const { container } = render(<Blog user={user} blog={blog} handleDelete={handleDelete} handleUpdate={handleUpdate}/>)

  const div = container.querySelector('.blogDetail')
  expect(div).toHaveTextContent(`${blog.title} by ${blog.author}`)
  expect(div).toHaveTextContent(`${blog.url}`)
  expect(div).toHaveTextContent(`likes ${blog.likes}`)
  expect(div).toHaveTextContent('like')
  expect(div).toHaveTextContent('remove')
})