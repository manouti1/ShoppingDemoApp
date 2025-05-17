export const APP_CONSTANTS = {
  STORAGE_KEYS: {
    CART: 'cart'
  },
  SNACKBAR: {
    DURATION: 3000,
    HORIZONTAL_POSITION: 'end' as const,
    VERTICAL_POSITION: 'top' as const
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12 as number,
    PAGE_SIZE_OPTIONS: [12, 24, 36, 48] as number[]
  },
  PRODUCTS: {
    TOTAL_COUNT: 10000
  }
} as const;
