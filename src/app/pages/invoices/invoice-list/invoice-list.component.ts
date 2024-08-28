import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

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
  filteredInvoices$!: Observable<Invoice[]>;
  dropdownVisible = false;
  dropdownTimeoutId: any;

  selectedStatuses: { [key: string]: boolean } = {
    pending: false,
    paid: false,
    draft: false,
  };

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

    this.filteredInvoices$ = this.invoices$;
  }

  showDropdown(): void {
    clearTimeout(this.dropdownTimeoutId);
    this.dropdownVisible = true;
  }

  hideDropdownWithDelay(): void {
    this.dropdownTimeoutId = setTimeout(() => {
      this.dropdownVisible = false;
    }, 300);
  }

  toggleStatus(status: string): void {
    this.selectedStatuses[status] = !this.selectedStatuses[status];

    this.filteredInvoices$ = combineLatest([this.invoices$]).pipe(
      map(([invoices]) => {
        const selectedStatuses = Object.keys(this.selectedStatuses).filter(
          (key) => this.selectedStatuses[key]
        );

        if (selectedStatuses.length === 0) {
          return invoices;
        }

        return invoices.filter((invoice) =>
          selectedStatuses.includes(invoice.status.toLowerCase())
        );
      })
    );
  }
}
