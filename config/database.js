module.exports = {
  newdb: {
    production: 'mongodb://' + process.env.MONGODB_DEVELOPMENT_USERNAME + ':' + process.env.MONGODB_DEVELOPMENT_PASSWORD + '@' + process.env.MONGODB_DEVELOPMENT_HOST + ':' process.env.MONGODB_DEVELOPMENT_PORT + '/' + process.env.MONGODB_DEVELOPMENT_DB,
    development: "localhost:27017/playlister"

  }
};

