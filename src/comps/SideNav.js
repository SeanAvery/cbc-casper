import React, { Component } from 'react'
import { Button, TextField, MenuList, MenuItem } from 'material-ui'
import { connect } from 'react-redux'
import { Middleware } from '../actions/index'

class SideNav extends Component {
  constructor() {
    super()
    this.state = {}
    this.handleFormChange = this.handleFormChange.bind(this)
  }

  handleFormChange(e, topic) {
    switch(topic) {
      case 'validators':
        this.setState({ validators: e.target.value })
        break
      case 'rounds':
        this.setState({ rounds: e.target.value })
        break
      case 'interval':
        this.setState({ inverval: e.target.value })
        break
      case 'random':
        this.setState({ network: 'rand' })
        break
      case 'round-robin':
        this.setState({ network: 'rrob' })
        break
      case 'full':
        this.setState({ network: 'full' })
        break
      case 'no-final':
        this.setState({ network: 'nofinal' })
        break;
      case 'binary':
        this.setState({ network: 'binary' })
        break
      default:
        break
    }
  }

  startSimulation() {
    const { dispatch } = this.props
    dispatch(Middleware.sendMsg(this.state))
  }

  render() {
    return (
      <div style={sideNavStyle}>
        <MenuList role="menu">
          <MenuItem onClick={(e) => this.handleFormChange(e, 'random')}>Random</MenuItem>
          <MenuItem onClick={(e) => this.handleFormChange(e, 'round-robin')}>Round-robin</MenuItem>
          <MenuItem onClick={(e) => this.handleFormChange(e, 'full')}>Full</MenuItem>
          <MenuItem onClick={(e) => this.handleFormChange(e, 'no-final')}>No-final</MenuItem>
          <MenuItem onClick={(e) => this.handleFormChange(e, 'binary')}>Binary</MenuItem>
        </MenuList>
        <TextField
          id="number"
          label="Validators"
          value={this.state.age}
          onChange={(e) => this.handleFormChange(e, 'validators')}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          id="number"
          label="Rounds"
          value={this.state.age}
          onChange={(e) => this.handleFormChange(e, 'rounds')}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          id="number"
          label="Interval"
          value={this.state.age}
          onChange={(e) => this.handleFormChange(e, 'interval')}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <Button raised color="accent" onClick={() => this.startSimulation()} style={{ marginTop: 15, marginBottom: 75 }}>
          Simulate
        </Button>
      </div>
    )
  }
}

const storeToProps = (store) => store.middleware

export default connect(storeToProps)(SideNav)

const sideNavStyle = {
  width: 200,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#F5F5F5',
  padding: 10
}

const textFieldStyle = {
  paddingLeft: 10
}
