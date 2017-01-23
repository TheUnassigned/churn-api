
import nodeExternals from 'webpack-node-externals'

export default {
  target: 'node',
  entry: './serverless/api',
  context: __dirname,
  output: {
    libraryTarget: 'commonjs',
    path: './serverless',
    filename: 'handler.js'
  },
  // this allows us to import these filetypes without writing the extension
  resolve: {
    root: [
      __dirname
    ],
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
  externals: [nodeExternals({
    whitelist: name => name !== 'aws-sdk'
  })]
}
