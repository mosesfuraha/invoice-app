import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'], // You can remove this if not using additional CSS
})
export class ModalComponent {
  cancel() {
    // Logic to close the modal or perform cancel action
    console.log('Cancel clicked');
  }

  delete() {
    // Logic to perform the delete action
    console.log('Delete clicked');
    // Add your delete logic here
  }

  closeModal() {
    // Optional: Logic to close the modal when clicking outside
    console.log('Modal closed');
  }
}
