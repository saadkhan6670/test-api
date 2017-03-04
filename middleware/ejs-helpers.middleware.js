import fs from 'fs';
import config from '../config/environment';
import path from 'path';

/**
 * getCssAssets
 *
 * @description Used in .ejs view to get css files from assets/css, regardless of .env it will get the right one
 */
function getCssAssetsFunction(req) {
  const domainConfig = req.wwwConfig;

  if (config.env === 'local') {
    return function getCssAssetsLocal(assetName) {
      return `assets/css/${assetName}`;
    }
  }
  
  const cssManifest = JSON.parse(fs.readFileSync(path.join(req.app.get('appRootPath'), 'css-manifest.json')));

  const loadAssetFromS3 = config.has('loadAssetFromS3') ? config.get('loadAssetFromS3') : "0";

  if (loadAssetFromS3 === '1') {
    return function getCssAssetsFromManifest(assetName) {
      return domainConfig.assetUrl + domainConfig.assetPrefix + `/css/${cssManifest[assetName]}`;
    }
  }
  else {
    return function getCssAssetsFromManifest(assetName) {
      return `assets/css/${cssManifest[assetName]}`;
    }
  }
}

function getScriptAssetsFunction(req) {
  const domainConfig = req.wwwConfig;

  if (config.env === 'local') {
    return function getScriptAssetsLocal(assetName) {
      return '';
    }
  }

  const scriptManifest = JSON.parse(fs.readFileSync(path.join(req.app.get('appRootPath'), 'script-manifest.json')));


  const loadAssetFromS3 = config.has('loadAssetFromS3') ? config.get('loadAssetFromS3') : "0";

  if (loadAssetFromS3 === '1') {
    return function getScriptAssetsFromManifest(assetName) {
      return domainConfig.assetUrl + domainConfig.assetPrefix + `/${scriptManifest[assetName]}`;
    }
  }
  else {
    return function getScriptAssetsFromManifest(assetName) {
      return `${scriptManifest[assetName]}`;
    }
  }

}

export function registerEjsHelpers(req, res, next) {
  res.locals.getCssAsset = getCssAssetsFunction(req);
  res.locals.getScriptAsset = getScriptAssetsFunction(req);
  next();
}
