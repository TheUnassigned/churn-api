
export default {
  target: 'node',
  entry: './serverless/api',
  output: {
    libraryTarget: 'commonjs',
    path: './serverless',
    filename: 'handler.js'
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
  }
}
