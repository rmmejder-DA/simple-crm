import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CollectionReference, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { DialogAddUser } from '../dialog-add-user/dialog-add-user';
import { User } from '../../models/user.class';

@Component({
  selector: 'app-user',
  imports: [MatButtonModule, MatTooltipModule, AsyncPipe],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})

export class UserComponent {
  user = new User();
  firestore = inject(Firestore);
  userCollection = collection(this.firestore, 'users') as CollectionReference<User>;
  users$ = collectionData(this.userCollection, { idField: 'id' });

  constructor(public dialog: MatDialog) {
     
  }

  addUser() {
    this.dialog.open(DialogAddUser);
  }
}
