import { CustomerType } from '../../model/Auth/CustomerType';
import { get as prop } from 'lodash';

const fetch = async (req, res) => {
  try {
    const { userToken = req.user.token } = req.query;
    const customer = await req.service.get(
      '/customers/me',
      {},
      { authorizationToken: userToken },
    );
    const hasValidCompany = hasValidCompanyId(customer);
    const type = !hasValidCompany ? CustomerType.PERSONAL : null;
    if (hasValidCompany) {
      const companyId =
        customer.extension_attributes.company_attributes.company_id;
      const company = await req.service.get(`/company/${companyId}`, {
        authorizationToken: userToken,
      });

      const isAdmin = company.super_user_id === customer.id;
      return res.json({
        customer,
        type,
        shouldShowPopup: hasValidCompany,
        company,
        isAdmin,
      });
    }

    return res.json({ customer, type, shouldShowPopup: hasValidCompany });
  } catch (e) {
    return res
      .status(500)
      .json({ customer: null, message: e.message, status: 'error' });
  }
};

const updateCustomerData = async (req, res) => {
  try {
    const { customerData } = req.body;
    const { userToken = req.user.token } = req.query;

    const customer = await req.service.put(
      '/customers/me',
      {
        customer: customerData,
      },
      { authorizationToken: userToken },
    );

    if (customer.message) {
      return res.json({
        message: customer.message,
        status: 'error',
      });
    }

    const hasValidCompany = hasValidCompanyId(customer);
    if (hasValidCompany) {
      const companyId =
        customer.extension_attributes.company_attributes.company_id;
      const company = await req.service.get(`/company/${companyId}`, {
        authorizationToken: userToken,
      });
      const isAdmin = company.super_user_id === customer.id;
      return res.json({
        customer,
        company,
        isAdmin,
      });
    }

    return res.json({ message: 'success', customer: customer });
  } catch (e) {
    return res.json({ status: 'error', message: e });
  }
};

const changePassword = async (req, res) => {
  try {
    const passwordObject = req.body;

    const response = await req.service.put(
      '/customers/me/password',
      passwordObject,
      { authorizationToken: req.user.token },
    );

    if (response.message) {
      return res.json({
        status: 'error',
        message: response.message,
      });
    }

    return res.json({ status: 'success', message: 'success' });
  } catch (e) {
    return res.json({ status: 'error', message: e.message });
  }
};

//TODO: validate this method please
const hasValidCompanyId = customer => {
  const isCompany = prop(
    customer,
    'extension_attributes.company_attributes.company_id',
    false,
  );
  return !!isCompany;
};

export default {
  fetch,
  updateCustomerData,
  changePassword,
};
