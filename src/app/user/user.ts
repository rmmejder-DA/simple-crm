import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { CollectionReference, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { DialogAddUser } from '../dialog-add-user/dialog-add-user';
import { User } from '../../models/user.class';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  imports: [MatButtonModule, MatTooltipModule, AsyncPipe, MatCardModule, CommonModule, DatePipe, RouterLink],
  templateUrl: './user.html',
  styleUrl: './user.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UserComponent implements OnInit, OnDestroy {
  firestore = inject(Firestore);
  cdr = inject(ChangeDetectorRef);
  allUsers: User[] = [];
  users$ = this.loadUsers();
  private destroy$ = new Subject<void>();

  constructor(public dialog: MatDialog) {}

  private loadUsers() {
    const userCollection = collection(this.firestore, 'users') as CollectionReference<User>;
    return collectionData(userCollection, { idField: 'id' });
  }

  ngOnInit() {
    this.users$
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: User[]) => {
        this.allUsers = users.map(user => new User(user));
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addUser() {
    this.dialog.open(DialogAddUser);
  }

  trackByUserId(index: number, user: User): string | undefined {
    return user.id;
  }
}
