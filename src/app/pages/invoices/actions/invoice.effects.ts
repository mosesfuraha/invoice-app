import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  switchMap,
  withLatestFrom,
  tap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { InvoiceActions } from './invoice.types';
import { select, Store } from '@ngrx/store';
import * as fromInvoice from './invoice.selectors';
import { Invoice } from '../../../models/invoice';

@Injectable()
export class InvoiceEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  loadInvoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.loadAllInvoices),
      switchMap(() =>
        of(this.getInvoicesFromLocalStorage()).pipe(
          map((invoices) =>
            InvoiceActions.allInvoicesLoaded({
              invoices: this.formatIds(invoices),
            })
          ),
          tap((action) => this.saveInvoicesToLocalStorage(action.invoices)),
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

        const existingInvoices = this.getInvoicesFromLocalStorage();
        const updatedInvoices = [...existingInvoices, newInvoice];
        this.saveInvoicesToLocalStorage(updatedInvoices);

        return of(
          InvoiceActions.addInvoiceSuccess({ invoice: newInvoice })
        ).pipe(
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
      switchMap((action) => {
        const invoices = this.getInvoicesFromLocalStorage();
        const invoice = invoices.find((inv) => inv.id === action.id);

        if (invoice) {
          return of(
            InvoiceActions.getInvoiceByIdSuccess({
              invoice: this.formatId(invoice),
            })
          );
        } else {
          return of(
            InvoiceActions.getInvoiceByIdFailure({
              error: 'Invoice not found in local storage',
            })
          );
        }
      }),
      catchError((error) =>
        of(InvoiceActions.getInvoiceByIdFailure({ error: error.message }))
      )
    )
  );

  editInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.editInvoice),
      switchMap((action) => {
        const { invoice } = action;

        const invoices = this.getInvoicesFromLocalStorage();

        const existingInvoice = invoices.find((inv) => inv.id === invoice.id);

        if (existingInvoice) {
          const updatedInvoice: Invoice = { ...existingInvoice, ...invoice };

          const updatedInvoices = invoices.map((inv) =>
            inv.id === updatedInvoice.id ? updatedInvoice : inv
          );

          this.saveInvoicesToLocalStorage(updatedInvoices);

          return of(
            InvoiceActions.editInvoiceSuccess({ invoice: updatedInvoice })
          );
        } else {
          // Dispatch failure action if the invoice is not found
          return of(
            InvoiceActions.editInvoiceFailure({
              error: 'Invoice not found in local storage',
            })
          );
        }
      }),
      catchError((error) =>
        of(InvoiceActions.editInvoiceFailure({ error: error.message }))
      )
    )
  );
  deleteInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.deleteInvoice),
      switchMap((action) => {
        const invoices = this.getInvoicesFromLocalStorage();
        const updatedInvoices = invoices.filter(
          (invoice) => invoice.id !== action.id
        );

        if (invoices.length !== updatedInvoices.length) {
          this.saveInvoicesToLocalStorage(updatedInvoices);
          return of(InvoiceActions.deleteInvoiceSuccess({ id: action.id }));
        } else {
          return of(
            InvoiceActions.deleteInvoiceFailure({
              error: 'Invoice not found in local storage',
            })
          );
        }
      }),
      catchError((error) =>
        of(InvoiceActions.deleteInvoiceFailure({ error: error.message }))
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

  private saveInvoicesToLocalStorage(invoices: Invoice[]): void {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }

  private getInvoicesFromLocalStorage(): Invoice[] {
    const invoicesJson = localStorage.getItem('invoices');
    return invoicesJson ? JSON.parse(invoicesJson) : [];
  }
}
