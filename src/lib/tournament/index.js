import EventEmitter from 'eventemitter3'

class Participant {
  constructor(player) {
    this.player = player
    this.reset()
  }

  // public
  win(points) {
    this.points += points
  }

  // private
  reset() {
    this.points = 0
  }
}

class Match extends EventEmitter {
  constructor({ participant1, participant2 }) {
    super()
    this.participant1 = participant1
    this.participant2 = participant2
  }

  // public
  end(playerId) {
    this.emit('end', playerId)
  }

  skip() {
    this.emit('skip')
  }

  playerSkip(playerId) {
    this.emit('player-skip', playerId)
  }
}

class Tournament extends EventEmitter {
  constructor(id = 'gnt') {
    super()
    this.id = id
    this.reset()
  }

  // public
  get leaderboard() {
    return this.participants
      .sort((a, b) => b.player.name - a.player.name)
      .sort((a, b) => b.points - a.points)
  }
  
  end() {
    this.mode = ''
  }
  
  join(player) {
    if (!this.participants.find(p => p.player.id === player.id)) {
      this.participants.push(new Participant(player))
    }
  }

  nextMatch() {
    if (this.mode === 'loop') {
      this.matches += 1
      this.loop()
    }
  }
  
  reset() {
    this.participants = []
    this.mode = ''
    this.matches = 0
    this.currentWinnerPlayerId = null
  }

  start() {
    this.mode = 'loop'
    this.loop()
  }

  // private
  loop() {
    this.match = new Match(this.getParticipantsForNextMatch())
    this.match.on('end', playerId => {
      if (this.mode === 'loop') {
        this.currentWinnerPlayerId = playerId
        this.participants.find(p => p.player.id === playerId).win(1)
      }
    })
    this.match.on('skip', () => {
      // both players lose their turn
      const index1 = this.participants.indexOf(this.participants.find(p => p.player.id === this.match.participant1.player.id))
      const index2 = this.participants.indexOf(this.participants.find(p => p.player.id === this.match.participant2.player.id))
      let greatestIndex = index1 > index2 ? index1 : index2
      // last vs first edge case
      if (Math.abs(index1 - index2) === this.participants.length - 1) {
        greatestIndex = 0
      }
      this.currentWinnerPlayerId = this.participants[greatestIndex].player.id
      const aux = this.getParticipantsForNextMatch()
      this.match.participant1 = aux.participant1
      this.match.participant2 = aux.participant2
      this.currentWinnerPlayerId = this.currentWinnerPlayerId !== aux.participant2.player.id ? aux.participant2.player.id : aux.participant1.player.id
      this.nextMatch()
    })
    this.match.on('player-skip', playerId => {
      // this id belongs to the player that will stay
      this.currentWinnerPlayerId = playerId
      this.nextMatch()
    })
    this.emit('match', this.match)
  }

  getParticipantsForNextMatch() {
    if (!this.currentWinnerPlayerId) {
      return { participant1: this.participants[0], participant2: this.participants[1] }
    }
    const participant1 = this.participants.find(p => p.player.id === this.currentWinnerPlayerId)
    let participant2 = null
    const index1 = this.participants.indexOf(this.participants.find(p => p.player.id === this.match.participant1.player.id))
    const index2 = this.participants.indexOf(this.participants.find(p => p.player.id === this.match.participant2.player.id))
    const greatestIndex = index1 > index2 ? index1 : index2
    let nextIndex = greatestIndex + 1
    while (!participant2) {
      if (nextIndex < this.participants.length && nextIndex !== index1 && nextIndex !== index2) {
        participant2 = this.participants[nextIndex]
      }
      if (nextIndex === this.participants.length) {
        nextIndex = -1
      }
      nextIndex += 1
    }
    return { participant1, participant2 }
  }
}

export default Tournament
