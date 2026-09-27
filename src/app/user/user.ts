import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogAddUser } from '../dialog-add-user/dialog-add-user';
import { User } from '../../models/user.class';

@Component({
  selector: 'app-user',
  imports: [MatButtonModule, MatTooltipModule],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class UserComponent {
  user = new User();
  constructor(public dialog: MatDialog) {
     
  }

  addUser() {
    this.dialog.open(DialogAddUser);
  }
}
