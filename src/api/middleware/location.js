import * as googleMaps from '@google/maps/lib/index';
import logger from '../logger';
import config from '../config';

export const getAddressByLocation = (req, res) => {
  const { latitude, longitude } = req.params;
  const { language } = req.query;

  googleMaps
    .createClient({
      key: config.google_api_key,
      Promise: Promise,
    })
    .reverseGeocode({ latlng: [latitude, longitude], language })
    .asPromise()
    .then(({ json: { results } }) => res.json(results[0].formatted_address))
    .catch(e => {
      logger('locationController.getAddressByLocation', e);
      return res.status(500).json(e);
    });
};

export default {
  getAddressByLocation,
};
