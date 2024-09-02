import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
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
          transform: 'translateX(-50%)',
          opacity: 0,
        })
      ),
      state(
        'static',
        style({
          transform: 'none',
          opacity: 1,
        })
      ),
      transition('out => in', [
        animate(
          '500ms ease-in-out',
          keyframes([
            style({ transform: 'translateX(-50%)', opacity: 0, offset: 0 }), 
            style({
              transform: 'translateX(-10px)',
              opacity: 0.5,
              offset: 0.8,
            }), 
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
            style({ transform: 'translateX(-50%)', opacity: 0, offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class InvoiceDetailComponent implements OnInit, OnDestroy {
  isLargeScreen = true;
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
    this.checkScreenSize();
    this.invoice$ = this.route.params.pipe(
      switchMap((params) => {
        const invoiceId = params['id'];
        if (invoiceId) {
          this.store.dispatch(InvoiceActions.getInvoiceById({ id: invoiceId }));

          return this.store
            .select(fromInvoiceSelectors.getInvoiceById(invoiceId))
            .pipe(filter((invoice) => !!invoice));
        } else {
          return of(undefined);
        }
      })
    );
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 768;
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
  markAsPaid(invoiceId: string): void {
    if (this.invoice$) {
      this.invoice$.subscribe((invoice) => {
        if (invoice && invoice.id === invoiceId && invoice.status !== 'paid') {
          const updatedInvoice = {
            ...invoice,
            status: 'paid',
          };
          this.store.dispatch(
            InvoiceActions.editInvoice({ invoice: updatedInvoice })
          );
        }
      });
    }
  }
}
