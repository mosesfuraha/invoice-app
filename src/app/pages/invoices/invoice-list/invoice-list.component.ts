import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, of, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { Router } from '@angular/router';
import { Invoice } from '../../../models/invoice';
import { Store } from '@ngrx/store';
import { loadAllInvoices } from '../actions/invoices.actions';

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
export class InvoiceListComponent implements OnInit {
  isDarkMode$: Observable<boolean>;
  filteredInvoices$: Observable<Invoice[]>;
  dropdownVisible = false;
  dropdownTimeoutId: any;
  showForm = false;

  private filterSubject = new BehaviorSubject<string[]>([]);
  private invoicesSubject = new BehaviorSubject<Invoice[]>([]);

  selectedStatuses: { [key: string]: boolean } = {
    pending: false,
    paid: false,
    draft: false,
  };

  constructor(
    private store: Store<{ theme: { isDarkMode: boolean } }>,
    private router: Router
  ) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);

    this.filteredInvoices$ = combineLatest([
      this.invoicesSubject.asObservable(),
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
     this.store.dispatch(loadAllInvoices());
    this.getInvoicesFromLocalStorage().subscribe((invoices) => {
      this.invoicesSubject.next(invoices);
    });

    this.updateSelectedStatuses();
  }

  getInvoicesFromLocalStorage(): Observable<Invoice[]> {
    const invoicesJson = localStorage.getItem('invoices');
    const invoices: Invoice[] = invoicesJson ? JSON.parse(invoicesJson) : [];
    return of(invoices);
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
