// filepath: /Users/rishimishra/Documents/GitHub/Final-Year-Project/config-overrides.js
module.exports = function override(config, env) {
    config.module.rules.push({
      test: /\.js$/,
      enforce: 'pre',
      use: ['source-map-loader'],
      exclude: [
        /node_modules\/web3/,
        /node_modules\/web3-errors/,
        /node_modules\/web3-eth-abi/,
        /node_modules\/web3-utils/
      ]
    });
  
    return config;
  };