import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  InvoiceState,
  selectAll,
  selectEntities,
} from '../reducers/invoices.reducer';
import { Invoice } from '../../../models/invoice';

export const getInvoiceState = createFeatureSelector<InvoiceState>('invoices');

export const getInvoiceEntities = createSelector(
  getInvoiceState,
  selectEntities
);

export const getAllInvoices = createSelector(getInvoiceState, selectAll);

export const getInvoiceLoading = createSelector(
  getInvoiceState,
  (state) => state.loading
);

export const getInvoiceError = createSelector(
  getInvoiceState,
  (state) => state.error
);

export const getInvoiceById = (id: string) =>
  createSelector(getInvoiceEntities, (entities) => entities[id]);
export function selectEntityById(selectEntityById: any, arg1: { id: any; }): import("rxjs").OperatorFunction<any, unknown> {
  throw new Error('Function not implemented.');
}

