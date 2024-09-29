import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Input() message: string = 'Êtes-vous sûr de vouloir continuer ?'; 
  @Output() confirmed = new EventEmitter<boolean>(); 

  confirm(): void {
    this.confirmed.emit(true);
  }

  cancel(): void {
    this.confirmed.emit(false);
  }
}

