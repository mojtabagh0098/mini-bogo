import {
  runFunction,
  DiscountApplicationStrategy,
  FunctionRunResult,
} from '@shopify/shopify-function';

import {
  ProductVariant,
  Cart,
  Target,
  Discount,
} from '@shopify/functions/dist/cart/product-discount/api';

runFunction(
  async (input: Cart): Promise<FunctionRunResult> => {
    const triggerProductId = 'gid://shopify/Product/1234567890';
    const rewardProductId = 'gid://shopify/Product/9876543210';

    const triggerLine = input.cart.lines.find(line =>
      line.merchandise.product.id === triggerProductId
    );

    const rewardLine = input.cart.lines.find(line =>
      line.merchandise.product.id === rewardProductId
    );

    if (!triggerLine || !rewardLine) {
      return {
        discountApplicationStrategy: DiscountApplicationStrategy.First,
        discounts: [],
      };
    }

    const discount: Discount = {
      targets: [
        {
          productVariant: {
            id: rewardLine.merchandise.id,
          },
        },
      ],
      value: {
        percentage: {
          value: 100.0,
        },
      },
      message: 'BOGO: Free Product!',
    };

    return {
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [discount],
    };
  },
);
