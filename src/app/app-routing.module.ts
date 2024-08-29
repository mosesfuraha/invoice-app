import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { InvoiceFormComponent } from './pages/invoices/invoice-form/invoice-form.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'form', component: InvoiceFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
