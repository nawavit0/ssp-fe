import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
});

const service = {};

const request = (action, cancel, timeout) => {
  let clearCancelTimeout = () => {};

  if (timeout !== undefined) {
    const cancelTimeout = setTimeout(() => {
      cancel();
    }, timeout);

    clearCancelTimeout = () => {
      clearTimeout(cancelTimeout);
    };
  }

  return new Promise((resolve, reject) => {
    action
      .then(({ data }) => {
        clearCancelTimeout();
        resolve(data);
      })
      .catch(e => {
        if (axios.isCancel(e)) {
          // eslint-disable-next-line no-console
          console.log('Request Canceled (Timeout)', e.message);
        }

        reject(e);
      });
  });
};

service.get = (url, params, timeout) => {
  let cancel;
  const action = axiosInstance({
    method: 'get',
    params,
    url: `/api${url}`,
    cancelToken: new axios.CancelToken(c => {
      cancel = c;
    }),
  });

  return request(action, cancel, timeout);
};

service.post = (url, data, timeout) => {
  let cancel;

  const action = axiosInstance({
    method: 'post',
    data,
    url: `/api${url}`,
    cancelToken: new axios.CancelToken(c => {
      cancel = c;
    }),
  });

  return request(action, cancel, timeout);
};

service.put = (url, data, timeout) => {
  let cancel;

  const action = axiosInstance({
    method: 'put',
    data,
    url: `/api${url}`,
    cancelToken: new axios.CancelToken(c => {
      cancel = c;
    }),
  });

  return request(action, cancel, timeout);
};

service.delete = (url, data, timeout) => {
  let cancel;

  const action = axiosInstance({
    method: 'delete',
    data,
    url: `/api${url}`,
    cancelToken: new axios.CancelToken(c => {
      cancel = c;
    }),
  });

  return request(action, cancel, timeout);
};

export default service;
