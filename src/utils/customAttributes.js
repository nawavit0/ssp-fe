import { map, reduce, isArray, isObjectLike, pick, omit } from 'lodash';

// recursively bypasses the object and explode all custom_attributes
export function explode(obj) {
  try {
    if (isArray(obj)) {
      return map(obj, val => (isObjectLike(val) ? explode(val) : val));
    }

    let objFormated = obj;

    if (obj.custom_attributes) {
      objFormated = {
        ...objFormated,
        options_default: obj.custom_attributes,
      };
    }

    if (obj.custom_attribute_options || obj.custom_attributes_option) {
      objFormated = {
        ...objFormated,
        options: obj.custom_attribute_options || obj.custom_attributes_option,
      };
    }

    return reduce(
      objFormated,
      (memo, val, key) => {
        if (key === 'options_default') {
          val.forEach(field => {
            memo[field.attribute_code] = field.value;
          });
        } else if (key === 'options') {
          val.forEach(field => {
            memo[`${field.attribute_code}_option`] = field.value;
          });
        } else {
          memo[key] = isObjectLike(val) ? explode(val) : val;
        }

        return memo;
      },
      {},
    );
  } catch (error) {
    return obj;
  }
}

export function createCustomAttributes(obj, fields = []) {
  return {
    ...omit(obj, fields),
    custom_attributes: map(pick(obj, fields), (value, key) => ({
      attribute_code: key,
      value,
      name: key,
    })),
  };
}
