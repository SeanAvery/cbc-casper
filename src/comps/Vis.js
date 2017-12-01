import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Middleware } from '../actions/index'
import Graph from 'react-graph-vis'
import * as Layouts from './Layouts'

class Vis extends Component {
  constructor() {
    super()
    this.setNetwork = this.setNetwork.bind(this)
  }

  setNetwork(nw) {
    this.network = nw
    // this.network.clustering.cluster(this.clusterConfig)
  }

  componentWillMount() {
    this.events = {
      select: (event) => {
        this.props.dispatch(Middleware.getValidatorStats(event.nodes[0]))
      }
    }
    // this.clusterConfig = {
    //   joinCondition: (nodeOptions) => nodeOptions.label == 0
    // }
    this.props.dispatch(Middleware.listen())
  }

  render() {
    const { graph_data, graph_settings } = this.props
    if (graph_data.nodes.length > 0) {
      return (
        <Graph
          graph={graph_data}
          getNetwork={this.setNetwork}
          options={Layouts[`${graph_settings}_layout`]}
          events={this.events} />
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
