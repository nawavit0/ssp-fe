import React from 'react';
import pt from 'prop-types';
import {
  ContentHoverAbleStyled,
  ImageWrapperStyled,
  ProductDetailsStyled,
  BrandStyled,
  FranchiseStyled,
  NameFranchiseStyled,
  PriceSectionStyled,
  ProductOverlayStyled,
  PreviewImageStyled,
} from './styled';
import { withLocales, Link, withStoreConfig } from '@central-tech/core-ui';
import styled from 'styled-components';
import { map, get as prop } from 'lodash';
import queryString from 'query-string';
import ProductPromotionBadge from '../Product/ProductPromotionBadge/ProductPromotionBadge';
import { getProductImgUrl } from '../../utils/imgUrl';
import ProductSpecialDiscount from '../Product/ProductSpecialDiscount/ProductSpecialDiscount';
import PriceContainer from '../Product/PriceContainer/PriceContainer';
import ProductName from '../Product/ProductName/ProductName';
import categorySpecific from '../../constants/categorySpecific';
import { encodeBase64 } from '../../utils/product';
import { calPercentDiscount } from '../../utils/calPercentDiscount';
import { checkDate } from '../../utils/date';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../utils/generateElementId';
import ImageLazy from '../Image/ImageLazy';
import {
  getProductCustomAttributesProductPreview,
  addProductSectionToGtmBoxWidget,
} from '../../utils/gtm';

const CustomLink = styled(Link)`
  display: block;
`;

@withStoreConfig
@withLocales
class ProductPreview extends React.PureComponent {
  static propTypes = {
    product: pt.object.isRequired,
    countdown: pt.bool,
    countdownProgressBar: pt.bool,
    hideProductPreviewButtons: pt.bool,
    imgOnly: pt.bool,
  };

  static defaultProps = {
    hideProductPreviewButtons: false,
    countdownProgressBar: false,
    imgOnly: false,
  };

  state = {
    isConfigurable: false,
    activeOption: null,
    activeConfigurableChildren: null,
  };

  constructor(props) {
    super(props);

    const { product } = props;
    let isBackColorDiscount = false;
    if (product.category && product.category.length > 0) {
      isBackColorDiscount =
        product.category.filter(
          category =>
            category &&
            category.url_key &&
            (category.url_key === categorySpecific.WOMEN ||
              category.url_key === categorySpecific.BEAUTY),
        ).length > 0;
    }

    this.isBackColorDiscount = isBackColorDiscount;
  }
  renderProductDetail = gtmCustomAttributes => {
    const {
      product,
      hideProductPreviewButtons,
      countdown,
      countdownProgressBar,
    } = this.props;
    const { isConfigurable, activeConfigurableChildren } = this.state;
    const activeProduct = activeConfigurableChildren || product;
    const brandData = prop(activeProduct, 'extension_attributes.brand', {});
    const hidePromotionPrice = prop(
      brandData,
      'extension_attributes.hide_product_original_price',
    );
    return (
      <>
        <BrandStyled>
          <Link
            id={`lnk-viewBrand-${brandData.brand_id}`}
            to={brandData.url_key || '#'}
            native={false}
            {...gtmCustomAttributes}
          >
            {activeProduct.brand_name_option}
          </Link>
        </BrandStyled>
        <FranchiseStyled isHide={!prop(activeProduct, 'franchise')}>
          {activeProduct.franchise}
        </FranchiseStyled>
        <>
          <NameFranchiseStyled hasFranchise={prop(activeProduct, 'franchise')}>
            <ProductName
              product={product}
              activeProduct={activeProduct}
              gtmCustomAttributes={gtmCustomAttributes}
            />
          </NameFranchiseStyled>
          <PriceSectionStyled
            isHideProductPreviewButtons={hideProductPreviewButtons}
          >
            <PriceContainer
              product={activeProduct}
              hidePromo={hidePromotionPrice}
              customMessage={isConfigurable && 'From'}
              customDiscountMessage={isConfigurable && '~'}
              countdown={countdown}
              countdownProgressBar={countdownProgressBar}
            />
          </PriceSectionStyled>
        </>
      </>
    );
  };

  renderProductOverlay = productOverlay => {
    const { activeConfig } = this.props;

    if (productOverlay) {
      if (parseInt(productOverlay.overlay_status)) {
        if (
          checkDate(
            productOverlay.overlay_start_date,
            productOverlay.overlay_end_date,
          )
        ) {
          return (
            <ProductOverlayStyled>
              <ImageLazy
                src={`${activeConfig.base_media_url}${productOverlay.overlay_image}`}
              />
            </ProductOverlayStyled>
          );
        }
      }
    }
  };
  componentDidMount() {
    addProductSectionToGtmBoxWidget();
  }
  renderContent = (product, index, sectionName) => {
    const { translate, activeConfig, imgOnly } = this.props;
    const {
      activeConfigurableChildren,
      activeOption,
      isConfigurable,
    } = this.state;
    const defaultImage = '/static/images/DefaultImage.jpg';
    const activeProduct = activeConfigurableChildren || product;
    const imageUrl = getProductImgUrl(
      activeProduct.image,
      activeConfig.base_media_url,
    );

    const brandData = prop(product, 'extension_attributes.brand', {});
    const hidePromotionPrice = prop(
      brandData,
      'extension_attributes.hide_product_original_price',
    );
    const stockQTY = prop(activeProduct, 'extension_attributes.stock_item.qty');
    const linkDetailEncode = {};

    map(activeOption, (opt, indexOtp) => {
      linkDetailEncode[encodeBase64(`${indexOtp},cds`)] = opt;
    });
    const productLinkDetail =
      isConfigurable && activeOption && product.url_key && stockQTY > 0
        ? `${product.url_key}?${queryString.stringify(linkDetailEncode, {
            sort: false,
          })}`
        : `${product.url_key || '#'}`;
    const percentDiscount = calPercentDiscount(activeProduct);
    const gtmCustomAttributes = getProductCustomAttributesProductPreview({
      product: activeProduct,
      options: { position: index + 1, section: sectionName },
    });
    return (
      <ContentHoverAbleStyled className={'content-hover-able'}>
        <ImageWrapperStyled>
          <>
            <ProductPromotionBadge
              isNew={
                activeProduct.custom_attributes &&
                activeProduct.custom_attributes.new &&
                Number(activeProduct.custom_attributes.new)
              }
              id={generateElementId(
                ELEMENT_TYPE.TEXT,
                ELEMENT_ACTION.VIEW,
                'BadgeNew',
                'PLP',
                product.sku,
              )}
            />
            {!hidePromotionPrice && (
              <ProductSpecialDiscount
                percentDiscount={percentDiscount}
                message={translate('save')}
                isBackColorDiscount={this.isBackColorDiscount}
                id={generateElementId(
                  ELEMENT_TYPE.TEXT,
                  ELEMENT_ACTION.VIEW,
                  'SpecialDiscount',
                  'PLP',
                  product.sku,
                )}
              />
            )}
            <CustomLink
              id={generateElementId(
                ELEMENT_TYPE.LINK,
                ELEMENT_ACTION.VIEW,
                'PDP',
                'PLP',
                product.sku,
              )}
              to={`/${productLinkDetail}`}
              native={false}
              {...gtmCustomAttributes}
            >
              {activeProduct.image && activeProduct.image !== 'no_selection' ? (
                <PreviewImageStyled className={'preview-image'}>
                  <ImageLazy
                    src={imageUrl}
                    alt={product.name}
                    resizeWidth={400}
                    data-sku-config={product.sku}
                    optimize
                    product={product}
                    activeProduct={activeProduct}
                    gtmData
                  />
                </PreviewImageStyled>
              ) : (
                <PreviewImageStyled className={'preview-image'}>
                  <ImageLazy
                    src={defaultImage}
                    alt={product.name}
                    product={product}
                    activeProduct={activeProduct}
                    customStyle={`
                              width: 100%;
                              margin: auto;
                              display: block;
                            `}
                    gtmData
                  />
                </PreviewImageStyled>
              )}
              {this.renderProductOverlay(
                prop(product, 'extension_attributes.overlays[0]'),
              )}
            </CustomLink>
          </>
        </ImageWrapperStyled>
        {!imgOnly && (
          <ProductDetailsStyled>
            {this.renderProductDetail(gtmCustomAttributes)}
          </ProductDetailsStyled>
        )}
      </ContentHoverAbleStyled>
    );
  };

  render() {
    const { product, index, sectionName } = this.props;
    if (!product) {
      return null;
    }
    return this.renderContent(product, index, sectionName);
  }
}

export default ProductPreview;
