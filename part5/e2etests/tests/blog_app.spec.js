const { test, expect, beforeEach, describe } = require(`@playwright/test`)
const { loginWith, createBlog } = require('./helper')

describe('Blog App', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'adit',
        name: 'Adit',
        password: 'abcd'
      }
    })

    await page.goto('/')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'adit', 'abcd')
      await expect(page.getByRole('button', {name: 'logout'})).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'adit', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })

    describe('when logged in', () => {
      beforeEach(async ({page}) => {
        await loginWith(page, 'adit', 'abcd')
      })

      test('a new blog can be created', async ({page}) => {
        await createBlog(page, 'Testing', 'secret', 'http://example.com')
    
        await expect(page.getByText('Testing By secret')).toBeVisible()
      })

      test('a blog can be liked', async ({page}) => {
        await createBlog(page, 'Testing', 'secret', 'http://example.com')
        page.getByText('Testing by secret').click()
        
        await page.getByRole('button', {name: 'like'}).click()
        
        await expect(page.locator('span')).toContainText('likes 1')
      })

      test('user who added the blog can delete the blog', async ({page}) => {
        await createBlog(page, 'Testing', 'secret', 'http://example.com')
        await page.getByText('Testing by secret').click()
        
        page.once('dialog', async dialog => {
          await dialog.accept()
        })

        await page.getByRole('button', {name: 'remove'}).click()

        await expect(page.getByText('Testing by secret')).not.toBeVisible()
      })

    })
  })
})