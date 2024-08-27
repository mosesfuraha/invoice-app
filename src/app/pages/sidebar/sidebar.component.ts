import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ThemeActions from '../../theme/theme.actions';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  isDarkMode$!: Observable<boolean>;

  constructor(private store: Store<{ theme: { isDarkMode: boolean } }>) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
  }

  toggleTheme() {
    this.store.dispatch(ThemeActions.toggleTheme());
  }
}
