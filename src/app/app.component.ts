import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ThemeActions from './theme/theme.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isDarkMode$: Observable<boolean>;

  constructor(private store: Store<{ theme: { isDarkMode: boolean } }>) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('isDarkMode');
    const isDarkMode = savedTheme ? JSON.parse(savedTheme) : false;

    this.store.dispatch(ThemeActions.setInitialTheme({ isDarkMode }));
  }
}
