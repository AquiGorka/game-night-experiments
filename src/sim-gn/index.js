import queryString from 'query-string'

const parsed = queryString.parse(location.search)
const gameNightId = parsed.id || 'gn-sim'
const numPlayers = parseInt(parsed.n, 10) || 3
const gncs = []

// Tournament
import Tournament from '../lib/tournament'

const tournament = new Tournament('gnt')
tournament.on('match', match => {
  console.log(`Next match: ${match.participant1.player.name} vs ${match.participant2.player.name}`)
  setTimeout(() => {
    const rand = Math.round(Math.random())
    const winner = rand ? match.participant1 : match.participant2
    match.end(winner.player.id)
    console.log(`Match has ended, the winner is: ${winner.player.name} (points: ${winner.points})`)
    if (tournament.matches < 50) {
      tournament.nextMatch()
    } else {
      endTournament()
    }
  }, 10)
})

const startTournament = () => {
  console.log('Tournament has started')
  // all join
  gncs.forEach(c => tournament.join(c.player))
  tournament.start()
}

const endTournament= () => {
  console.log('Tournament has ended')
  tournament.end()
  const winner = tournament.leaderboard[0]
  console.log(`The winner is: ${winner.player.name} with ${winner.points} points`)
  console.log('Final leaderboard:')
  console.table(tournament.leaderboard.map(participant => { return { name: participant.player.name, points: participant.points }}))
}

// Players
import GameNightClient from '../lib/game-night-client'

for (var i = 0; i < numPlayers; i++) {
  const num = i + 1
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
        startTournament()
      }
    })
  })
})()


// Game Night!
import GameNight from '../lib/game-night'

const gn = new GameNight(gameNightId)
gn.on('start', id => {
  console.log('Game night has started! Id: ', id)
  gncs.forEach(gnc => gnc.join(id))
})
//gn.on('join', playerId => console.log('A player has joined', playerId))
