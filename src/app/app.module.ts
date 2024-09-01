import { NgModule, isDevMode } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvoiceListComponent } from './pages/invoices/invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './pages/invoices/invoice-detail/invoice-detail.component';
import { InvoiceFormComponent } from './pages/invoices/invoice-form/invoice-form.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ThemeEffects } from './theme/theme.effects';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import { themeReducer } from './theme/theme.reducer';
import { invoiceReducer } from './pages/invoices/reducers/invoices.reducer';
import { InvoiceEffects } from './pages/invoices/actions/invoice.effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalComponent } from './pages/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    InvoiceListComponent,
    InvoiceDetailComponent,
    InvoiceFormComponent,
    SidebarComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({
      theme: themeReducer,
      invoices: invoiceReducer,
    }),
    EffectsModule.forRoot([ThemeEffects, InvoiceEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
