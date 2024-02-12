import * as actions from '../../../src/reducers/cart/actions';
import service from '../../../src/ApiService';

jest.mock('../../../src/ApiService');

describe('addToCart', () => {
  let dispatch, getState;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    getState = jest.fn();
    dispatch = jest.fn(action => {
      // redux-thunk action
      if (typeof action === 'function') {
        action(dispatch, getState);
      }
    });
  });

  test('when cart is empty', async () => {
    // mock service
    const response = { cartItem: {} };
    service.post.mockResolvedValue(response);
    // mock state
    getState
      .mockReturnValueOnce({
        cart: {
          // first time, no cart.id
          cart: null,
          itemLoading: false,
        },
      })
      .mockReturnValue({
        cart: {
          cart: { id: 101 },
          itemLoading: false,
        },
      });

    const product = { sku: 123, qty: 1 };
    const action = actions.addToCart(product);
    const result = await action(dispatch, getState);

    const expected = expect.objectContaining({
      cartId: 101,
      sku: 123,
      qty: 1,
    });

    expect(service.get).toHaveBeenCalledWith('/cart'); // should fetch cart if empty
    expect(service.post).toHaveBeenCalledWith('/cart/addToCart', expected);
    expect(dispatch).toHaveBeenCalledWith(actions.finishCartItemLoading());
    expect(result).toEqual(response.cartItem);
  });
});
