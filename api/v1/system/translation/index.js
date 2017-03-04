import {Router} from 'express';
import languageHelper from '../../../../helpers/language.helper';
const router = Router();

router.get('/', (req, res, next) => {
  languageHelper.getTranslation(req, 'ar', (err, data) => {
    if (err) return next(err);
    res.send(data);
  });
});

module.exports = router;
