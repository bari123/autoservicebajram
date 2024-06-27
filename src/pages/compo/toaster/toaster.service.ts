import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private toastSubject = new Subject<{ error: boolean, message: string }>();
  toastState = this.toastSubject.asObservable();

  showToast(error: boolean, message: string) {
    this.toastSubject.next({ error, message });
  }
}
