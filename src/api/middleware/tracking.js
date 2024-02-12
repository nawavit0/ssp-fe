import axios from 'axios';

export const dataScienceApi = {
  clientId: 'gd3otfu9e4spvd8ofcuvlf5fk',
  clientSecret: '199g9icvg5qnp8aumma22j78qnq35ivh9ogpdd3u839ffkr1q722',
  urlAuth: 'https://analytics-tracking.auth.ap-southeast-1.amazoncognito.com/',
  urlTracking: 'https://dev-tracking.datalake.central.tech/',
};

const sendTracking = (req, res) => {
  const basicAuth = `Basic ${Buffer.from(
    `${dataScienceApi.clientId}:${dataScienceApi.clientSecret}`,
  ).toString('base64')}`;
  const instance = axios.create({
    baseURL: dataScienceApi.urlAuth,
    timeout: 1000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache',
      Authorization: basicAuth,
    },
  });

  // return res.json({ cartItem: instance});

  instance
    .post('/oauth2/token?grant_type=client_credentials')
    .then(function(response) {
      if (response.data.access_token) {
        const instanceTracking = axios.create({
          baseURL: dataScienceApi.urlTracking,
          timeout: 1000,
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
            'Content-Type': 'application/json',
            'cache-control': 'no-cache',
          },
        });

        // return res.json({ cartItem:  req.body});
        instanceTracking
          .post('/api/events', {
            name: req.body.event,
            bu: 'cds',
            user_id: req.body.userId,
            properties: req.body,
          })
          .then(function(response) {
            return res.sendStatus(response.status);
          })
          .catch(function() {
            return res.sendStatus(404);
          });
      }
    })
    .catch(function() {
      return res.sendStatus(404);
    });
};

export default {
  sendTracking,
};
