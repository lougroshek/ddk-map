const Dotenv = require('dotenv-webpack')

const publicURL = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://hyperobjekt.github.io/ddk-map'
  } else if (process.env.NODE_ENV === 'staging') {
    return 'https://staging--ddk-map.netlify.app'
  } else {
    return 'https://diversitydatakids.org/maps'
  }
}
// console.log('publicURL, ', publicURL())
const FACEBOOK_APP_ID = '527190134911454'
const metaDesc =
  'Exploratory map developed by diversitydatakids.org'
const metaTitle = 'Maps | Diversity Data Kids'
const metaKeywords =
  'child, opportunity, measure, index, metric, health, social, economic, education, national, state, metro'

module.exports = {
  type: 'react-app',
  webpack: {
    publicPath: '',
    html: {
      title: metaTitle,
      favicon: 'src/modules/assets/img/favicon.png',
      meta: {
        description: metaDesc,
        keywords: metaKeywords,
        'og:title': {
          property: 'og:title',
          content: metaTitle,
        },
        'og:description': {
          property: 'og:description',
          content: metaDesc,
        },
        'og:type': {
          property: 'og:type',
          content: 'website',
        },
        'og:image': {
          property: 'og:image',
          content:
            publicURL().length > 0
              ? publicURL() + '/share-image.png'
              : 'share-image.png',
        },
        'og:url': {
          property: 'og:url',
          content:
            publicURL().length > 0 ? publicURL() : '',
        },
        'twitter:card': {
          property: 'twitter:card',
          content: 'summary_large_image',
        },
        'twitter:creator': {
          property: 'twitter:creator',
          content: 'diversitydatakids.org',
        },
        'twitter:title': {
          property: 'twitter:title',
          content: metaTitle,
        },
        'twitter:description': {
          property: 'twitter:description',
          content: metaDesc,
        },
        'twitter:image': {
          property: 'twitter:image',
          content:
            publicURL().length > 0
              ? publicURL() + '/share-image.png'
              : 'share-image.png',
        },
        'fb:app_id': {
          property: 'fb:app_id',
          content: FACEBOOK_APP_ID,
        },
      },
    },
    extra: {
      plugins: [
        new Dotenv({
          systemvars: true,
        }),
      ],
    },
  },
}
