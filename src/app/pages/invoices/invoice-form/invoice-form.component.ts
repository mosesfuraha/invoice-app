import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css'],
})
export class InvoiceFormComponent {
  isDarkMode$: Observable<boolean>;

  constructor(private store: Store<{ theme: { isDarkMode: boolean } }>) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
  }
}
