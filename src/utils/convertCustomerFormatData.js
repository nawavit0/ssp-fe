import { explode } from '../utils/customAttributes';
/* Convert for customer data API whether using SSP format or CDS format */
/* Using this just in case for flow customer data come 2 way :
    if( SSP format )
    else ( CDS format)
 */
export const convertCustomerFormatData = (data = {}) => {
  const flattenAddress = explode(data);
  if (!data?.custom_attributes?.[0]?.attribute_code) {
    return {
      ...flattenAddress,
      ...(flattenAddress?.custom_attributes || {}),
    };
  }
  return flattenAddress;
};
