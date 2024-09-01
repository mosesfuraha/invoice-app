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
          localStorage.setItem('invoices', JSON.stringify(invoices));
        })
      ),
    { dispatch: false }
  );
}
