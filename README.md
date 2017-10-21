# Game Night Experiments

This library provides an abstraction on top of games. This abstraction can be used to host game night events. A host sets up an event and people join in using their smartphones. Game Night needs at least two players to start.

Once the required players have joined a tournament can start. The tournament consists of matches between two players. The player that wins the match will stay and the next person (if there is one) in the list will play against them and so on, until game night ends.

The tournament showcases a leaderboard. Each time a participant wins a match they will receive one point.

The library is ready to skip matches or skip players in a match in case it is needed (connectivity issues?) and can handle reconnections (it is not expected that the guests keep their phone unlocked even while they're not playing).


## Dev

```sh
npm start
```

Open up a browser to http://localhost:3000. The url accepts a parameter (`/room`) to define the _room_ where Game Night will be hosted (this is used to namespace game nights - defaults to `gn`).


## Run GN Clients Simulation

If you need peers to connect to game night.

```sh
npm run sim-app-gn
```

Open up a browser to http://localhost:9966 and look into the development console. The url accepts parameters to set the _room_ where game night is being hosted (`?gid=XXX`), to set the number of players to connect (`?n=XXX`) and the offset (`?o=XXX`) - when players connect they send their unique ids, thus the offset is used to connect players that have not connected before.


## Run Simulation

This will be integrated into tests.

```sh
npm run sim-gn
```

Open up a browser to http://localhost:9966 and look into the development console. The url accepts parameters to set the _room_ where game night is being hosted (`?gid=XXX`) and to set the number of players to run the simulation with (`?n=XXX`).



