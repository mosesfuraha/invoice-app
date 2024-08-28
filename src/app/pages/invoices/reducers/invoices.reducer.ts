import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Invoice } from '../../../models/invoice';
import { InvoiceActions } from '../actions/invoice.types';

export interface InvoiceState extends EntityState<Invoice> {}

export const adapter = createEntityAdapter<Invoice>();

export const initialInvoiceState = adapter.getInitialState();

export const invoiceReducer = createReducer(
  initialInvoiceState,
  on(InvoiceActions.allInvoicesLoaded, (state, action) =>
    adapter.setAll(action.invoices, state)
  ),
  on(InvoiceActions.loadAllInvoicesFailure, (state, action) => {
    console.error('Failed to load invoices:', action.error);
    return state;
  })
);

export const { selectAll } = adapter.getSelectors();
