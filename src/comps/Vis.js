import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Middleware } from '../actions/index'
import Graph from 'react-graph-vis'
import * as Layouts from './Layouts'

class Vis extends Component {
  constructor() {
    super()
  }

  componentWillMount() {
    this.props.dispatch(Middleware.listen())
  }

  render() {
    const { graph_data, graph_settings } = this.props
    if (graph_data.nodes.length > 0) {
      return (
        <Graph graph={graph_data} options={graph_settings} />
      )
    } else {
      return (
        <h2 style={{ padding: 20 }}>
          RUN A SIMULATION!
        </h2>
      )
    }
  }
}

const storeToProps = (store) => store.middleware

export default connect(storeToProps)(Vis)

//options={Layouts[`${graph_settings}_layout`]}
