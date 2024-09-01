import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvoiceListComponent } from './pages/invoices/invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './pages/invoices/invoice-detail/invoice-detail.component';
import { NoInvoiceComponent } from './pages/invoices/no-invoice/no-invoice.component';

const routes: Routes = [
  { path: '', component: InvoiceListComponent },
  { path: 'empty', component: NoInvoiceComponent },
  { path: 'invoice/:id', component: InvoiceDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
