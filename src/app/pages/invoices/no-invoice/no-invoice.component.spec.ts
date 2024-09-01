import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoInvoiceComponent } from './no-invoice.component';

describe('NoInvoiceComponent', () => {
  let component: NoInvoiceComponent;
  let fixture: ComponentFixture<NoInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
