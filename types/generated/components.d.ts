import type { Struct, Schema } from '@strapi/strapi';

export interface BasicsOrderProduct extends Struct.ComponentSchema {
  collectionName: 'components_basics_order_products';
  info: {
    displayName: 'order-product';
    icon: 'cup';
  };
  attributes: {
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    quantity: Schema.Attribute.Integer;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'basics.order-product': BasicsOrderProduct;
    }
  }
}
