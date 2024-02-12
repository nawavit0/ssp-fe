export const responseError = (res, error) => {
  const { statusCode, message } = error;
  const code = statusCode ? statusCode : '500';

  return res.status(code).json({
    status: 'error',
    message: message,
  });
};
