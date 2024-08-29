import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InvoiceService } from '../../../services/invoice.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { InvoiceActions } from './invoice.types';

@Injectable()
export class InvoiceEffects {
  private actions$ = inject(Actions);

  constructor(private invoiceService: InvoiceService) {}

  loadInvoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.loadAllInvoices),
      switchMap(() =>
        this.invoiceService.findAllInvoices().pipe(
          map((invoices) => InvoiceActions.allInvoicesLoaded({ invoices })),
          catchError((error) =>
            of(InvoiceActions.loadAllInvoicesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.addInvoice),
      switchMap((action) =>
        this.invoiceService.addInvoice(action.invoice).pipe(
          map((invoice) => InvoiceActions.addInvoiceSuccess({ invoice })),
          catchError((error) =>
            of(InvoiceActions.addInvoiceFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
