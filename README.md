# Kotipelit

![Github Actions](https://github.com/gitblast/kotipelit/actions/workflows/build.yml/badge.svg)
![Github Actions](https://github.com/gitblast/kotipelit/actions/workflows/deployment.yml/badge.svg)

Backend and frontend projects for http://kotipelit-demo.herokuapp.com/ (previously www.kotipelit.com) as a monorepo.

Kotipelit.com was (project is dead now) a site where anyone can register to become a game show host. The host can create games, where anyone can join. The only game that was finished was Kotitonni, a modified version of the popular game show Kymppitonni. The game is played via a custom made WebRTC conference call with integrated game logic in the browser. A promotional video for the game can be found from the front page, it might give a better idea of what is going on.

## Tech stack

Backend tech stack includes:
  * Typescript
  * Node
  * Express
  * SocketIO
  * MongoDB
  * Twilio

Frontend tech stack includes:
  * Typescript
  * React
  * Twilio
  * MaterialUI
  * i18next
  * Twilio

GitHub actions were used for running tests, building and deploying.

## Main features of the site

### Lobby system

Hosts can create a game in their dashboard, and a lobby for the game is automatically generated to a custom url. Players can reserve a slot in the game, the 5 fastest reservers are allowed in. The lobby will send the game info to the provided email address. A custom url is generated for each player in the game, so they can join securely without registering.

### The game itself

Players join the game with the custom link they recieve when reserving their spot. Twilio programmable video was used to power the custom conference call.

After the game starts, the players will take turns to give hints, while others try to guess the word in question. Different amounts of points are awarded depending on the amount of correct answers. The view is different for the host and for the players. Host has the controls to award points, mark correct answers, start the timer, and move back or forth in the game state (to fix possible misclicks in points etc). Players can only see their game info and have an answer bar that is activated when the host starts the answer timer.

The game view includes various little details, such as the host can mute anyone in the call, anyone can turn off their camera / mic, audio cues when an important event happens in the game, Kotipelit-TV which allows spectators to view the game, and so on.

### Other

Other features include language support for Finnish and English with i18next, a preview window for checking your camera and mic before joining the game, a register form that enforces secure passwords and auto checks for collisions in username, etc.


## Hours spent

My hour tracking can be found here:

https://docs.google.com/spreadsheets/d/1oTN5Q3nYzqt61-Szs9Cw7vVkBln2ImFNF7QZfbs1yqg/edit?usp=sharing

I started tracking my hours late, but I still have over 500 documented hours of work on the project. The real amount must be somewhere around 700-800 hours.

## Collaborators

I (Jarkko Mämmelä) did 100% of the backend, >95% of the frontend and everything related to CI/CD. The "client", who is a friend of mine, did some css styling for the frontend.
