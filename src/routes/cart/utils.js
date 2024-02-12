export const formatPrice = price => {
  const digitFormat = 0;
  const formatPrice = parseInt(price).toLocaleString('en-US', {
    minimumFractionDigits: digitFormat,
    maximumFractionDigits: digitFormat,
  });
  return formatPrice;
};
