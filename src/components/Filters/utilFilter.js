export const resetFilter = (attributeCode, location = {}) => {
  const { queryParams } = location;

  if (queryParams) {
    if (queryParams[attributeCode]) {
      queryParams[attributeCode] = undefined;
      location.push(location.pathname, queryParams);
    }

    if (Object.keys(queryParams).length && !attributeCode) {
      Object.keys(queryParams).map(key => {
        queryParams[key] = undefined;
      });

      location.push(location.pathname, queryParams);
    }
  }
};
export const handleFilterClick = ({ value }, attributeCode, location = {}) => {
  const { queryParams } = location;

  if (attributeCode === 'category_id') {
    let resultValues = [];

    if (!queryParams[attributeCode]) {
      resultValues.push(value);
    } else {
      resultValues = String(queryParams[attributeCode]).split(',');
      if (resultValues.indexOf(value) !== -1) {
        resultValues.splice(resultValues.indexOf(value), 1);
      } else {
        resultValues.push(value);
      }
    }
    queryParams[attributeCode] = resultValues.join();
  } else if (attributeCode === 'brand_name') {
    let resultURIValues = [];
    const valueEncode = encodeURIComponent(value);

    if (!queryParams[attributeCode]) {
      resultURIValues.push(valueEncode);
    } else {
      resultURIValues = String(queryParams[attributeCode]).split(',');
      if (resultURIValues.indexOf(valueEncode) !== -1) {
        resultURIValues.splice(resultURIValues.indexOf(valueEncode), 1);
      } else {
        resultURIValues.push(valueEncode);
      }
    }

    queryParams[attributeCode] = resultURIValues.join();
  } else if (attributeCode === 'color') {
    let resultValues = [];

    if (!queryParams[attributeCode]) {
      resultValues.push(value);
    } else {
      resultValues = String(queryParams[attributeCode]).split(',');
      if (resultValues.indexOf(value) !== -1) {
        resultValues.splice(resultValues.indexOf(value), 1);
      } else {
        resultValues.push(value);
      }
    }
    queryParams[attributeCode] = resultValues.join();
  } else if (attributeCode === 'price_range') {
    value = `${value.min},${value.max}`;
    queryParams[attributeCode] = value;
  } else if (
    attributeCode === 'online_price_enabled' ||
    attributeCode === 'new'
  ) {
    if (value === 1) {
      queryParams[attributeCode] = value;
    } else {
      delete queryParams[attributeCode];
    }
  }

  location.push(location.pathname, queryParams);
};

export const formatPrice = price => {
  const digitFormat = 0;
  const formatPrice = parseInt(price).toLocaleString('en-US', {
    minimumFractionDigits: digitFormat,
    maximumFractionDigits: digitFormat,
  });

  return formatPrice;
};
