import webpack from 'webpack'

const config = {
  target: 'node',
  entry: './serverless/api.js',
  output: {
    libraryTarget: 'commonjs',
    path: __dirname + '/../serverless',
    filename: 'handler.js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.json']
  },
  externals: ['aws-sdk'],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, 'node-noop')
  ]
}

export default config
