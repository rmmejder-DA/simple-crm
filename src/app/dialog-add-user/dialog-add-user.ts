import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogContent, MatDialogActions, MatDialogTitle, MatDialogClose } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../models/user.class';

@Component({
  selector: 'app-dialog-add-user',
  imports: [FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatDialogClose,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule],
  templateUrl: './dialog-add-user.html',
  styleUrl: './dialog-add-user.scss',
})
export class DialogAddUser {
  user = new User();

  cancel(): string {
    return '';
  }
  animal(): string {
    return '';
  }
}
