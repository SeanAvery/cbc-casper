const init_state = {
  validators: [1, 2, 3, 4, 5, 6, 7],
  graph_data: {
    nodes: [],
    edges: []
  }
}

export default function middeware(state=init_state, action) {
  switch(action.type) {
    case 'INIT_VALIDATORS':
      let new_nodes = []
      action.payload.map(node => {
        console.log('node', node)
        new_nodes.push({
          id: node,
          label: `V${node}`,
          shape: 'hexagon'
        })
      })
      return {
        ...state,
        validators: action.payload,
        graph_data: {
          ...state.graph_data,
          nodes: state.graph_data.nodes.concat(...new_nodes)
        }
      }
    case 'TEST_PUT':
      return {
        ...state,
        graph_data: {
          ...state.graph_data,
          nodes: [{id: 1}],        }
      }
    case 'APPEND_GRAPH':
      return {
        ...state,
        graph_data: {
          ...state.graph_data,
          nodes: state.graph_data.nodes.concat(...action.payload.nodes),
          edges: state.graph_data.nodes.concat(...action.payload.edges)
        }
      }
    default:
      return state
  }
}
