import queryString from 'query-string'

const parsed = queryString.parse(location.search)
const gid = parsed.gid || 'gn'
const numPlayers = parseInt(parsed.n, 10) || 3
const offset = parseInt(parsed.o, 10) || 0
const gncs = []

// Players
import GameNightClient from '../lib/game-night-client'

for (var i = 0; i < numPlayers; i++) {
  const num = i + offset + 1
  const newGNC = new GameNightClient(`player-${num}`)
  newGNC.login({ name: `Player ${num}`, avatar: 'https://randomuser.me/api/portraits/med/men/7.jpg' })
  gncs.push(newGNC)
}

// kis
(function() {
  let counter = 0
  gncs.forEach(gnc => {
    gnc.on('join', () => {
      counter++
      if (counter === numPlayers) {
        console.log('All players have joined')
      }
    })
  })
})()

// join gn
gncs.forEach(gnc => gnc.join(gid))
