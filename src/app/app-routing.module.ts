import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvoiceListComponent } from './pages/invoices/invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './pages/invoices/invoice-detail/invoice-detail.component';

const routes: Routes = [
  { path: '', component: InvoiceListComponent },
  { path: 'invoice/:id', component: InvoiceDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
