## Bloglist
https://fullstackopen.com/en/part11

![bloglist](https://github.com/jamessl154/bloglist/actions/workflows/ci_cd.yml/badge.svg)

This project is the final exercise from part [11](https://github.com/jamessl154/full-stack-open-pokedex) to develop a single repository application with a CI/CD-pipeline. The workflow is found in `.github/workflows/ci_cd.yml`. It transfers repository secrets into a ```.env``` file, installs dependencies, lints the code, tests the code with Jest and Cypress, builds the frontend using Webpack, deploys to Heroku and bumps the version.

---

Live app: https://shrouded-castle-00646.herokuapp.com/

Backend: https://github.com/jamessl154/fullstackopen/tree/main/part4/

Frontend: https://github.com/jamessl154/fullstackopen/tree/main/part5/

---

The frontend is built with React and Redux. It is contained within the ```src/``` directory. The app's main purpose is for sharing and reviewing blogs. I styled it using [Material UI](https://mui.com/). I customised the Webpack configuration, found in ```webpack.config.js```, to bundle the frontend into ```dist/``` with the command `npm run build`. When the app is running, ```dist/``` is served as a static asset by the Express server in `app.js`. I also configured [route-based code splitting](https://reactjs.org/docs/code-splitting.html#route-based-code-splitting), which is a combination of dynamic `import()` statements, `React.Lazy` and `Suspense` components. This should reduce the initial load time. Also, it should reduce unwanted resources consumed by the client/sent by the server because resources are only sent on demand now. I tested the ```Suspense``` fallback content by throttling the network using Chrome DevTools. I then styled the fallback content to copy the main container theme present throughout the app. This should improve the user experience by reducing flickering that occurs when chunks are fetched.

The backend is located in `app.js`, it is a RESTful API built in Express that interacts with a MongoDB server using Mongoose. The endpoints are contained in the ```controllers/``` directory, here is a summary:

---
  - /api/blogs
    * /
      - __GET__ - Returns a list of all blogs from the database.
      - __POST__ - Adds blog to the database (requires a valid token in the authorization header).
    ---
    * /:id
      - __DELETE__ - Removes the blog with this ID from the database (requires authorization).

      - __PUT__ - Updates the blog with this ID with the request.body. Used in the frontend for incrementing a record of likes of blogs.
    ---
    * /:id/comments
      - __POST__ - Adds comments from the request.body to the comments array of the blog with this ID.
    ---

  - /api/login
    * /
      - __POST__ - Requires username and password properties in the request.body. Uses bcrypt to compare the password hash of the username, both stored in the database, against the password sent in the request. Signs a token using JWT and returns it if the passwords match.
    ---
  - /api/users
    * /
      - __GET__ - Returns a list of all the users in the database.
      - __POST__ - Checks for duplicate users and password strength, then registers the new user by hashing the password and storing with the username. Finally, returning a signed token so the user does not have to log in once registered.
    ---
  - /api/testing
    * /reset
      - __POST__ - Deletes all users and blogs from the testing database specified by the test URI in the .env file

  - /health

    - __GET__ 
      - This route is used by the GitHub Action [Heroku-Deploy](https://github.com/marketplace/actions/deploy-to-heroku#health-check) during the workflow ```.github/workflows/ci_cd.yml```. The action sends a GET request to this endpoint and expects the string 'Healthy!' in response. If the Heroku app crashes or fails to deploy, this endpoint will respond with a 4xx status code which causes the workflow to fail. Additionally, this will roll back the app version as we are using the custom option ```rollbackonhealthcheckfailed: true```.

---
## How to run locally

1. clone the repository
2. run `npm install`

3. create ```.env``` file at the root of the repository
- ### ```.env``` must include the environment variables:
  - **MONGODB_URI**: The URI of your MongoDB database used in production and development
  - **SECRET**: Your key for signing tokens with JWT
  - **PORT**: Sets the port for the app to run on

- ### Optionally include:

  - **MONGODB_TEST_URI**: The URI of your MongoDB database for testing. Used when running tests with `npm run test`

4. run `npm run build`
5. run `npm start`
---
See package.json for specific commands and full dependency list
