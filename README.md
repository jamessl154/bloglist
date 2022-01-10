# Bloglist
![example workflow](https://github.com/jamessl154/bloglist/actions/workflows/ci_cd.yml/badge.svg)

This project is an exercise from fullstackopen to develop a single repository application with a CI/CD-pipeline using a previously made application. The backend is located in `app.js`, it is a RESTful API built in Express that interacts with a MongoDB server using the Object-Document Mapper Mongoose. The endpoints are contained in the controllers/ directory, here is a short summary:

---
  - /api/blogs
    * /
      - __GET__ - Returns a list of all blogs from the database.
      - __POST__ - Adds blog to the database (requires a valid token in the authorization header).
    ---
    * /:id
      - __DELETE__ - Removes this blog from the database (requires token in authorization header).

      - __PUT__ - Updates this blog in the database with the request.body. Used in the frontend for incrementing like counter of blogs.
    ---
    * /:id/comments
      - __POST__ - Checks the request.body for a comment property and adds it to the blog with this id in the database.
    ---

  - /api/login
    * /
      - __POST__ - Requires username and password properties in the request.body. Uses bcrypt to compare the password hash of the username, both stored in the database, against the password sent in the request. If the tokens match, signs a token using JWT and returns it.
    ---
  - /api/users
    * /
      - __GET__ - Returns a list of all the users in the database.
      - __POST__ - Checks for duplicate users and password strength, then registers the new user by hashing the password and storing with the username. Finally, returning a signed token so the user does not have to login once registered.
    ---
  - /api/testing
    * /reset
      - __POST__ - Deletes all users and blogs from the testing database specified by the test URI in the .env file

  - /health

    - __GET__ 
      - This route is used by the GitHub Action [Heroku-Deploy](https://github.com/marketplace/actions/deploy-to-heroku#health-check) during the workflow. The action will send a GET request to this endpoint and expect the string 'Healthy!' in the response. If the Heroku app crashes or fails to deploy this endpoint will respond with a 4xx status code which causes the workflow to fail. Additionally, this will roll back the app version as we are using the custom option ```rollbackonhealthcheckfailed: true```.

---
The frontend is built with React and Redux. It is contained within the src/ directory. Webpack bundles the frontend into dist/ with the command `npm run build`. When the app is running, dist/ is served as a static asset by the Express server in `app.js`.

The current Webpack configuration uses route-based code splitting that is recommended [here](https://reactjs.org/docs/code-splitting.html#route-based-code-splitting), which is a combination of dynamic `import()` statements, `React.Lazy` and `Suspense` components. This should reduce the initial load time. Also, it should reduce unwanted resources consumed by the client/sent by the server because now they are only sent on demand. I tested the ```Suspense``` fallback content by throttling the network using Chrome DevTools. I then styled the fallback content to copy the main container theme present throughout the app. This should improve the user experience by reducing flickering that occurs when chunks are fetched.

Lastly, in the workflow `.github/workflows/ci_cd.yml`, repository secrets and URLs need to be configured if you want to use it for yourself.

---

Live app: https://shrouded-castle-00646.herokuapp.com/

Backend: https://github.com/jamessl154/fullstackopen/tree/main/part4/bloglist

Frontend: https://github.com/jamessl154/fullstackopen/tree/main/part5/bloglist-frontend

Fullstackopen: https://fullstackopen.com/en/

---
## How to run locally

1. clone repository
2. run `npm install`

3. create .env file at the root of the repository
- ### .env Must include:
  - **MONGODB_URI**: The URI of your MongoDB database used in production and development
  - **SECRET**: Your key for signing tokens with JWT
  - **PORT**: Set the port for the app to run on

- ### Optionally include:

  - **MONGODB_TEST_URI**: The URI of your MongoDB database for testing. Used when running tests with `npm run test`

4. run `npm run build`
5. run `npm start`
---
See package.json for specific commands and full dependency list
