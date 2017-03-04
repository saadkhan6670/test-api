'use strict';

import { getDomainEnv} from '../config/website/utils.website';

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function domainDetect(req, res, next) {
  // set the domain to be used further by web-config
  req.xEnvID = getDomainEnv(req);
  next();
}
