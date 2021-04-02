const Dotenv = require('dotenv-webpack')

module.exports = {
  type: 'react-app',
  webpack: {
    extra: {
      plugins: [
        new Dotenv({
          systemvars: true,
        }),
      ],
    },
  },
  babel: {
    env: {
      targets: {
        chrome: '88',
        ie: '11',
        ios: '12',
        safari: '13',
        firefox: '85',
      },
    },
  },
}
