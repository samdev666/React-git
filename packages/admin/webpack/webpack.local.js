const webpack = require('webpack');

const processEnv = new webpack.DefinePlugin({ 'process.env.ENV_NAME': JSON.stringify('local') });

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  devServer: {
    hot: true,
    open:true,
    historyApiFallback: true,
    port: 3000,
  },
  plugins: [
    processEnv,
  ],
};
