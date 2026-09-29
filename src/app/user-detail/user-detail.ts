import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, EnvironmentInjector, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EMPTY, Observable, Subject } from 'rxjs';
import { runInInjectionContext } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogEdit } from '../dialog-edit/dialog-edit';

/** Component for displaying detailed user information. */
@Component({
  selector: 'app-user-detail',
  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetail implements OnInit, OnDestroy {
  firestore = inject(Firestore);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);
  dialog = inject(MatDialog);
  readonly injector = inject(EnvironmentInjector);

  loading = true;
  error: string | null = null;
  user$!: Observable<User>;
  currentUser: User | null = null;

  private destroy$ = new Subject<void>();

  /** Initialize component and load user data. */
  ngOnInit(): void {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params) => this.loadUserData(params.get('id'))),
      catchError((err) => this.handleError(err))
    );
    this.user$.subscribe();
  }

  /**
   * Load user data from Firestore.
   * @param userId - The user ID to load
   */
  private loadUserData(userId: string | null): Observable<User> {
    if (!userId) {
      this.setError('No user ID provided');
      return EMPTY;
    }
    this.setLoading(true);
    return runInInjectionContext(this.injector, () =>
      docData(doc(this.firestore, 'users', userId), {
        idField: 'id',
      }).pipe(
        map((data) => new User(data)),
        tap((user) => this.onUserLoaded(user))
      )
    );
  }

  /**
   * Handle user loaded successfully.
   * @param user - The loaded user data
   */
  private onUserLoaded(user: User): void {
    this.currentUser = user;
    this.setLoading(false);
  }

  /**
   * Handle loading error.
   * @param err - The error object
   */
  private handleError(err: unknown): Observable<never> {
    const message =
      err instanceof Error ? err.message : 'Unknown error';
    this.setError(`Error loading: ${message}`);
    return EMPTY;
  }

  /** Set loading state and trigger change detection. */
  private setLoading(loading: boolean): void {
    this.loading = loading;
    this.cdr.markForCheck();
  }

  /**
   * Set error message and trigger change detection.
   * @param error - The error message
   */
  private setError(error: string): void {
    this.error = error;
    this.loading = false;
    this.cdr.markForCheck();
  }

  /** Cleanup on component destroy. */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Open dialog to edit current user. */
  openEdit(): void {
    if (!this.currentUser) return;
    const dialog = this.dialog.open(DialogEdit);
    dialog.componentInstance.user = new User(
      this.currentUser.toJSON()
    );
    dialog.afterClosed().subscribe((result) => {
      if (result) this.saveUser(result);
    });
  }

  /**
   * Save updated user to Firestore.
   * @param updatedUser - The updated user data
   */
  private async saveUser(updatedUser: User): Promise<void> {
    if (!this.currentUser?.id) return;
    try {
      const userDocRef = doc(
        this.firestore,
        'users',
        this.currentUser.id
      );
      await runInInjectionContext(this.injector, async () =>
        updateDoc(userDocRef, updatedUser.toJSON())
      );
      this.currentUser = updatedUser;
      this.cdr.markForCheck();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error';
      this.setError(`Save failed: ${message}`);
    }
  }
}
