import logger from '../logger';

const fetch = async (req, res) => {
  try {
    const response = await req.service.get('/orders', {
      customer_id: req.params.id,
      limit: 5,
      sort: 'created_at desc',
    });

    const responseObject = {
      lastFiveOrders: response.items,
    };

    return res.json(responseObject);
  } catch (e) {
    logger('accountController.fetch', e);
    res.status(500).json({ accountInfo: {}, status: 'error' });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { profile } = req.body;

  try {
    const customer = await req.service.get(
      '/customers/me',
      {},
      { authorizationToken: req.user.token },
    );

    if (customer.id !== Number(id)) {
      throw new Error('this user have no permission to edit this profile.');
    }

    /* clone old info and adjust to update */
    customer.firstname = profile.firstname;
    customer.lastname = profile.lastname;
    customer.gender = profile.gender;
    customer.dob = profile.dob;
    customer.extension_attributes.is_subscribed = profile.subscribe;
    customer.custom_attributes = [
      {
        attribute_code: 'phone',
        value: profile.phone,
        name: 'phone',
      },
      {
        attribute_code: 'language',
        value: profile.language,
        name: 'language',
      },
    ];

    const response = await req.service.put(
      `/customers/me`,
      { customer: customer },
      { authorizationToken: req.user.token, addStore: false },
    );

    return res.json(response);
  } catch (e) {
    logger('accountController.updateProfile', e);
    return res.status(500).json({
      status: 'error',
      message: `can not update profile, ${e.message}`,
    });
  }
};

export default { fetch, updateProfile };
