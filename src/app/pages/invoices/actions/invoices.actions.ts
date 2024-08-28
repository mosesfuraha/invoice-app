import { createAction, props } from '@ngrx/store';
import { Invoice } from '../../../models/invoice';

export const loadAllInvoices = createAction('[Invoices] Load All Invoices');
export const allInvoicesLoaded = createAction(
  '[Invoices] All Invoices Loaded',
  props<{ invoices: Invoice[] }>()
);
export const loadAllInvoicesFailure = createAction(
  '[Invoices] Load All Invoices Failure',
  props<{ error: any }>()
);
