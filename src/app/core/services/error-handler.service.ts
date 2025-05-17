import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorMessage {
  message: string;
  action?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly DEFAULT_DURATION = 5000;

  handleError(error: unknown, customMessage?: string): void {
    console.error('An error occurred:', error);

    const errorMessage = this.getErrorMessage(error, customMessage);
    this.showErrorSnackBar(errorMessage);
  }

  private getErrorMessage(error: unknown, customMessage?: string): ErrorMessage {
    if (customMessage) {
      return {
        message: customMessage,
        action: 'Close',
        duration: this.DEFAULT_DURATION
      };
    }

    if (error instanceof HttpErrorResponse) {
      return this.handleHttpError(error);
    }

    if (error instanceof Error) {
      return {
        message: error.message || 'An unexpected error occurred',
        action: 'Close',
        duration: this.DEFAULT_DURATION
      };
    }

    return {
      message: 'An unexpected error occurred',
      action: 'Close',
      duration: this.DEFAULT_DURATION
    };
  }

  private handleHttpError(error: HttpErrorResponse): ErrorMessage {
    switch (error.status) {
      case 0:
        return {
          message: 'Unable to connect to the server. Please check your internet connection.',
          action: 'Close',
          duration: this.DEFAULT_DURATION
        };
      case 400:
        return {
          message: 'Invalid request. Please check your input.',
          action: 'Close',
          duration: this.DEFAULT_DURATION
        };
      case 401:
        return {
          message: 'You are not authorized to perform this action.',
          action: 'Close',
          duration: this.DEFAULT_DURATION
        };
      case 403:
        return {
          message: 'You do not have permission to perform this action.',
          action: 'Close',
          duration: this.DEFAULT_DURATION
        };
      case 404:
        return {
          message: 'The requested resource was not found.',
          action: 'Close',
          duration: this.DEFAULT_DURATION
        };
      case 500:
        return {
          message: 'An internal server error occurred. Please try again later.',
          action: 'Close',
          duration: this.DEFAULT_DURATION
        };
      default:
        return {
          message: error.message || 'An unexpected error occurred',
          action: 'Close',
          duration: this.DEFAULT_DURATION
        };
    }
  }

  private showErrorSnackBar(errorMessage: ErrorMessage): void {
    this.snackBar.open(
      errorMessage.message,
      errorMessage.action,
      {
        duration: errorMessage.duration,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      }
    );
  }
}
