import { get as prop } from 'lodash';

import { getProductImgUrl } from './imgUrl';

export const metaTagProductDetail = (product, currentLocal, baseMediaUrl) => {
  const productName = product.name;
  const siteName = 'Central.co.th';

  let tempTitle = prop(product, 'meta_title');
  let tempDesciption = prop(product, 'meta_description');
  const brandName = product.brand_name_option
    ? product.brand_name_option
    : null;

  // template for title, if don't have meta_title use template.
  if (tempTitle === undefined) {
    if (brandName) {
      tempTitle = `${brandName} ${productName} | ${siteName}`;
    } else {
      tempTitle = `${productName} | ${siteName}`;
    }
  }

  // template for description, if don't have meta_description use template.
  if (tempDesciption) {
    // remove html syntax and substring to 160 character.
    tempDesciption = tempDesciption.replace(/(<([^>]+)>)/gi, '');
    tempDesciption = tempDesciption.substring(0, 160);
  } else if (currentLocal === 'en') {
    tempDesciption = `Buy ${
      brandName ? `${brandName} ` : ''
    }${productName} here. 100% Product authenticity guaranteed, check for more discounts and special offers here at ${siteName}`;
  } else {
    tempDesciption = `ซื้อ ${
      brandName ? `${brandName} ` : ''
    }${productName} ได้เลยที่นี่ รับประกันสินค้าของแท้แน่นอน100% เช็คส่วนลดและสิทธิพิเศษต่างๆอีกมากมายได้เลยที่ ${siteName}`;
  }

  const title = tempTitle;
  const description = tempDesciption;
  const metaImage = getProductImgUrl(product.image, baseMediaUrl);

  return { title, description, metaImage };
};
