import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InvoiceState, selectAll } from '../reducers/invoices.reducer';

export const getInvoiceState = createFeatureSelector<InvoiceState>('invoices');

export const getAllInvoices = createSelector(getInvoiceState, selectAll);

export const getInvoiceLoading = createSelector(
  getInvoiceState,
  (state) => state.loading
);
export const getInvoiceError = createSelector(
  getInvoiceState,
  (state) => state.error
);
