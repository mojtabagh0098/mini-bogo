import {
  DiscountApplicationStrategy,
  FunctionRunResult,
  Input,
  Cart,
  Discount,
} from '../generated/api';

export function run(input: Input<Cart>): FunctionRunResult {
  const TRIGGER_PRODUCT_ID = 'gid://shopify/Product/10099548488016';
  const REWARD_PRODUCT_ID = 'gid://shopify/Product/10080151077200';

  const discounts: Discount[] = [];

  const triggerLine = input.cart.lines.find(
    (line) => line.merchandise.product.id === TRIGGER_PRODUCT_ID
  );

  const rewardLine = input.cart.lines.find(
    (line) => line.merchandise.product.id === REWARD_PRODUCT_ID
  );

  if (triggerLine && rewardLine && triggerLine.quantity >= 1) {
    discounts.push({
      message: "BOGO applied!",
      targets: [
        {
          productVariant: {
            id: rewardLine.merchandise.id,
          },
        },
      ],
      value: {
        percentage: {
          value: 100,
        },
      },
    });
  }

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts,
  };
}
