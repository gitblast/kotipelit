# kotipelit.com-backend

Express + MongoDB + SocketIO backend for [kotipelit.com](https://github.com/gitblast/kotipelit.com). Written in Typescript.

## Scripts:

### `yarn start`

Start the app in production mode using production database.

### `yarn dev`

Start the app in development mode using production database. Hot reloading enabled.

### `yarn lint`

Run eslint.

### `yarn test`

Run all tests.

### `yarn tsc`

Run Typescript compiler.

## Environment variables:

The app requires a .env -file with the following fields defined:

- PORT
- MONGODB_URI
- TEST_MONGODB_URI
- SECRET
- ADMIN_SECRET

## Routes:

### `/api/login`

- POST - handle user login

### `/api/users`

- GET - get all hosts
- POST (admin token required) - add host

### `/api/games` (host token required)

- GET / - get all games by host identified from token
- POST / - add game
- DELETE /:id - delete game matching id
- POST /:id - modify game **TODO**

## Database:

The app uses a mongoDB database with two collections, users and games.

### User:

```
{
  username: String (must be unique)
  email: String (must be unique)
  passwordHash: String
  channelName: String
  joinDate: String
}
```

### Game:

```
{
  type: String
  startTime: Date
  players: Array
  status: String
  host: mongoose.Types.ObjectId // id of the adder
  createDate: Date
  rounds: Number (optional)
}
```

## Todo:

Handle socketIO, finish routes.
