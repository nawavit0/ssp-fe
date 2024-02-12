import Product from './product/ProductFetch';
import Category from '../category/Category';
import CmsPage from './cmsPage/CmsPage';
import Brand from './brand/Brand';
import urlType from '../../constants/urlRewrite';
import NotFound from '../../components/NotFound/NotFound';

export default {
  [urlType.PRODUCT]: Product,
  [urlType.CATEGORY]: Category,
  [urlType.BRAND]: Brand,
  [urlType.PAGE]: CmsPage,
  [urlType.NOT_FOUND]: NotFound,
};
