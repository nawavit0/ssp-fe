import Redis from 'redis';
import { promisify } from 'util';
import { isEmpty } from 'lodash';

let isRedisConnected = true;
export const redisClient = Redis.createClient({
  host: process.env.REDIS_ENDPOINT,
  port: process.env.REDIS_PORT,
  db: process.env.REDIS_DB,
  retry_strategy: function(options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      // return new Error('The server refused the connection');
      isRedisConnected = false;
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      //////////////////?
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      // return new Error('Retry time exhausted');
      isRedisConnected = false;
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      // return undefined;
      isRedisConnected = false;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
});

if (redisClient) {
  redisClient.on('connect', function() {
    // eslint-disable-next-line no-console
    console.log('Redis redisClient connected');
  });

  redisClient.on('error', function(err) {
    // eslint-disable-next-line no-console
    console.log(`Something went wrong ${err}`);
    isRedisConnected = false;
  });

  // /redisClient.select(2);
}

export const cache = (req, res, next) => {
  if (redisClient.connected !== false) {
    const storeCode = !isEmpty(req.headers['x-store-code'])
        ? `:${req.headers['x-store-code']}`
        : '',
      pipeUrl = req.originalUrl.substr(1).replace(/\//g, ':'),
      isHasLang =
        pipeUrl.substring(pipeUrl.length - 3, pipeUrl.length) ===
        `${storeCode}`,
      keyName = isHasLang ? pipeUrl : `${pipeUrl}${storeCode}`;

    redisClient.get(keyName, (err, resultCache) => {
      if (err) throw err;

      if (resultCache !== null && typeof resultCache === 'string') {
        res.json(JSON.parse(resultCache));
      } else {
        req.redis = redisClient;
        req.redisKey = keyName;
        next();
      }
    });
  } else {
    next();
  }
};

export const setRedisCache = (req, data, expire) => {
  if (typeof req.redis !== 'undefined') {
    req.redis.set(req.redisKey, JSON.stringify(data), 'EX', expire);
  }
};

export const get = (key, expectType = '') => {
  return new Promise((resolve, reject) => {
    if (!isRedisConnected) {
      reject('redis error');
    }
    redisClient.get(key, async (err, value) => {
      const jsonValue = JSON.parse(value);
      if (
        err ||
        !value ||
        !key ||
        (expectType !== '' && typeof jsonValue !== expectType)
      )
        reject(err);
      resolve(jsonValue);
    });
  });
};

export const set = (key, value, timeout = 3600) => {
  return new Promise(resolve => {
    redisClient.set(key, JSON.stringify(value), 'EX', timeout);
    resolve({ key: value });
  });
};

// delete cache
export const del = key => {
  redisClient.del(key);
};

export const redisConnect = redisClient.connected === true;
export const webCache =
  redisConnect && promisify(redisClient.get).bind(redisClient);

export default {
  get,
  set,
  del,
};
