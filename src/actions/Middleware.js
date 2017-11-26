import ws from 'ws'

export default class Middleware {
  constructor(params) {
    this.ws = new WebSocket('ws://localhost:3344')
    this.ws.onopen = (socket) => console.log('### connected to server!')
  }

  listen() {
    return (dispatch) => {
      this.ws.onmessage = (e) => {
        dispatch({type: 'APPEND_GRAPH', payload: JSON.parse(e.data)})
      }
    }
  }

  sendMsg(msg) {
    return (dispatch) => {
      dispatch({type: 'CLEAR'})
      this.ws.send(JSON.stringify(msg))
    }
  }
}
