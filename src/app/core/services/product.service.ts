import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../interfaces/product.interface';
import { APP_CONSTANTS } from '../constants/app.constants';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly errorHandler = inject(ErrorHandlerService);

  private products: Product[] = [];

  constructor() {
    this.generateProducts();
  }

  private generateProducts(): void {
    const categories = [
      'Electronics',
      'Clothing',
      'Books',
      'Home',
      'Sports',
      'Beauty',
      'Toys',
      'Food',
    ];
    const adjectives = [
      'Amazing',
      'Premium',
      'Deluxe',
      'Classic',
      'Modern',
      'Vintage',
      'Professional',
      'Luxury',
    ];
    const nouns = [
      'Product',
      'Item',
      'Goods',
      'Merchandise',
      'Article',
      'Commodity',
      'Ware',
      'Stock',
    ];

    for (let i = 1; i <= APP_CONSTANTS.PRODUCTS.TOTAL_COUNT; i++) {
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const adjective =
        adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];

      this.products.push({
        id: i,
        title: `${adjective} ${noun} ${i}`,
        price: +(Math.random() * 1000).toFixed(2),
        description: `This is a ${category.toLowerCase()} product. ${this.generateDescription()}`,
        category,
        image: `https://picsum.photos/seed/${i}/400/400`,
        rating: {
          rate: +(Math.random() * 5).toFixed(1),
          count: Math.floor(Math.random() * 1000),
        },
      });
    }
  }

  private generateDescription(): string {
    const descriptions = [
      'High quality materials used in production.',
      'Perfect for everyday use.',
      'Designed with comfort in mind.',
      'Built to last with premium craftsmanship.',
      'Innovative features for modern living.',
      'Elegant design meets functionality.',
      'Sustainable and eco-friendly materials.',
      'Engineered for optimal performance.',
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  getProducts(
    page: number = 1,
    pageSize: number = APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE
  ): Observable<{ products: Product[]; total: number }> {
    try {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedProducts = this.products.slice(start, end);

      return of({
        products: paginatedProducts,
        total: this.products.length,
      }).pipe(
        catchError((error) => {
          this.errorHandler.handleError(error, 'Failed to fetch products');
          return throwError(() => error);
        })
      );
    } catch (error) {
      this.errorHandler.handleError(error, 'Failed to fetch products');
      return throwError(() => error);
    }
  }

  getProductById(id: number): Observable<Product | undefined> {
    try {
      const product = this.products.find((p) => p.id === id);
      return of(product).pipe(
        catchError((error) => {
          this.errorHandler.handleError(error, 'Failed to fetch product details');
          return throwError(() => error);
        })
      );
    } catch (error) {
      this.errorHandler.handleError(error, 'Failed to fetch product details');
      return throwError(() => error);
    }
  }

  searchProducts(query: string): Observable<Product[]> {
    try {
      const searchTerm = query.toLowerCase();
      return of(
        this.products.filter(
          (product) =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        )
      ).pipe(
        catchError((error) => {
          this.errorHandler.handleError(error, 'Failed to search products');
          return throwError(() => error);
        })
      );
    } catch (error) {
      this.errorHandler.handleError(error, 'Failed to search products');
      return throwError(() => error);
    }
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    try {
      return of(
        this.products.filter(
          (product) => product.category.toLowerCase() === category.toLowerCase()
        )
      ).pipe(
        catchError((error) => {
          this.errorHandler.handleError(error, 'Failed to fetch products by category');
          return throwError(() => error);
        })
      );
    } catch (error) {
      this.errorHandler.handleError(error, 'Failed to fetch products by category');
      return throwError(() => error);
    }
  }
}
