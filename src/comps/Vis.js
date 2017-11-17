import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Middleware } from '../actions/index'
import Graph from 'react-graph-vis'

class Vis extends Component {
  constructor() {
    super()
  }

  componentWillMount() {
    this.props.dispatch(Middleware.listen())
  }

  render() {
    const { graph_data } = this.props
     if (graph_data.nodes.length > 0) {
      return (
        <Graph graph={graph_data} />
      )
    } else {
      return (
        <h1 style={{ padding: 20 }}>
          RUN A SIMULATION!
        </h1>
      )
    }
  }
}

const storeToProps = (store) => store.middleware

export default connect(storeToProps)(Vis)
