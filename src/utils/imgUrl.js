import { replace } from 'lodash';

export function getProductImgUrl(productUrl, mediaUrl) {
  return `${mediaUrl}catalog/product${productUrl}`;
}

export function get2c2pImgUrl(url, mediaUrl) {
  return `${mediaUrl}2c2p_credit_card/${url}`;
}

export function changeMediaUrl(content, mediaUrl) {
  return replace(
    replace(content, /"{{media url="/g, `"${mediaUrl}`),
    /"}}"/g,
    `"`,
  );
}
