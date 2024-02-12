import {
  sendGTMProductAddToCart,
  sendGTMProductRemoveFromCart,
  sendGTMProductDetailImpression,
  getProductCustomAttributes,
} from '@central-tech/gtm';

export const GTM_NOT_SET = '(not_set)';
export const GTM_SECTION_SEARCH_SUGGESTION = 'Search suggestions';
export const GTM_SECTION_WISHLIST = 'wishlist';
export const GTM_SECTION_MINICART = 'minicart';
export const GTM_SECTION_CART = 'cart';
export const GTM_BOX_WIDGET_CLASSNAME = 'gtm-box-widget';
export const GTM_DATA_SECTION_NAME = 'data-section-name';
export const GTM_DATA_PRODUCTSECTION = 'data-productsection';

export const sendGTMProductAddToCartConfigurable = ({
  childProduct,
  parentSku,
  qty,
}) => {
  const childProductWithParentSku = {
    ...childProduct,
    sku: parentSku,
  };
  sendGTMProductAddToCart({
    product: childProductWithParentSku,
    options: {
      qty,
      variant: childProduct?.sku || '',
      size: childProduct?.current_option?.attr_size || GTM_NOT_SET,
    },
  });
};

export const sendGTMProductRemoveFromCartConfigurable = ({
  childProduct,
  parentSku,
  qty,
}) => {
  const childProductWithParentSku = {
    ...childProduct,
    sku: parentSku,
  };
  sendGTMProductRemoveFromCart({
    product: childProductWithParentSku,
    options: {
      qty,
      variant: childProduct?.sku || '',
      size:
        childProduct?.custom_attributes_option?.product_size_simple ||
        GTM_NOT_SET,
    },
  });
};

export const sendGTMProductDetailImpressionSimple = ({
  childProduct,
  parentSku,
}) => {
  if (parentSku) {
    const childProductWithParentSku = {
      ...childProduct,
      sku: parentSku,
    };
    sendGTMProductDetailImpression({
      product: childProductWithParentSku,
      options: {
        variant: childProduct?.sku || '',
        size:
          childProduct?.custom_attributes_option?.product_size_simple ||
          GTM_NOT_SET,
      },
    });
  } else {
    sendGTMProductDetailImpression({
      product: childProduct,
      options: {
        variant: childProduct?.sku || '',
        size:
          childProduct?.custom_attributes_option?.product_size_simple ||
          GTM_NOT_SET,
      },
    });
  }
};

export const sendGTMProductDetailImpressionConfigurable = ({
  parentProduct,
}) => {
  sendGTMProductDetailImpression({
    product: parentProduct,
    options: {
      size: GTM_NOT_SET,
    },
  });
};

export const getProductCustomAttributesSearchSuggestion = ({
  product,
  options,
}) => {
  const productCustomAttributes = getProductCustomAttributes({
    data: product,
    options: {
      section: GTM_SECTION_SEARCH_SUGGESTION,
      ...options,
    },
  });
  return productCustomAttributes;
};

export const getProductCustomAttributesProductPreview = ({
  product,
  options = {},
  getSectionNameFlag = true,
}) => {
  const customAttributes = getProductCustomAttributes({
    data: product,
    options,
  });
  if (!getSectionNameFlag) {
    delete customAttributes[GTM_DATA_PRODUCTSECTION];
  }
  return customAttributes;
};

export const addProductSectionToGtmBoxWidget = () => {
  if (typeof document !== 'undefined') {
    const gtmBoxWidgetElements = document.getElementsByClassName(
      GTM_BOX_WIDGET_CLASSNAME,
    );
    if (gtmBoxWidgetElements) {
      for (const element of gtmBoxWidgetElements) {
        const dataSectionName =
          element.getAttribute(GTM_DATA_SECTION_NAME) || GTM_NOT_SET;
        const tagAElements = element.getElementsByTagName('A');
        if (tagAElements.length > 0) {
          for (const tagAElement of tagAElements) {
            tagAElement.setAttribute(GTM_DATA_PRODUCTSECTION, dataSectionName);
          }
        }
      }
    }
  }
};
