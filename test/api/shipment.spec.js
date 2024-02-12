import controller from '../../src/api/middleware/shipment';
import createService from '../../src/api/createService';

describe('api/shipments', () => {
  const spy = jest.fn(json => json);

  const req = {
    headers: { 'x-store-code': 'th' },
    params: {},
  };

  const res = {
    json: spy,
  };

  // dev environment data
  const ORDER_ID = 288;

  afterEach(() => {
    spy.mockReset();
  });

  beforeEach(() => {
    // create real service for integration test
    createService(req, undefined, () => {});
  });

  it('fetch shipments by order', async () => {
    req.params = { id: ORDER_ID };

    const packages = await controller.fetch(req, res);

    expect(packages).toBeInstanceOf(Array);
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
