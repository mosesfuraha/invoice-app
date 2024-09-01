import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of } from 'rxjs';
import { switchMap, map, filter } from 'rxjs/operators';
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
  showDeleteModal = false;
  private subscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<{
      theme: { isDarkMode: boolean };
      invoices: InvoiceState;
    }>
  ) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
  }

  ngOnInit(): void {
    this.invoice$ = this.route.params.pipe(
      switchMap((params) => {
        const invoiceId = params['id'];
        if (invoiceId) {
          // Dispatch the action to load the invoice
          this.store.dispatch(InvoiceActions.getInvoiceById({ id: invoiceId }));

          // Select the invoice from the store
          return this.store
            .select(fromInvoiceSelectors.getInvoiceById(invoiceId))
            .pipe(
              filter((invoice) => !!invoice) // Ensure that the invoice is available
            );
        } else {
          return of(undefined); // Handle undefined case
        }
      })
    );
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

    this.closeForm();
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  deleteInvoiceById(): void {
    if (this.invoice$) {
      this.invoice$.subscribe((invoice) => {
        if (invoice && invoice.id) {
          this.store.dispatch(InvoiceActions.deleteInvoice({ id: invoice.id }));

          this.closeDeleteModal();
          this.router.navigate(['/']);
        }
      });
    }
  }
}
