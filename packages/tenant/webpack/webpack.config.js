const { merge } = require("webpack-merge");
const commanConfig = require("./webpack.common.js");

module.exports = (envVars) => {
  const { env } = envVars;
  console.warn("env", env);
  const envConfig = require(`./webpack.${env}.js`);
  const config = merge(commanConfig, envConfig);
  return config;
};
