import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of } from 'rxjs';
import { Invoice } from '../../../models/invoice';
import { InvoiceState } from '../reducers/invoices.reducer';

import * as fromInvoiceSelectors from '../actions/invoice.selectors';
import { InvoiceActions } from '../actions/invoice.types';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css'],
})
export class InvoiceDetailComponent implements OnInit, OnDestroy {
  invoice$: Observable<Invoice | undefined> | undefined;
  isDarkMode$: Observable<boolean>;
  private subscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private store: Store<{
      theme: { isDarkMode: boolean };
      invoices: InvoiceState;
    }>
  ) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
  }

  ngOnInit(): void {
    const invoiceId = this.route.snapshot.paramMap.get('id');

    // Check if the invoice data exists in local storage
    const savedInvoice = localStorage.getItem('fetchedInvoice');
    if (savedInvoice) {
      // Use the data from local storage
      this.invoice$ = of(JSON.parse(savedInvoice) as Invoice);
    } else if (invoiceId) {
      // Fetch data from the store if not available in local storage
      this.store.dispatch(InvoiceActions.getInvoiceById({ id: invoiceId }));

      this.invoice$ = this.store.select(
        fromInvoiceSelectors.getInvoiceById(invoiceId)
      );

      // Save fetched data to local storage
      this.subscription = this.invoice$.subscribe((invoice) => {
        if (invoice) {
          localStorage.setItem('fetchedInvoice', JSON.stringify(invoice));
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
