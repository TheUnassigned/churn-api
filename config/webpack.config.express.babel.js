
import nodeExternals from 'webpack-node-externals'

export default {
  context: __dirname,
  entry: './express/server',
  output: {
    path: './express',
    filename: 'build.js'
  },
  devtool: 'source-map',
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
  externals: [nodeExternals({
    whitelist: ['twobyfour', 'twobyfour/src/db/dynamodb']
  })]
}
