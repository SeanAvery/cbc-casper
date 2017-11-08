const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'src'),
    filename: 'dist.js'
  },
  module: {
    loaders: [
      {
        test: /.(js)?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env', 'react', 'stage-3']
        }
      }
    ]
  }
}
