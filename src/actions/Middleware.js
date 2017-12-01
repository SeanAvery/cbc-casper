import ws from 'ws'
import store from '../store'

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

  getValidatorStats(nodeID) {
    return (dispatch) => {
      const { middleware: { graph_data: nodes } } = store.getState()
      console.log('nodes', nodes)
      let validator
      Promise.all(
        nodes.nodes.map(async node => {
          if (node.id == nodeID) validator = node.validator
        })
      )
      console.log('validator', validator)
      let validatorNodes = []
      Promise.all(
        nodes.nodes.map(async node => {
          if (node.validator === validator) validatorNodes.push(node)
        })
      )
      console.log('validator nodes', validatorNodes)
    }
  }
}
