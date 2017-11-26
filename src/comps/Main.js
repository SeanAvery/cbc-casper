import React, { Component } from 'react'
import { Provider } from 'react-redux'
import  SideNav  from './SideNav.js'
import Vis from './Vis'
import store from '../store'

export default class Main extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <Provider store={store}>
        <div style={mainStyle}>
          <div style={navStyle}>
            <h3>CASPER</h3>
          </div>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <SideNav />
            <Vis />
          </div>
        </div>
      </Provider>
    )
  }
}

const mainStyle = {
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'roboto',
  height: '100%',
  width: '100%',
}

const navStyle = {
  width: '100%',
  height: 50,
  backgroundColor: '#383838',
  color: 'white',
  paddingLeft: 10
}
