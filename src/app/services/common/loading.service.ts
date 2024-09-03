import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<any>(null);
  loading$ = this.loadingSubject.asObservable();

  setLoading(state: boolean) {
    this.loadingSubject.next(state);
  }
  constructor() { }
}
