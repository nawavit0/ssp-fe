import jwt from 'jsonwebtoken';

const getCmsContext = req => {
  const { query } = req;
  let response = {};

  if (query?.cmsHash) {
    const hash = query?.cmsHash;
    try {
      const decoded = jwt.verify(hash, process.env.JWT_SECRET_CROSS);
      const cmsId = decoded?.id || '';
      if (cmsId) {
        response = {
          cmsHash: hash,
        };
      }
    } catch (err) {}
  }

  return response;
};

export { getCmsContext };
