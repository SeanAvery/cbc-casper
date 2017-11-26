import React, { Component } from 'react'
import { Button, TextField, MenuList, MenuItem } from 'material-ui'
import { connect } from 'react-redux'
import { Middleware } from '../actions/index'

class SideNav extends Component {
  constructor() {
    super()
    this.state = {}
    this.form = {}
    this.handleFormChange = this.handleFormChange.bind(this)
  }

  handleFormChange(e, topic) {
    switch(topic) {
      case 'validators':
        this.form.validators = e.target.value
        break
      case 'rounds':
        this.form.rounds = e.target.value
        break
      case 'interval':
        this.form.interval = e.target.value
        break
      case 'rand':
        this.form.network = topic
        this.props.dispatch({type: 'CHANGE_SETTINGS', payload: topic })
        break
      case 'rrob':
        this.form.network = topic
        this.props.dispatch({type: 'CHANGE_SETTINGS', payload: topic })
        break
      case 'full':
        this.form.network = topic
        this.props.dispatch({type: 'CHANGE_SETTINGS', payload: topic })
        break
      case 'nofinal':
        this.form.network = topic
        this.props.dispatch({type: 'CHANGE_SETTINGS', payload: topic })
        break;
      case 'binary':
        this.form.network = topic
        this.props.dispatch({type: 'CHANGE_SETTINGS', payload: topic })
        break
      default:
        break
    }
  }

  startSimulation() {
    const { dispatch } = this.props
    dispatch(Middleware.sendMsg(this.form))
  }

  render() {
    return (
      <div style={sideNavStyle}>
        <MenuList role="menu">
          <MenuItem onClick={(e) => this.handleFormChange(e, 'rand')}>Random</MenuItem>
          <MenuItem onClick={(e) => this.handleFormChange(e, 'rrob')}>Round-robin</MenuItem>
          <MenuItem onClick={(e) => this.handleFormChange(e, 'full')}>Full</MenuItem>
          <MenuItem onClick={(e) => this.handleFormChange(e, 'nofinal')}>No-final</MenuItem>
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
