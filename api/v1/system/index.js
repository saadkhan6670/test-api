import {Router} from 'express';

const router = Router();

router.use('/country', require('./country'));
router.use('/translation', require('./translation'));

module.exports = router;
