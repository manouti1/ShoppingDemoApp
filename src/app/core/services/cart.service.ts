import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CartItem } from '../interfaces/cart-item.interface';
import { APP_CONSTANTS } from '../constants/app.constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private readonly storageKey = APP_CONSTANTS.STORAGE_KEYS.CART;
  private readonly errorHandler = inject(ErrorHandlerService);

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    try {
      const savedCart = localStorage.getItem(this.storageKey);
      if (savedCart) {
        this.cartItems.next(JSON.parse(savedCart));
      }
    } catch (error) {
      this.errorHandler.handleError(error, 'Failed to load cart from storage');
    }
  }

  private saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      this.cartItems.next(items);
    } catch (error) {
      this.errorHandler.handleError(error, 'Failed to save cart to storage');
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable().pipe(
      catchError((error) => {
        this.errorHandler.handleError(error, 'Failed to get cart items');
        return throwError(() => error);
      })
    );
  }

  getCartItemCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems.subscribe({
        next: items => {
          try {
            observer.next(items.reduce((total, item) => total + item.quantity, 0));
          } catch (error) {
            this.errorHandler.handleError(error, 'Failed to calculate cart item count');
            observer.error(error);
          }
        },
        error: error => {
          this.errorHandler.handleError(error, 'Failed to get cart item count');
          observer.error(error);
        }
      });
    });
  }

  getCartTotal(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems.subscribe({
        next: items => {
          try {
            observer.next(items.reduce((total, item) => total + (item.price * item.quantity), 0));
          } catch (error) {
            this.errorHandler.handleError(error, 'Failed to calculate cart total');
            observer.error(error);
          }
        },
        error: error => {
          this.errorHandler.handleError(error, 'Failed to get cart total');
          observer.error(error);
        }
      });
    });
  }

  addToCart(item: CartItem): void {
    try {
      const currentItems = this.cartItems.value;
      const existingItem = currentItems.find(i => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += item.quantity;
        this.saveCart([...currentItems]);
        this.showNotification(`Updated quantity of ${item.name} in cart`);
      } else {
        this.saveCart([...currentItems, item]);
        this.showNotification(`Added ${item.name} to cart`);
      }
    } catch (error) {
      this.errorHandler.handleError(error, 'Failed to add item to cart');
    }
  }

  updateQuantity(itemId: number, quantity: number): void {
    try {
      const currentItems = this.cartItems.value;
      const item = currentItems.find(i => i.id === itemId);

      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(itemId);
        } else {
          item.quantity = quantity;
          this.saveCart([...currentItems]);
        }
      }
    } catch (error) {
      this.errorHandler.handleError(error, 'Failed to update item quantity');
    }
  }

  removeFromCart(itemId: number): void {
    try {
      const currentItems = this.cartItems.value;
      const item = currentItems.find(i => i.id === itemId);

      if (item) {
        this.saveCart(currentItems.filter(i => i.id !== itemId));
        this.showNotification(`Removed ${item.name} from cart`);
      }
    } catch (error) {
      this.errorHandler.handleError(error, 'Failed to remove item from cart');
    }
  }

  clearCart(): void {
    try {
      this.saveCart([]);
      this.showNotification('Cart cleared');
    } catch (error) {
      this.errorHandler.handleError(error, 'Failed to clear cart');
    }
  }

  private showNotification(message: string): void {
    try {
      this.errorHandler.handleError({ message }, message);
    } catch (error) {
      this.errorHandler.handleError(error, 'Failed to show notification');
    }
  }
}

