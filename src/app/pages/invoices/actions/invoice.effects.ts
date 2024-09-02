import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { InvoiceActions } from './invoice.types';
import { Store } from '@ngrx/store';
import * as fromInvoiceSelectors from './invoice.selectors';
import { Invoice } from '../../../models/invoice';
import { InvoiceService } from '../../../services/invoice.service';

@Injectable()
export class InvoiceEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private invoiceService = inject(InvoiceService);

  loadInvoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.loadAllInvoices),
      switchMap(() => {
        return this.invoiceService.findAllInvoices().pipe(
          map((invoices) => {
            console.log('Fetched Invoices:', invoices);

            this.saveInvoicesToLocalStorage(invoices);

            return InvoiceActions.allInvoicesLoaded({ invoices });
          }),
          catchError((error) =>
            of(InvoiceActions.loadAllInvoicesFailure({ error: error.message }))
          )
        );
      })
    )
  );

  createInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.addInvoice),
      switchMap((action) => {
        const newInvoice: Invoice = {
          ...action.invoice,
          id: this.generateUniqueId(),
        };
        console.log('Adding new Invoice:', newInvoice);
        return of(InvoiceActions.addInvoiceSuccess({ invoice: newInvoice }));
      }),
      catchError((error) =>
        of(InvoiceActions.addInvoiceFailure({ error: error.message }))
      )
    )
  );

  getInvoiceById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.getInvoiceById),
      withLatestFrom(
        this.store.select(fromInvoiceSelectors.getInvoiceEntities)
      ),
      map(([action, entities]) => {
        const invoice = entities[action.id];
        if (invoice) {
          return InvoiceActions.getInvoiceByIdSuccess({
            invoice: this.formatId(invoice),
          });
        } else {
          console.error('Invoice not found:', action.id);
          return InvoiceActions.getInvoiceByIdFailure({
            error: 'Invoice not found',
          });
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
      withLatestFrom(
        this.store.select(fromInvoiceSelectors.getInvoiceEntities)
      ),
      switchMap(([action, entities]) => {
        const existingInvoice = entities[action.invoice.id];
        if (existingInvoice) {
          const updatedInvoice = { ...existingInvoice, ...action.invoice };
          console.log('Editing Invoice:', updatedInvoice);
          return of(
            InvoiceActions.editInvoiceSuccess({ invoice: updatedInvoice })
          );
        } else {
          console.error('Invoice not found for editing:', action.invoice.id);
          return of(
            InvoiceActions.editInvoiceFailure({
              error: 'Invoice not found in state',
            })
          );
        }
      }),
      catchError((error) =>
        of(InvoiceActions.editInvoiceFailure({ error: error.message }))
      )
    )
  );

  // Delete an invoice from the store
  deleteInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.deleteInvoice),
      withLatestFrom(
        this.store.select(fromInvoiceSelectors.getInvoiceEntities)
      ),
      switchMap(([action, entities]) => {
        if (entities[action.id]) {
          return of(InvoiceActions.deleteInvoiceSuccess({ id: action.id }));
        } else {
          console.error('Invoice not found for deletion:', action.id);
          return of(
            InvoiceActions.deleteInvoiceFailure({
              error: 'Invoice not found in state',
            })
          );
        }
      }),
      catchError((error) =>
        of(InvoiceActions.deleteInvoiceFailure({ error: error.message }))
      )
    )
  );

  // Sync the state with local storage whenever state changes occur
  syncLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          InvoiceActions.addInvoiceSuccess,
          InvoiceActions.editInvoiceSuccess,
          InvoiceActions.deleteInvoiceSuccess
        ),
        withLatestFrom(this.store.select(fromInvoiceSelectors.getAllInvoices)),
        tap(([action, invoices]) => {
          console.log('Syncing with local storage:', invoices);
          this.saveInvoicesToLocalStorage(invoices); // Sync local storage
        })
      ),
    { dispatch: false }
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

  private generateUniqueId(): string {
    const existingIds = this.getInvoicesFromLocalStorage().map((inv) => inv.id);
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
