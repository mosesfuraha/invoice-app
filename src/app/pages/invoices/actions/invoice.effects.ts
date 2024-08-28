import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { InvoiceService } from '../../../services/invoice.service';
import { InvoiceActions } from './invoice.types';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class InvoiceEffects {
  constructor(
    private actions$: Actions,
    private invoiceService: InvoiceService
  ) {}

  loadInvoices$ = createEffect((): Observable<Action> => {
    return new Observable((observer) => {
      this.actions$.subscribe((action: Action) => {
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
