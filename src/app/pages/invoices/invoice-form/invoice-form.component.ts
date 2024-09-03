import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() invoice: Invoice | null = null;
  @Input() isEditMode = false;
  isDarkMode$: Observable<boolean>;
  invoiceForm!: FormGroup;
  @Output() formClose = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<Invoice>();

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

    if (this.invoice) {
      this.getFormData(this.invoice);
    }
  }

  getFormData(invoice: Invoice) {
    this.invoiceForm.patchValue({
      street: invoice.senderAddress.street,
      city: invoice.senderAddress.city,
      postCode: invoice.senderAddress.postCode,
      country: invoice.senderAddress.country,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      invoiceDate: invoice.createdAt,
      paymentTerms: invoice.paymentTerms,
      description: invoice.description,
    });

    this.items.clear();
    invoice.items.forEach((item) => {
      const itemGroup = this.createItemFormGroup();
      itemGroup.patchValue({
        itemName: item.name,
        qty: item.quantity,
        price: item.price,
        total: item.total,
      });
      this.updateTotal(itemGroup); // Recalculate totals
      this.items.push(itemGroup);
    });
  }

  createItemFormGroup(): FormGroup {
    const group = this.formBuilder.group({
      itemName: ['', Validators.required],
      qty: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      total: [{ value: '', disabled: true }],
    });

    // Subscribe to changes in qty and price to dynamically calculate total
    group.get('qty')?.valueChanges.subscribe(() => this.updateTotal(group));
    group.get('price')?.valueChanges.subscribe(() => this.updateTotal(group));

    return group;
  }

  updateTotal(group: FormGroup) {
    const qty = group.get('qty')?.value || 0;
    const price = group.get('price')?.value || 0;
    group.get('total')?.setValue(qty * price, { emitEvent: false });
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

      const invoice: Invoice = {
        id: this.invoice ? this.invoice.id : this.generateUniqueId(),
        createdAt: this.invoice
          ? this.invoice.createdAt
          : this.formatDate(new Date()),
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

      if (this.isEditMode) {
        this.store.dispatch(InvoiceActions.editInvoice({ invoice }));
      } else {
        this.store.dispatch(InvoiceActions.addInvoice({ invoice }));
      }

      this.formSubmit.emit(invoice);
      this.formClose.emit();
    } else {
      this.markFormGroupTouched(this.invoiceForm);
    }
  }

  onSaveAsDraft() {
    const formValue = this.invoiceForm.value;

    const draftInvoice: Invoice = {
      id: this.generateUniqueId(),
      createdAt: this.formatDate(new Date()),
      paymentDue: this.calculatePaymentDue(
        formValue.invoiceDate || this.formatDate(new Date()),
        formValue.paymentTerms || 'net30'
      ),
      description: formValue.description || '',
      paymentTerms: formValue.paymentTerms || 'net30',
      clientName: formValue.clientName || '',
      clientEmail: formValue.clientEmail || '',
      status: 'draft',
      senderAddress: {
        street: formValue.street || '',
        city: formValue.city || '',
        postCode: formValue.postCode || '',
        country: formValue.country || '',
      },
      clientAddress: {
        street: '',
        city: '',
        postCode: '',
        country: '',
      },
      items: (formValue.items || []).map((item: any) => ({
        name: item.itemName || '',
        quantity: item.qty || 0,
        price: item.price || 0,
        total: (item.qty || 0) * (item.price || 0),
      })),
      total: this.calculateTotal(formValue.items || []),
    };

    this.store.dispatch(InvoiceActions.addInvoice({ invoice: draftInvoice }));
    this.formSubmit.emit(draftInvoice);
    this.formClose.emit();
  }

  private calculatePaymentDue(
    invoiceDate: string,
    paymentTerms: string
  ): string {
    const terms = parseInt(paymentTerms.replace(/\D/g, ''), 10) || 0;
    const date = new Date(invoiceDate);
    if (isNaN(date.getTime())) {
      return '';
    }

    date.setDate(date.getDate() + terms);
    return this.formatDate(date);
  }

  private calculateTotal(items: any[]): number {
    return items.reduce((sum, item) => sum + item.qty * item.price, 0);
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  private generateUniqueId(): string {
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
