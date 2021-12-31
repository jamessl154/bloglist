// https://docs.cypress.io/guides/references/best-practices#Setting-a-global-baseUrl
// https://docs.cypress.io/guides/references/best-practices#Organizing-Tests-Logging-In-Controlling-State
describe('On visit to the blog app,', function() {

    beforeEach(function() {
      // reset the DB
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      cy.visit('http://localhost:3003')
    })
  
    it('the login form is shown', function() {
      cy.contains('Login').click()
      cy.get('[data-cy=loginForm]').contains('Login')
    })
  
    // https://docs.cypress.io/guides/getting-started/testing-your-app#Fully-test-the-login-flow-but-only-once
    describe('When logging in,', function() {
  
      beforeEach(function() {
        // create user, bypass UI because we currently have no UI to register new users
        // test manual login flow once here
        const user = {
          name: 'Matti Luukkainen',
          username: 'mluukkai',
          password: 'S1!lainen'
        }
  
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.contains('Login').click()
      })
  
      it('succeeds with correct credentials', function() {
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('S1!lainen')
        cy.get('[data-cy=loginButton]').click()
        cy.get('.MuiAlert-message').contains('mluukkai logged in successfully!')
      })
  
      it('fails with wrong credentials', function() {
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('wrong password')
        cy.get('[data-cy=loginButton]').click()
        cy.get('.MuiAlert-message').contains('Wrong username or password.')
      })
  
      describe('When logged in as mluukkai,', function() {
        beforeEach(function() {
          // log in user
          cy.login({ username: 'mluukkai', password: 'S1!lainen' })
        })
  
        it('A blog can be created', function() {
  
          const blog = {
            title: 'cypressTestTitle',
            author: 'cypressTestAuthor',
            url: 'cypressTestUrl'
          }
  
          cy.createBlog(blog)
          cy.get('.blogGrid')
            .contains('cypressTestTitle')
            .contains('cypressTestAuthor')
        })
  
        describe('When mluukkai creates a blog and expands it,', function() {
          beforeEach(function() {
            const blog = {
              title: 'cypressTestTitle',
              author: 'cypressTestAuthor',
              url: 'cypressTestUrl'
            }
            cy.createBlog(blog)
            cy.contains('+').click()
          })
  
          it('clicking the like button increments total likes by 1', function() {
            cy.get('[data-cy=likeButton]').click()
            cy.get('.blog').contains('Total Likes: 1')
          })
  
          it('mluukkai has the option to remove the blog', function() {
            cy.get('[data-cy=removeButton]').contains('Remove')
          })
  
          it('deletion succeeds', function() {
            cy.get('[data-cy=removeButton]').click()
            // https://stackoverflow.com/a/60862270
            cy.on('window:confirm', () => true)
            cy.get('.blogGrid')
              .should('not.contain', 'cypressTestTitle')
              .should('not.contain', 'cypressTestAuthor')
          })
  
          describe('When logged in as boot,', function() {
            beforeEach(function() {
              const user = {
                name: 'Bradley Oot',
                username: 'boot',
                password: 'S1!lainen'
              }
  
              cy.request('POST', 'http://localhost:3003/api/users/', user)
              cy.login({ username: 'boot', password: 'S1!lainen' })
            })
  
            describe('When boot expands a blog added by mluukkai,', function() {
  
              beforeEach(function() {
                cy.contains('+').click()
              })
              it('he has no option to remove it', function() {
                cy.get('[data-cy=removeButton]').should('not.exist')
              })
            })
          })
        })
      })
    })
  })
  
  describe('When adding likes to blogs,', function() {
    beforeEach(function() {
      // reset the DB
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      const user = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'S1!lainen'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
      cy.login({ username: 'mluukkai', password: 'S1!lainen' })
  
      const blog1 = {
        title: 'cypressTestTitle',
        author: 'cypressTestAuthor',
        url: 'cypressTestUrl'
      }
  
      const blog2 = {
        title: 'sardiniaTestTitle',
        author: 'sardiniaTestAuthor',
        url: 'sardiniaTestUrl'
      }
  
      cy.createBlog(blog1)
      cy.createBlog(blog2)
      cy.contains('+').click()
      // first view disappears
      cy.contains('+').click()
    })
  
    it('blogs are re-sorted by number of likes', function() {
  
      // getting the first element with .blog class on the page
      cy.get('.blog:first')
        .contains('cypressTestTitle')
      cy.get('.blog:first')
        .contains('Total Likes: 0')
  
      // sardinia blog is initially underneath cypress blog
  
      // add like to sardinia blog, expect it to now be on top
      cy.get('[data-cy=sardiniaTestTitle]').find('[data-cy=likeButton]').click()
      // wait 1 second after clicks
      cy.wait(100)
      cy.get('.blog:first')
        .contains('sardiniaTestTitle')
      cy.get('.blog:first')
        .contains('Total Likes: 1')
  
      // After liking the cypress blog twice, it goes on top again
      // which confirms that blogs are being re-sorted by most number of likes
      cy.get('[data-cy=cypressTestTitle]').find('[data-cy=likeButton]').click()
      cy.wait(100)
      // blogs with the same likes are not re-sorted
      cy.get('.blog:first')
        .contains('sardiniaTestTitle')
      cy.get('.blog:first')
        .contains('Total Likes: 1')
      cy.get('[data-cy=cypressTestTitle]').find('[data-cy=likeButton]').click()
      cy.wait(100)
      // cypress has 2 likes and sardinia has 1, cypress is on top
      cy.get('.blog:first')
        .contains('cypressTestTitle')
      cy.get('.blog:first')
        .contains('Total Likes: 2')
    })
  })
  
  // https://docs.cypress.io/api/cypress-api/custom-commands#Syntax
  
  Cypress.Commands.add('login', ({ username, password }) => {
  
    cy.request('POST', 'http://localhost:3003/api/login', {
      username, password
    }).then(({ body }) => {
      localStorage.setItem('loggedInBloglistUser', JSON.stringify(body))
    })
  
    cy.visit('http://localhost:3003')
  })
  
  Cypress.Commands.add('createBlog', (blog) => {
  
    cy.request({
      url: 'http://localhost:3003/api/blogs',
      method: 'POST',
      body: blog,
      headers: {
        'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInBloglistUser')).token}`
      }
    })
  
    cy.visit('http://localhost:3003')
  })