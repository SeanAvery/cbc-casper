const init_state = {
  validators: [1, 2, 3, 4, 5, 6, 7],
  graph_data: {
    nodes: [],
    edges: []
  },
  graph_setting: 'full',
  command : {}
}

export default function middeware(state=init_state, action) {
  switch(action.type) {
    case 'CHANGE_SETTINGS':
      return {
        ...state,
        grap_settings: action.payload
      }
      break
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
