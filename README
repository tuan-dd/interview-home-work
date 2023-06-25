## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

<h3 align="left">Languages and Tools:</h3>
<p align="left"> <a href="https://expressjs.com" target="_blank" rel="noreferrer" > <img src="https://wiki.tino.org/wp-content/uploads/2021/07/word-image-1150-768x432.png" alt="express" width="60" height="60"/> </a> <a href="https://git-scm.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" alt="git" width="60" height="60"/> </a> <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="60" height="60"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="60" height="60"/> </a> <a href="https://www.mongodb.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" width="60" height="60"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="60" height="60"/> </a> <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="60" height="60"/> </a> <a href="https://redis.io" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg" alt="redis" width="60" height="60"/> </a> <a href="https://redux.js.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg" alt="redux" width="60" height="60"/> </a> <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="60" height="60"/> </a>

<br>
<br>

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm or yarn
  ```sh
  npm install
  ```
  yarn install
  ```
  yarn run dev
  ```

### Database

You can you .env.example to connect database

**Example account:**
<br>
email: tuanprodd@gamil.com
pass: tuan123
<br>
email: tuandd.310797@gamil.com
pass: tuan123

### Authentication

- [x] Registering for a new account with name, email, and password, gmail
- [x] Signing in with my email and password.
- [x] AccessToken vs refreshToken
- [ ] 2fa auth

### Post

- [x] create Post
- [x] Edit post, delete post
- [x] Query by content , tag , createdAt, title

### Create Comment

- [x] create comment or reply comment
- [x] Edit comment, delete comment

## Endpoint APIs

### Base url: http://localhost:5000/v1/api/...

### Auth

Go to **schemas/auth.schema.ts** see data need in request

`POST auth/sign-in` all can login

`POST auth/sign-up` all can login

`POST auth/new-access-token` **Login required** get new AccessToken

`POST auth/sign-out` **Login required** sign out

### Post

`POST post/create` **Login required** create a post

`PUT post/update/:id` **Login required** post can update or delete

`GET post/user` **Login required** get posts by author

`GET post/` get posts by query

### comment

`POST comment/create` **Login required** create a comment or reply

`PUT comment/update/:id` **Login required** comment can update or delete

`GET comment/user` **Login required** get comments by author

`GET comment/` get comments pr replies by post
