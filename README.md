# Bloglist

This project is an exercise from fullstackopen to develop a single repository application with a CI/CD-pipeline using a previously made application. The backend is a RESTful API in Express with these endpoints:
```
  /api/blogs
    /
      GET - Returns a list of all blogs from the database

      POST - Adds blog to the database (requires a valid token in the authorization header)

    /:id
      DELETE - Removes this blog from the database (requires token in authorization header)

      PUT - Updates this blog in the database with the request.body. Used in the frontend
            for incrementing like counter of blogs

    /:id/comments
      POST - Checks the request.body for a comment property and adds it to the blog with 
              this id in the database

  /api/login
    /
      POST - Requires username and password properties in the request.body. Uses bcrypt to
              compare the password hash of the username, both stored in the database, 
              against the password sent in the request. If the tokens match, signs a token
              using JWT and returns it

  /api/users
    /
      GET - Returns a list of all the users in the database

      POST - Registers a new user,

  /api/testing
    /reset
      POST - Deletes all users and blogs from the testing database specified by
      the test URI in the .env file

  /health

    The Health Check route used with the GitHub Action heroku-deploy. The action will
    send a GET request to this endpoint and expect the string 'Healthy!' in the response.
    If the Heroku app crashes or fails to deploy this endpoint will respond with 404 which
    triggers a failed workflow and the app will be rolled back as we are using 
    rollbackonhealthcheckfailed as a custom option.

```
The frontend is built with React and Redux. It is contained within the src/ directory. Webpack bundles the frontend into dist/ with the command `npm run build`. When the app is running, dist/ is served as a static asset by the Express server in app.js. The current Webpack configuration uses route-based code splitting that is recommended [here](https://reactjs.org/docs/code-splitting.html#route-based-code-splitting), which is a combination of dynamic `import()` statements, `React.Lazy` and `Suspense` components. This should reduce the initial load time. Also, it should reduce unwanted resources consumed by the client/sent by the server because now they are only sent on demand. I tested the Suspense fallback content by throttling the network using Chrome DevTools. I then styled the fallback content to copy the main container theme present throughout the app. This should improve the user experience by reducing flickering that occurs when chunks are fetched. Lastly, in the workflow `.github/workflows/ci_cd.yml`, repository secrets and URLs need to be configured if you want to use it for yourself.

Live app: https://shrouded-castle-00646.herokuapp.com/

Backend: https://github.com/jamessl154/fullstackopen/tree/main/part4/bloglist

Frontend: https://github.com/jamessl154/fullstackopen/tree/main/part5/bloglist-frontend

Fullstackopen: https://fullstackopen.com/en/

## How to run locally

1. clone repository
2. run `npm install`

3. create .env file at the root of the repository
### .env Must include:
---
```
  MONGODB_URI: The URI of your MongoDB database used in production and development
  SECRET: Your key for signing tokens with JWT
  PORT: Set the port for the app to run on
```
### Optional:
---
```
  MONGODB_TEST_URI: The URI of your MongoDB database for testing. Used when running tests
  with `npm run test`
```

4. run `npm run build`
5. run `npm start`
---
See package.json for specific commands and full dependency list
