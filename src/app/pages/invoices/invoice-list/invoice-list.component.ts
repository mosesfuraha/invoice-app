import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Invoice } from '../../../models/invoice';
import { Store } from '@ngrx/store';
import {
  loadAllInvoices,
  allInvoicesLoaded,
} from '../actions/invoices.actions';
import * as fromInvoiceSelectors from '../actions/invoice.selectors';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css'],
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
            style({ transform: 'translateX(-50%)', opacity: 0, offset: 0 }), // Start from -50%
            style({
              transform: 'translateX(-10px)',
              opacity: 0.5,
              offset: 0.8,
            }), // Slide in slightly to -10px
            style({ transform: 'translateX(0)', opacity: 1, offset: 1 }), // Finish at 0
          ])
        ),
      ]),
      transition('in => out', [
        animate(
          '400ms ease-in-out',
          keyframes([
            style({ transform: 'translateX(0)', opacity: 1, offset: 0 }), // Start from 0
            style({
              transform: 'translateX(-10px)',
              opacity: 0.5,
              offset: 0.2,
            }), // Move slightly to -10px
            style({ transform: 'translateX(-50%)', opacity: 0, offset: 1 }), // End at -50%
          ])
        ),
      ]),
    ]),
  ],
})
export class InvoiceListComponent implements OnInit {
  isLargeScreen = true;
  isDarkMode$: Observable<boolean>;
  invoices$: Observable<Invoice[]>;
  filteredInvoices$: Observable<Invoice[]>;
  dropdownVisible = false;
  dropdownTimeoutId: any;
  showForm = false;

  private filterSubject = new BehaviorSubject<string[]>([]);

  selectedStatuses: { [key: string]: boolean } = {
    pending: false,
    paid: false,
    draft: false,
  };

  constructor(
    private store: Store<{
      theme: { isDarkMode: boolean };
      invoices: Invoice[];
    }>,
    private router: Router
  ) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);

    this.invoices$ = this.store.select(fromInvoiceSelectors.getAllInvoices);

    this.filteredInvoices$ = combineLatest([
      this.invoices$,
      this.filterSubject.asObservable(),
    ]).pipe(
      map(([invoices, selectedStatuses]) => {
        return selectedStatuses.length === 0
          ? invoices
          : invoices.filter((invoice) =>
              selectedStatuses.includes(invoice.status.toLowerCase())
            );
      })
    );
  }

  ngOnInit(): void {
    // Load invoices from local storage
    const invoicesFromLocalStorage = this.getInvoicesFromLocalStorage();

    if (invoicesFromLocalStorage.length > 0) {
      // If invoices exist in local storage, dispatch them to the store
      this.store.dispatch(
        allInvoicesLoaded({ invoices: invoicesFromLocalStorage })
      );
    } else {
      // If no invoices are found, dispatch the action to load from the service
      this.store.dispatch(loadAllInvoices());
    }

    this.updateSelectedStatuses();
  }

  // Method to get invoices from local storage
  private getInvoicesFromLocalStorage(): Invoice[] {
    const invoicesJson = localStorage.getItem('invoices');
    return invoicesJson ? JSON.parse(invoicesJson) : [];
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
    this.updateSelectedStatuses();
  }

  updateSelectedStatuses(): void {
    const selectedStatuses = Object.keys(this.selectedStatuses).filter(
      (key) => this.selectedStatuses[key]
    );
    this.filterSubject.next(selectedStatuses);
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  closeForm(): void {
    this.showForm = false;
  }

  navigateToDetail(invoiceId: string): void {
    this.router.navigate(['/invoice', invoiceId]);
  }

  trackByInvoiceId(index: number, invoice: Invoice): string {
    return invoice.id;
  }
}
