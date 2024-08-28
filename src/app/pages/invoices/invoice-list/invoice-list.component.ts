import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css'],
})
export class InvoiceListComponent {
  isDarkMode$!: Observable<boolean>;

  constructor(private store: Store<{ theme: { isDarkMode: boolean } }>) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
  }
}
