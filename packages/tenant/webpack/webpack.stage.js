const webpack = require('webpack');

const processEnv = new webpack.DefinePlugin({ 'process.env.ENV_NAME': JSON.stringify('stage') });

module.exports = {
  mode: "production",
  devtool: "source-map",
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
    processEnv,
  ],
};
