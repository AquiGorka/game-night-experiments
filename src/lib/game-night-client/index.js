import EventEmitter from 'eventemitter3'
import Peer from 'peerjs'
import config from '../../../config'

class Player {
  constructor({ id, name, avatar }) {
    this.id = id
    this.name = name
    this.avatar = avatar
  }
}

class GameNightClient extends EventEmitter {
  constructor(id = 'gnc') {
    super()
    this.id = id
    this.player = null
    this.peer = new Peer(config)
    this.conn = null
  }

  login({ name, avatar }) {
    this.player = new Player({ id: this.id, name, avatar })
  }

  join(id) {
    this.conn = this.peer.connect(`gn-${id}`, { metadata: { player: this.player }})
    this.conn.on('open', () => this.emit('join'))
  }
}

export default GameNightClient
