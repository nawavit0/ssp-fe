import { size, isUndefined } from 'lodash';
export const validateIdCard = value => {
  if (!value) return false;
  const thisVal = String(value.trim());
  if (thisVal.length === 13) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseFloat(thisVal.charAt(i)) * (13 - i);
    }
    if (
      (11 - (sum % 11)) % 10 !== parseFloat(thisVal.charAt(12)) ||
      thisVal[0] === '0'
    ) {
      return false;
    }
    return true;
  }
  return false;
};

export const validateTaxId = value => {
  if (value && String(value.trim()).length >= 10) {
    return true;
  }
  return false;
};

export const validateBranchId = value => {
  if (value && String(value.trim()).length >= 5) {
    return true;
  }
  return false;
};

export const validateAddressLine = addressLine => {
  if (
    isUndefined(addressLine) ||
    addressLine === '' ||
    addressLine === ' ' ||
    (size(addressLine) > 0 && addressLine[0] === ' ')
  ) {
    return false;
  }
  return true;
};

export const validateTelephoneNumber = telephone => {
  const regex = /^([0]{1})([0-9]*)$/;
  const isCorrectFormat = regex.test(String(telephone));
  return isCorrectFormat;
};
