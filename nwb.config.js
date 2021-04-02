const Dotenv = require('dotenv-webpack')

module.exports = {
  type: 'react-app',
  webpack: {
    publicPath: '',
    extra: {
      plugins: [
        new Dotenv({
          systemvars: true,
        }),
      ],
    },
  },
}
