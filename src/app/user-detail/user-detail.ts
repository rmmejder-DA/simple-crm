import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef, EnvironmentInjector } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { switchMap, tap, catchError, takeUntil } from 'rxjs/operators';
import { Subject, EMPTY } from 'rxjs';
import { runInInjectionContext } from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, DatePipe, RouterLink, MatButtonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetail {
  firestore = inject(Firestore);
  route = inject(ActivatedRoute);
  private _isLoading = true;
  public get loading() {
    return this._isLoading;
  }
  public set loading(value) {
    this._isLoading = value;
  }
  user: User | null = null;
  cdr = inject(ChangeDetectorRef);
  readonly injector = inject(EnvironmentInjector);
  user$ = this.route.paramMap.pipe(
    switchMap(params => {
      const userId = params.get('id');
      if (!userId) return EMPTY;

      const userDocRef = doc(this.firestore, 'users', userId);
      return docData(userDocRef, { idField: 'id' }).pipe(
        map(data => new User(data))
      );
    })
  );

  
  error: string | null = null;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.loading = true;
          this.user = null;
          this.error = null;
          this.cdr.markForCheck();
        }),
        switchMap(params => {
          const userId = params.get('id');
          console.log('User ID from route:', userId);

          if (!userId) {
            this.error = 'Keine Benutzer-ID angegeben';
            this.loading = false;
            this.cdr.markForCheck();
            return EMPTY;
          }

          console.log('Loading user from Firestore:', userId);
          
          return runInInjectionContext(this.injector, () => {
            const userDocRef = doc(this.firestore, 'users', userId);
            return docData(userDocRef, { idField: 'id' });
          });
        }), 
        tap((data: any) => {
          console.log('User data received:', data);
          if (data) {
            this.user = new User(data);
            this.error = null;
          } else {
            this.error = 'Benutzer nicht gefunden';
            console.warn('No user data received');
          }
          this.loading = false;
          this.cdr.markForCheck();
        }),
        catchError((err) => {
          console.error('Error loading user:', err);
          this.error = 'Fehler beim Laden: ' + err.message;
          this.loading = false;
          this.cdr.markForCheck();
          return EMPTY;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
