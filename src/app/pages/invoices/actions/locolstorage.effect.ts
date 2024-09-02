import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { InvoiceActions } from './invoice.types';
import * as fromInvoiceSelectors from './invoice.selectors';
import { Invoice } from '../../../models/invoice';

@Injectable()
export class LocalStorageSyncEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  syncInvoicesToLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          InvoiceActions.addInvoiceSuccess,
          InvoiceActions.editInvoiceSuccess,
          InvoiceActions.deleteInvoiceSuccess
        ),
        withLatestFrom(this.store.select(fromInvoiceSelectors.getAllInvoices)),
        tap(([action, invoices]) => {
          this.saveInvoicesToLocalStorage(invoices);
        })
      ),
    { dispatch: false }
  );

  private saveInvoicesToLocalStorage(invoices: Invoice[]): void {
    try {
      const serializedInvoices = JSON.stringify(invoices);
      localStorage.setItem('invoices', serializedInvoices);
      console.log('Invoices successfully synced to local storage:', invoices);
    } catch (error) {
      console.error('Failed to sync invoices to local storage:', error);
    }
  }
}
