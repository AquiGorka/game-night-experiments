# Game Night Multiplayer Tetris

- Only one game? Pacman? Any games out there with NSA?

## Dev

```sh
```

## Run Simulation

```sh
npm run sim-gn
```

## Game Night

```javascript
const gn = new GameNight()
gn.on('start', id => { /* game night has officially started now we accept players */ })
gn.id
gn.on('join', playerInstance => { /* new player joined */ })
gn.players
gn.remove(playerId)
gn.bench(playerId)
gn.end()

player.on('disconnect', () => { /* player is not connected */ })
player.on('connect', () => { /* player is connected */ })
```

Accepts all incoming players at any given time. Knows how to differentiate players so if they disconect and reconnect it is invisible.
Can remove players (in case they leave before game night ends).
Can set players as inactive (maybe they are preparing drinks/dinner and you simply want to skip over them but not remove them).


## Tournament

```javascript
const tournament = new Tournament()
tournament.leaderboard
tournament.currentMatch
tournament.on('matchEnd', () => { /* next match awards point to winner */ })
tournament.on('matchSkip', () => { /* next match no point awarded */ })
```

Receives N players when they join and sets up the matches between them in a last player that won stays.
When a match ends it will award 1 point to the winner.


## Match

```javascript
const match = new Match({})
match.end(playerId)
match.skip()

const game1 = new Game(player1)
const game2 = new Game(player2)

game1.start()
game2.start()
```

Rules:

- If a player gets disconnected the game pauses.

## Game

```javascript
```

Multiplayer Tetris: 2 players at a time face off in survival mode tetris (last person standing wins).
It'll receive a callback to execute when the game ends.

## Game Night Client

```javascript
```

Logs in.
Joins a game night.
When it is the player's turn to play, well, the player plays (sends commands to the game in order to survive).

