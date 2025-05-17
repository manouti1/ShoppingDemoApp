export const API_CONSTANTS = {
  BASE_URL: 'https://fakestoreapi.com',
  ENDPOINTS: {
    PRODUCTS: '/products',
    PRODUCT: (id: number) => `/products/${id}`
  }
} as const;
