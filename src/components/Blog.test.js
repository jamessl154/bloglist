/**
 * @jest-environment jsdom
 */

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

import Blog from './Blog'

describe('On first render,', () => {

  test('Blog component renders a blog`s title and author,' +
  ' but not url or likes by default', () => {

    const blog = {
      title: 'testTitle',
      author: 'testAuthor',
      url: 'testUrl',
      likes: 10
    }

    const component = render(
      <Router>
        <Blog exact path="/blogs" blog={blog} />
      </Router>
    )

    const foundBlog = component.container.querySelector('.blog')

    expect(foundBlog).toHaveTextContent('testTitle')
    expect(foundBlog).toHaveTextContent('testAuthor')
    expect(foundBlog).not.toHaveTextContent('testUrl')
    expect(foundBlog).not.toHaveTextContent('Likes')
  })
})

describe('When expand button is clicked for a blog,', () => {
  let component
  let mockLikes = jest.fn()

  beforeEach(() => {

    const blog = {
      title: 'testTitle',
      author: 'testAuthor',
      url: 'testUrl',
      likes: 10,
      user: {
        username: 'testUsername'
      }
    }

    const user = {
      username: 'testUsername'
    }

    component = render(
      <Router>
        <Blog blog={blog} user={user} handleLike={mockLikes}/>
      </Router>
    )

    const viewButton = component.getByText('+')
    fireEvent.click(viewButton)
  })

  test('the blog expands', () => {
    expect(component.container.querySelector('.expandedBlog')).toBeDefined()
  })

  test('If the like button is clicked twice, the event handler from' +
  ' its props is called twice', () => {

    const likeButton = component.getByTestId('likeButton')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockLikes.mock.calls).toHaveLength(2)
  })
})

