import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InvoiceService } from '../../../services/invoice.service';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { InvoiceActions } from './invoice.types';
import { select, Store } from '@ngrx/store';
import * as fromInvoice from './invoice.selectors';
import { Invoice } from '../../../models/invoice';

@Injectable()
export class InvoiceEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private invoiceService = inject(InvoiceService);

  loadInvoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.loadAllInvoices),
      switchMap(() =>
        this.invoiceService.findAllInvoices().pipe(
          map((invoices) =>
            InvoiceActions.allInvoicesLoaded({
              invoices: this.formatIds(invoices),
            })
          ),
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
      withLatestFrom(this.store.select(fromInvoice.getAllInvoices)),
      switchMap(([action, invoices]) => {
        const formattedInvoices = this.formatIds(invoices);
        const newId = this.generateUniqueId(formattedInvoices);
        const newInvoice: Invoice = { ...action.invoice, id: newId };

        return this.invoiceService.addInvoice(newInvoice).pipe(
          map(() => InvoiceActions.addInvoiceSuccess({ invoice: newInvoice })),
          catchError((error) =>
            of(InvoiceActions.addInvoiceFailure({ error: error.message }))
          )
        );
      })
    )
  );

  getInvoiceById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.getInvoiceById),
      switchMap((action) =>
        this.invoiceService.getInvoiceById(action.id).pipe(
          map((invoice) => {
            if (invoice) {
              return InvoiceActions.getInvoiceByIdSuccess({
                invoice: this.formatId(invoice),
              });
            } else {
              return InvoiceActions.getInvoiceByIdFailure({
                error: 'Invoice not found',
              });
            }
          }),
          catchError((error) =>
            of(InvoiceActions.getInvoiceByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  editInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.editInvoice),
      withLatestFrom(this.store.pipe(select(fromInvoice.getInvoiceEntities))),
      switchMap(([action, entities]) => {
        const { invoice } = action;
        const existingInvoice = entities[invoice.id];
        if (existingInvoice) {
          const updatedInvoice: Invoice = {
            ...existingInvoice,
            ...invoice,
          };
          return of(
            InvoiceActions.editInvoiceSuccess({ invoice: updatedInvoice })
          );
        } else {
          return of(
            InvoiceActions.editInvoiceFailure({
              error: 'Invoice not found',
            })
          );
        }
      }),
      catchError((error) =>
        of(InvoiceActions.editInvoiceFailure({ error: error.message }))
      )
    )
  );

  private formatIds(invoices: Invoice[]): Invoice[] {
    return invoices.map((invoice) => this.formatId(invoice));
  }

  private formatId(invoice: Invoice): Invoice {
    if (!/^[A-Z]{2}\d{3}$/.test(invoice.id)) {
      invoice.id = this.generateInvoiceId();
    }
    return invoice;
  }

  private generateUniqueId(invoices: Invoice[]): string {
    const existingIds = invoices.map((inv) => inv.id);
    let newId: string;

    do {
      newId = this.generateInvoiceId();
    } while (existingIds.includes(newId));

    return newId;
  }

  private generateInvoiceId(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letterPart =
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length));
    const numberPart = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');

    return `${letterPart}${numberPart}`;
  }
}
