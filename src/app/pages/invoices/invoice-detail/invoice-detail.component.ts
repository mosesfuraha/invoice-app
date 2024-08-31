import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of } from 'rxjs';
import { Invoice } from '../../../models/invoice';
import { InvoiceState } from '../reducers/invoices.reducer';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import * as fromInvoiceSelectors from '../actions/invoice.selectors';
import { InvoiceActions } from '../actions/invoice.types';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
      state(
        'out',
        style({
          transform: 'translateX(-100%)',
          opacity: 0,
        })
      ),
      transition('out => in', [
        animate(
          '500ms ease-in-out',
          keyframes([
            style({ transform: 'translateX(-100%)', opacity: 0, offset: 0 }),
            style({ transform: 'translateX(10px)', opacity: 0.5, offset: 0.8 }),
            style({ transform: 'translateX(0)', opacity: 1, offset: 1 }),
          ])
        ),
      ]),
      transition('in => out', [
        animate(
          '400ms ease-in-out',
          keyframes([
            style({ transform: 'translateX(0)', opacity: 1, offset: 0 }),
            style({
              transform: 'translateX(-10px)',
              opacity: 0.5,
              offset: 0.2,
            }),
            style({ transform: 'translateX(-100%)', opacity: 0, offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class InvoiceDetailComponent implements OnInit, OnDestroy {
  invoice$: Observable<Invoice | undefined> | undefined;
  isDarkMode$: Observable<boolean>;
  showForm = false;
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

    if (invoiceId) {
      const localStorageKey = `fetchedInvoice_${invoiceId}`;
      const savedInvoice = localStorage.getItem(localStorageKey);

      if (savedInvoice) {
        this.invoice$ = of(JSON.parse(savedInvoice) as Invoice);
      } else {
        this.store.dispatch(InvoiceActions.getInvoiceById({ id: invoiceId }));

        this.invoice$ = this.store.select(
          fromInvoiceSelectors.getInvoiceById(invoiceId)
        );

        this.subscription = this.invoice$.subscribe((invoice) => {
          if (invoice) {
            localStorage.setItem(localStorageKey, JSON.stringify(invoice));
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }
  closeForm(): void {
    this.showForm = false;
  }

  handleEditForm(updatedInvoice: Invoice): void {
    this.store.dispatch(
      InvoiceActions.editInvoice({ invoice: updatedInvoice })
    );
  }
}
