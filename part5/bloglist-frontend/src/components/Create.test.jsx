import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Create from './Create'
import { expect } from 'vitest'

test("the form calls handler it received with the right details", async () => {
  const newBlog = {
    title: "Prince",
    author: "William",
    url: 'https://jeiwuji'
  }
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<Create onCreate={createBlog}/>)
  
  const inputTitle = screen.getByLabelText('title:')
  const inputAuthor = screen.getByLabelText('author:')
  const inputUrl = screen.getByLabelText('url:')
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, `${newBlog.title}`)
  await user.type(inputAuthor, `${newBlog.author}`)
  await user.type(inputUrl, `${newBlog.url}`)
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe(`${newBlog.title}`)
  expect(createBlog.mock.calls[0][0].author).toBe(`${newBlog.author}`)
  expect(createBlog.mock.calls[0][0].url).toBe(`${newBlog.url}`)
})