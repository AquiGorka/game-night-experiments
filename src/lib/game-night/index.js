import EventEmitter from 'eventemitter3'
import Peer from 'peerjs'
import config from '../../../config'
import randomString from 'randomstring'

const randomGameNightId = () => {
  return randomString.generate({
    length: 3,
    readable: true,
    charset: 'alphabetic',
    capitalization: 'lowercase',
  })
}

class Player {
  constructor({ conn, id, name, avatar }) {
    this.id = id
    this.name = name
    this.avatar = avatar
    
    this.reconnect(conn)
  }

  // "public"
  disconnect = () => {
    this.connected = false
  }
  reconnect = conn => {
    this.connected = true
    conn.once('close', this.disconnect)
  }
}

class GameNight extends EventEmitter {
  constructor(id = randomGameNightId()) {
    super()
    this.id = id
    this.players = []
    this.peer = new Peer(`gn-${this.id}`, config)
    this.peer.on('open', this.open)
    this.peer.on('connection', this.connection)
  }

  // "public"

  // "private"
  connection = conn => {
    const player = this.players.find(p => p.id === conn.metadata.player.id)
    if (player) {
      // reconnect
      this.reconnect(conn, player)
    } else {
      // new player
      this.newPlayer(conn)
    }
  }
  newPlayer = conn => {
    const newPlayer = new Player({ conn, ...conn.metadata.player })
    this.players.push(newPlayer)
    this.emit('join', newPlayer)
    conn.once('close', () => this.emit('disconnect'))
  }
  open = () => {
    this.emit('start', this.id)
  }
  reconnect = (conn, player) => {
    player.reconnect(conn)
    this.emit('reconnect')
    conn.once('close', () => this.emit('disconnect'))
  }
}

export default GameNight
