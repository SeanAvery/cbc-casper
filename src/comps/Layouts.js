const rand_layout = {
  layout: {
    randomSeed: undefined,
    // improvedLayout:true,
    hierarchical: {
      enabled: true,
      levelSeparation: 100,
      nodeSpacing: 100,
      treeSpacing: 100,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: 'LR',        // UD, DU, LR, RL
      sortMethod: 'directed'   // hubsize, directed
    }
  }
}

const rrobin_layout = {
  layout: {
    randomSeed: undefined,
    improvedLayout: true
  }
}

const full_layout = {}

const nofinal_layout = {}

export {
  rand_layout,
  rrobin_layout,
  full_layout,
  nofinal_layout
}
