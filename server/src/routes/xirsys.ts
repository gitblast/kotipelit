import express from 'express';
import axios from 'axios';
import config from '../utils/config';
import expressJwt from 'express-jwt';

const router = express.Router();

router.use(expressJwt({ secret: config.SECRET }));

// sends secure requests to fetch xirsys ICE server list
router.get('/', async (_req, res, next) => {
  try {
    const reqConfig = {
      headers: {
        Authorization:
          'Basic ' + Buffer.from(config.XIRSYS_SECRET).toString('base64'),
      },
    };

    const body = {
      format: 'urls',
      expire: '7200',
    };

    const response = await axios.put(config.XIRSYS_URL, body, reqConfig);

    res.json(response.data);
  } catch (e) {
    next(e);
  }
});

export default router;
