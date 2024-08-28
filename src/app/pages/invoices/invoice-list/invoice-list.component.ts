import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Invoice } from '../../../models/invoice';
import { loadAllInvoices } from '../actions/invoices.actions';
import { InvoiceState, selectAll } from '../reducers/invoices.reducer';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css'],
})
export class InvoiceListComponent implements OnInit {
  isDarkMode$!: Observable<boolean>;
  invoices$!: Observable<Invoice[]>;

  constructor(
    private store: Store<{
      theme: { isDarkMode: boolean };
      invoices: InvoiceState;
    }>
  ) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
    this.invoices$ = this.store.select((state) => selectAll(state.invoices));
  }

  ngOnInit(): void {
    this.store.dispatch(loadAllInvoices());
  }
}
