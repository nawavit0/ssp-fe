import * as selector from '../../../src/reducers/payment/selectors';

describe('payment/selectors', () => {
  // sample data
  const state = samplePaymentState();

  test('getShippingSegment', () => {
    const result = selector.getShippingSegment(state);
    expect(result).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        value: 50,
      }),
    );
  });

  test('getSubTotalSegment', () => {
    const result = selector.getSubTotal(state);
    expect(result).toEqual(1352);
  });

  test('getSubTotalSegment', () => {
    const result = selector.getGrandTotal(state);
    expect(result).toEqual(1402);
  });

  function samplePaymentState() {
    return {
      payment: {
        payment: {
          payment_methods: [
            {
              code: 'cashondelivery',
              title: 'Cash On Delivery',
            },
          ],
          totals: {
            grand_total: 1313.55,
            base_grand_total: 1402,
            subtotal: 1263.55,
            base_subtotal: 1263.55,
            discount_amount: 0,
            base_discount_amount: 0,
            subtotal_with_discount: 1263.55,
            base_subtotal_with_discount: 1263.55,
            shipping_amount: 50,
            base_shipping_amount: 50,
            shipping_discount_amount: 0,
            base_shipping_discount_amount: 0,
            tax_amount: 88.45,
            base_tax_amount: 88.45,
            weee_tax_applied_amount: null,
            shipping_tax_amount: 0,
            base_shipping_tax_amount: 0,
            subtotal_incl_tax: 1352,
            shipping_incl_tax: 50,
            base_shipping_incl_tax: 50,
            base_currency_code: 'THB',
            quote_currency_code: 'THB',
            coupon_code: '',
            items_qty: 1,
            items: [
              {
                item_id: 1466,
                price: 1263.55,
                base_price: 1263.55,
                qty: 1,
                row_total: 1263.55,
                base_row_total: 1263.55,
                row_total_with_discount: 0,
                tax_amount: 88.45,
                base_tax_amount: 88.45,
                tax_percent: 7,
                discount_amount: 0,
                base_discount_amount: 0,
                discount_percent: 0,
                price_incl_tax: 1352,
                base_price_incl_tax: 1352,
                row_total_incl_tax: 1352,
                base_row_total_incl_tax: 1352,
                options: '[]',
                weee_tax_applied_amount: null,
                weee_tax_applied: null,
                extension_attributes: {
                  sales_rules: [
                    {
                      quote_id: 1222,
                      quote_item_id: 1466,
                      rule_id: 75,
                      discount_amount: 0,
                      order: 0,
                      priority_order: 0,
                      coupon_code: null,
                    },
                    {
                      quote_id: 1222,
                      quote_item_id: 1466,
                      rule_id: 79,
                      discount_amount: 0,
                      order: 0,
                      priority_order: 1,
                      coupon_code: null,
                    },
                  ],
                },
                name:
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              },
            ],
            total_segments: [
              {
                code: 'subtotal',
                title: 'Subtotal',
                value: 1352,
              },
              {
                code: 'giftwrapping',
                title: 'Gift Wrapping',
                value: null,
                extension_attributes: {
                  gw_item_ids: [],
                  gw_price: '0.0000',
                  gw_base_price: '0.0000',
                  gw_items_price: '0.0000',
                  gw_items_base_price: '0.0000',
                  gw_card_price: '0.0000',
                  gw_card_base_price: '0.0000',
                },
              },
              {
                code: 'shipping',
                title:
                  'Shipping & Handling (CDS - มาตรฐาน (จัดส่งใน  3 -  5 วัน))',
                value: 50,
              },
              {
                code: 'amasty_coupon_amount',
                title: 'AmastyCoupon',
                value: [],
              },
              {
                code: 'tax',
                title: 'Tax',
                value: 88.45,
                area: 'taxes',
                extension_attributes: {
                  tax_grandtotal_details: [
                    {
                      amount: 88.45,
                      rates: [
                        {
                          percent: '7',
                          title: 'Goods and Service Tax - GST Vat 7',
                        },
                      ],
                      group_id: 1,
                    },
                  ],
                },
              },
              {
                code: 'grand_total',
                title: 'Grand Total',
                value: 1402,
                area: 'footer',
              },
              {
                code: 'customerbalance',
                title: 'Store Credit',
                value: 0,
              },
            ],
          },
          extension_attributes: {
            p2c2p_installment_unavailable_message:
              'Sorry some items are not applicable for installment',
            p2c2p_payment_agents: [
              {
                agent_id: '1',
                name: 'Bank of Ayutthaya',
                code: 'BAY',
                type: 'BANK',
                channel: 'ATM,BANKCOUNTER,IBANKING,WEBPAY,MOBILEBANKING',
              },
              {
                agent_id: '2',
                name: 'Bangkok Bank',
                code: 'BBL',
                type: 'BANK',
                channel: 'ATM,BANKCOUNTER,IBANKING,WEBPAY,MOBILEBANKING',
              },
            ],
            applied_rules: [],
            p2c2p_credit_card_promotions: [],
          },
        },
        paymentMethod: '',
        extension: {},
      },
    };
  }
});
