import service from './magentoService';

export default (req, res, next) => {
  req.service = {
    get: (url, params, options) => {
      return service({
        url,
        method: 'get',
        params,
        store: req.headers['x-store-code'],
        ...options,
      });
    },
    post: (url, data, options) => {
      return service({
        url,
        method: 'post',
        data,
        store: req.headers['x-store-code'],
        ...options,
      });
    },
    put: (url, data, options) => {
      return service({
        url,
        method: 'put',
        data,
        store: req.headers['x-store-code'],
        ...options,
      });
    },
    delete: (url, data, options) => {
      return service({
        url,
        method: 'delete',
        data,
        store: req.headers['x-store-code'],
        ...options,
      });
    },
  };

  next();
};
