# Store

## Goal
To create a Full-Stack MERN app to demonstrate CRUD functionality and competence of various technologies

## Technologies Used:
- React w/ Material UI
- Express.js
- Node.js
- mongoDB with Mongoose
- Faker
- Axios

## Installing the App Locally
Requirements: *You will need Node.js and mongo installed on your computer.*

1. Navigate to the directory where you would like to download the demo files and run:
 `git clone git@github.com:v-tank/Store.git`
2. `yarn install` in the root directory of the cloned repo
3. `cd client && yarn install`
4. Create a local mongoDB database called `products`.
5. Navigate back up to the root directory and run `yarn start` to start the server and to run the React app. You will need to have `mongod` running in another terminal window.
6. Using Postman or any other API Dev Environment, hit the following `GET` route to seed your local database: `http://localhost:3001/api/product/seed`
7. Refresh the front-end to populate the table.
8. Enjoy!

## Skills Utilized
- REST API creation and consumption for CRUD functionality
- MVC architecture
- React with Material-UI, JS, CSS
- MongoDB
  - Indexing for faster queries
- Express / Node server
- Git

## Current functionality
- From the UI, you can add an item to the cart. Check out the name of the product added to the cart by using the console. Haven't had time to implement a better UI/UX yet.
