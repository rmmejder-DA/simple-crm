import { Component, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogContent, MatDialogActions, MatDialogTitle, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dialog-add-user',
  imports: [CommonModule, FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatDialogClose,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressBarModule],
  templateUrl: './dialog-add-user.html',
  styleUrl: './dialog-add-user.scss',
})

export class DialogAddUser {
  user = new User();
  firestore = inject(Firestore);
  dialogRef = inject(MatDialogRef<DialogAddUser>);
  injector = inject(EnvironmentInjector);

  constructor() {
    this.birthDate = new Date();
  }
  birthDate: Date;
  isLoading = false;

  async save() {
    this.isLoading = true;
    this.user.birthDate = this.birthDate.getTime();
    const { id, ...userData } = this.user;
    try {
      await runInInjectionContext(this.injector, () =>
        addDoc(collection(this.firestore, 'users'), userData)
      );
      console.log('user added', this.user);
      // 2 Sekunden warten, dann Dialog schließen
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.dialogRef.close();
    } catch (error) {
      console.error('Fehler beim Speichern in Firestore:', error);
      this.isLoading = false;
    }
  }
}
