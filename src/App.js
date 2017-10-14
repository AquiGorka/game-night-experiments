import React, { Component } from 'react'
import GameNight from './lib/game-night'
import Tournament from './lib/tournament'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'


class Tetris extends Component {

  render() {
    const { onClick, participant } = this.props
    const { player } = participant
    const { name, connected, id } = player
    return <div onClick={() => onClick(id)}>Tetris {name} {connected ? 'o' : 'x'}</div>
  }
}

class M extends Component {

  componentDidMount() {
    // Are both players available?
    // Give some time to reconnect, if not, skip
    // How about adding a skip button?
  }

  render() {
    const { match, onEnd } = this.props
    const { participant1, participant2 } = match
    return <div>
      <div onClick={() => match.skip()}>Match Skip</div>
      <Tetris participant={participant1} onClick={onEnd} />
      <div onClick={() => match.playerSkip(participant2.player.id)}>Player no play</div>
      <Tetris participant={participant2} onClick={onEnd} />
      <div onClick={() => match.playerSkip(participant1.player.id)}>Player no play</div>
    </div>
  }
}

const L = props => <ul>
  {props.list.map(p =>
    <li key={p.player.id}>
      {`${p.player.name} ${p.points} ${p.player.connected ? 'o' : 'x'}`}
    </li>
  )}
</ul>

class T extends Component {

  state = { t: null, m: null, started: false, ended: false }

  componentWillMount() {
    const t = new Tournament(this.props.gid)
    this.props.players.forEach(p => t.join(p))
    this.setState({ t })
  }

  componentWillReceiveProps(newProps) {
    newProps.players.forEach(p => this.state.t.join(p))
  }

  componentDidMount() {
    this.state.t.on('match', m => this.setState({ m }))
  }
  
  render() {
    const { t, m, started, ended } = this.state
    const { players } = this.props
    if (ended) {
      return <div>Tournament has ended</div>
    }
    // t has started
    if (started) {
      // next match
      return <div>
        <div onClick={this.end}>End</div>
        <div>
          <div>Leaderboard</div>
          <L list={t.leaderboard} />
        </div>
        <M match={m} onEnd={id => this.matchEnd(id)} />
      </div>
    }
    // t hasn't started
    return <div>
      <div onClick={() => this.start()}>Start</div>
      <ul>
        {players.map(p => <li key={p.id}>{p.name} {p.connected ? 'o' : 'x'}</li>)}
      </ul>
    </div>
  }

  start = () => {
    this.state.t.start()
    this.setState({ started: true })
  }

  matchEnd = id => {
    this.state.m.end(id)
    this.state.t.nextMatch()
  }

  end = () => {
    this.state.t.end()
    this.setState({ ended: true })
  }
}

class GN extends Component {
  
  state = { gn: null, t: 0 }
  
  componentWillMount() {
    // gid = room
    const gn = new GameNight(this.props.room)
    gn.on('start', gid => console.log(`Game Night has started: ${gid}`))
    gn.on('join', p => {
      console.log(`${p.name} has joined (${p.id})`)
      this.setState({ t: Date.now() })
    })
    gn.on('leave', p => {
      console.log(`${p.name} has left (${p.id})`)
      // tell the tournament to bench this person?
      this.setState({ t: Date.now() })
    })
    gn.on('end', () => console.log('GameNight has ended'))
    gn.on('disconnect', () => this.setState({ t: Date.now() }))
    gn.on('reconnect', () => this.setState({ t: Date.now() }))
    
    this.setState({ gn })
  }
  
  render() {
    const { gn } = this.state
    const { players } = gn
    if (players.length < 1) {
      return <div>Waiting for 1 player to join... </div>
    }
    return <T gid={gn.id} players={players} />
  }
}

class Roomed extends Component {
  componentWillMount() {
    console.log(`Roomed auth: ${this.props.auth}, room: ${this.props.match.params.room}`)
    // todo
    // check room exists?
    // broadcasting for viewers
  }
  render() {
    return <GN room={this.props.match.params.room} />
  }
}

class Login extends Component {
  render() {
    // either option will redirect to /slug-user-id or /slug-room-random-id
    return <div>Login || Skip</div>
  }
}

class App extends Component {
  
  state = { auth: null }
  
  render() {
    return <Router>
      <Switch>
        <Route exact path="/" component={Login} onAuth={auth => this.setState({ auth })} />
        <Route path="/:room" render={props => <Roomed {...props} auth={this.state.auth} />} />
      </Switch>
    </Router>
  }
}

export default App
