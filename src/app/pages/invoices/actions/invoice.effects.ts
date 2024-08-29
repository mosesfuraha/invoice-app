import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InvoiceService } from '../../../services/invoice.service';
import { InvoiceActions } from './invoice.types';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class InvoiceEffects {
  constructor(
    private actions$: Actions,
    private invoiceService: InvoiceService
  ) {}

  loadInvoices$ = createEffect(() => {
    return new Observable<Action>((observer) => {
      this.actions$.subscribe((action) => {
        if (action.type === InvoiceActions.loadAllInvoices.type) {
          this.invoiceService.findAllInvoices().subscribe(
            (invoices) => {
              if (invoices) {
                observer.next(InvoiceActions.allInvoicesLoaded({ invoices }));
              } else {
                observer.next(
                  InvoiceActions.loadAllInvoicesFailure({
                    error: 'No invoices found',
                  })
                );
              }
            },
            (error) => {
              observer.next(InvoiceActions.loadAllInvoicesFailure({ error }));
            }
          );
        }
      });
    });
  });
}
