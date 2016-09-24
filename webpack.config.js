const path = require('path');
const webpack = require('webpack');

const PATHS = {
  compiled: path.join(__dirname, 'compiled'),
  src: path.join(__dirname, 'Client/index.js')
};

module.exports = {
  entry: {bundle:'./Client/index.js', server:'./server/server.js'},
  output: {
    path: PATHS.compiled,
    filename: 'app.[name].js',
    favicon: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Tom's_Restaurant,_NYC.jpg"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolveLoaders: {
    modulesDirectories: ['node_modules']
  },
  resolve: { // in import statements default to these file types if none specified
    extensions: ['', '.js', '.jsx', '.css'],
    modulesDirectories: ['node_modules']
  },
  devServer: {
    contentBase: PATHS.compiled,
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
