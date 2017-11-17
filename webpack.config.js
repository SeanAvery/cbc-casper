const path = require('path')

module.exports = {
  entry: ['babel-polyfill', path.resolve(__dirname, 'src/index.js')],
  output: {
    path: __dirname,
    filename: 'dist.js'
  },
  module: {
    loaders: [
      {
        test: /.(js)?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          plugins: ['transform-async-to-generator'],
          presets: ['env', 'react', 'stage-3', 'es2015']
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
}
