# Kotipelit.com

## Description

A site for remote games. Backend for the project can be found [here](https://github.com/gitblast/kotipelit.com-backend).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

## About jitsi

Embedded jitsi needs to be provided a valid JWT -token in order to create a new room. The creator will be granted moderator privileges. Once created, guests can join the room without authenticating (no token needed).

### Token schema:

#### Headers:

```
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### Payload:

```
{
  "context": { // info about the user, only name -field is required
    name: "John Doe", // name that will be shown to other participants
    avatar: "https://url.to.avatar",
    id: "123456",
    email: "email@johndoe.com"
  },
  "aud": kotipelit.com,
  "iss": kotipelit.com,
  "sub": meet.kotipelit.com,
  "room": <roomname>, // token will only be valid with roomname provided here
  "iat": <issued at>, // token issue time, optional
  "exp": <expires> // token expire time, optional
}
```

#### Verification:

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  <app_secret> // app secret set in prosody configuration
)
```

Example tokens for development purposes can be created at www.jwt.io.
