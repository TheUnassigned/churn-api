
import nodeExternals from 'webpack-node-externals'

export default {
  entry: './express/server',
  output: {
    path: './express',
    filename: 'build.js'
  },
  // this allows us to import these filetypes without writing the extension
  resolve: {
    extensions: ['', '.js', '.json']
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  target: 'node',
  externals: [nodeExternals()]
}
