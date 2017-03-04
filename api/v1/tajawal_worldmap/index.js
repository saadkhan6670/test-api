import {Router} from 'express';
import request from 'request';
import Boom from 'boom';
import config from '../../../config/environment';

const router = Router();

router.get('/', (req, res, next) => {

  const { v } = req.query;

  request.get(`${config.get('pinTheMapTweets')}?v=${v}`, (err, response, body) => {
    if (err) {
      return next(Boom.wrap(err, 500));
    }

    if (response.statusCode === 404) {
      return next(Boom.notFound('Map resource not found'));
    }

    return res.send(body);
  });
});

module.exports = router;
