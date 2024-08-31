import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
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
  editInvoice(invoice: Invoice): Observable<Invoice | undefined> {
    return this.http.get<Invoice[]>(this.dataUrl).pipe(
      map((invoices) => {
        const index = invoices.findIndex((inv) => inv.id === invoice.id);
        if (index === -1) {
          throw new Error('Invoice not found');
        }

        invoices[index] = { ...invoices[index], ...invoice };
        return invoices[index];
      }),
      catchError((error) => {
        console.error('Error editing invoice', error);
        return of(undefined);
      })
    );
  }
}
