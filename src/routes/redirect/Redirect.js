import React, { memo, useEffect } from 'react';

const Redirect = ({ url }) => {
  useEffect(() => {
    window.location.href = `https://${url}`;
  });
  return <div>Loading</div>;
};

export default memo(Redirect);
