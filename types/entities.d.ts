// src/types/entities.d.ts

export interface ProductEntity {
  name: string;
  price: number;
}

export interface OrderProduct {
  quantity: number;
  product: ProductEntity;
}

export interface OrderEntity {
  id: number;
  price: number;
  external_reference?: string;
  products: OrderProduct[];
  users_permissions_user: {
    id: number;
  };
}
