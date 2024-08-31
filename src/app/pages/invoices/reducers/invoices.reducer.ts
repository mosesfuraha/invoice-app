import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Invoice } from '../../../models/invoice';
import { InvoiceActions } from '../actions/invoice.types';

export interface InvoiceState extends EntityState<Invoice> {
  loading: boolean;
  error: string | null;
  selectedInvoiceId: string | null;
}

export const adapter = createEntityAdapter<Invoice>();

export const initialInvoiceState: InvoiceState = adapter.getInitialState({
  loading: false,
  error: null,
  selectedInvoiceId: null,
});

export const invoiceReducer = createReducer(
  initialInvoiceState,

  on(InvoiceActions.loadAllInvoices, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(InvoiceActions.allInvoicesLoaded, (state, { invoices }) =>
    adapter.setAll(invoices, { ...state, loading: false, error: null })
  ),

  on(InvoiceActions.loadAllInvoicesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(InvoiceActions.addInvoice, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(InvoiceActions.addInvoiceSuccess, (state, { invoice }) =>
    adapter.addOne(invoice, { ...state, loading: false, error: null })
  ),

  on(InvoiceActions.addInvoiceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(InvoiceActions.getInvoiceById, (state, { id }) => ({
    ...state,
    loading: true,
    error: null,
    selectedInvoiceId: id,
  })),

  on(InvoiceActions.getInvoiceByIdSuccess, (state, { invoice }) =>
    adapter.upsertOne(invoice, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(InvoiceActions.getInvoiceByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    selectedInvoiceId: null,
  }))
);

export const { selectIds, selectEntities, selectAll, selectTotal } =
  adapter.getSelectors();

export const selectSelectedInvoiceId = (state: InvoiceState) =>
  state.selectedInvoiceId;

