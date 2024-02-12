import Boom from 'boom';
const fetch = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await req.service.get(
      `/deliveryItem/packageStatusSummary/${id}`,
    );

    return res.json(response);
  } catch (e) {
    return Boom.boomify(e, e.statusCode);
  }
};

export default {
  fetch,
};
