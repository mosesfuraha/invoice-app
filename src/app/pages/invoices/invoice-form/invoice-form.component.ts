import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { InvoiceActions } from '../actions/invoice.types';
import { Invoice } from '../../../models/invoice';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css'],
})
export class InvoiceFormComponent implements OnInit {
  isDarkMode$: Observable<boolean>;
  invoiceForm!: FormGroup;
  @Output() formClose = new EventEmitter<void>();

  constructor(
    private store: Store<{ theme: { isDarkMode: boolean } }>,
    private formBuilder: FormBuilder
  ) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
  }

  ngOnInit() {
    this.invoiceForm = this.formBuilder.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postCode: ['', Validators.required],
      country: ['', Validators.required],
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      invoiceDate: ['', [Validators.required, this.dateValidator]],
      paymentTerms: ['', Validators.required],
      description: ['', Validators.required],
      items: this.formBuilder.array([]),
    });
  }

  createItemFormGroup(): FormGroup {
    return this.formBuilder.group({
      itemName: ['', Validators.required],
      qty: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      total: [{ value: '', disabled: true }],
    });
  }

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.createItemFormGroup());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      const formValue = this.invoiceForm.value;

      // Check the format of invoiceDate
      console.log('Invoice Date:', formValue.invoiceDate); // Should log in 'YYYY-MM-DD' format

      const invoice: Invoice = {
        id: this.generateUniqueId(),
        createdAt: this.formatDate(new Date()), // Use current date in YYYY-MM-DD format
        paymentDue: this.calculatePaymentDue(
          formValue.invoiceDate,
          formValue.paymentTerms
        ),
        description: formValue.description,
        paymentTerms: formValue.paymentTerms,
        clientName: formValue.clientName,
        clientEmail: formValue.clientEmail,
        status: 'pending',
        senderAddress: {
          street: formValue.street,
          city: formValue.city,
          postCode: formValue.postCode,
          country: formValue.country,
        },
        clientAddress: {
          street: '',
          city: '',
          postCode: '',
          country: '',
        },
        items: formValue.items.map((item: any) => ({
          name: item.itemName,
          quantity: item.qty,
          price: item.price,
          total: item.qty * item.price,
        })),
        total: this.calculateTotal(formValue.items),
      };

      this.store.dispatch(InvoiceActions.addInvoice({ invoice }));

      this.invoiceForm.reset();

      this.formClose.emit();
    } else {
      this.markFormGroupTouched(this.invoiceForm);
    }
  }

  private calculatePaymentDue(
    invoiceDate: string,
    paymentTerms: string
  ): string {
    // Convert payment terms to a number, default to 0 if conversion fails
    const terms = parseInt(paymentTerms.replace(/\D/g, ''), 10) || 0;

    // Create a date object from the invoice date string
    const date = new Date(invoiceDate);
    if (isNaN(date.getTime())) {
      console.error('Invalid invoice date:', invoiceDate);
      return ''; // Return an empty string or handle the error as needed
    }

    // Add the payment terms to the invoice date
    date.setDate(date.getDate() + terms);

    // Format the new date in YYYY-MM-DD format
    return this.formatDate(date);
  }

  private calculateTotal(items: any[]): number {
    return items.reduce((sum, item) => sum + item.qty * item.price, 0);
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  generateUniqueId(): string {
    return 'ID' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private dateValidator(control: { value: string }) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(control.value) ? null : { invalidDate: true };
  }
}
