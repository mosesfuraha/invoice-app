import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Invoice } from '../models/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private dataUrl = 'assets/data.json';

  constructor(private http: HttpClient) {}

  findAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.dataUrl);
  }

  addInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.dataUrl, invoice);
  }

  getInvoiceById(id: string): Observable<Invoice | undefined> {
    return this.http
      .get<Invoice[]>(this.dataUrl)
      .pipe(map((invoices) => invoices.find((invoice) => invoice.id === id)));
  }
}
