const {postPredictHandler, getAllDataPredictionHandler} = require('./handler');

const routes = [
    {
      path: '/predict',
      method: 'POST',
      handler: postPredictHandler,
      options: {
        payload: {
          allow: 'multipart/form-data',
          multipart: true,
        }
      }
    },
    {
      path: '/predict/histories',
      method: 'GET',
      handler: getAllDataPredictionHandler,
      options: {},
    },
  ]
   
  module.exports = routes;