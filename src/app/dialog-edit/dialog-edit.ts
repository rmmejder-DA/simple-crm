import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { User } from '../../models/user.class';

/** Dialog component for editing user information. */
@Component({
  selector: 'app-dialog-edit',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatButtonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './dialog-edit.html',
  styleUrl: './dialog-edit.scss',
})
export class DialogEdit {
  user: User = new User();
  birthDate: Date = new Date();
  isLoading = false;

  private dialogRef = inject(MatDialogRef<DialogEdit>);

  /** Save user data and close dialog with result. */
  async save(): Promise<void> {
    this.isLoading = true;
    this.user.birthDate = this.birthDate.getTime();
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.dialogRef.close(this.user);
  }

  /** Close dialog without saving. */
  cancel(): void {
    this.dialogRef.close();
  }
}
