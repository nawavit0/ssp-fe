import { reduce, isEmpty } from 'lodash';

export const resolveUrl = (...paths) => {
  return reduce(
    paths,
    (memo, path) => {
      if (!path) {
        return memo;
      }

      const parsedPath = path
        .split('/')
        .filter(p => p !== '')
        .join('/');

      if (!parsedPath) {
        return memo;
      }

      return `${memo}/${parsedPath}`;
    },
    '',
  );
};

export const createUrl = (pathname, queryParams) => {
  if (isEmpty(queryParams)) {
    return pathname;
  }

  const joinedQueryParams = reduce(
    queryParams,
    (memo, value, param) => {
      if (value) {
        memo.push(`${param}=${value}`);
      }
      return memo;
    },
    [],
  ).join('&');

  return `${pathname}?${joinedQueryParams}`;
};

export const parseQueryParams = queryParams => {
  if (!queryParams) {
    return {};
  }

  const queryParamsParts = queryParams.slice(1).split('&');

  return reduce(
    queryParamsParts,
    (memo, part) => {
      const [param, value] = part.split('=');
      memo[param] = isNaN(value) ? value : +value;
      return memo;
    },
    {},
  );
};
