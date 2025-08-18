import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalshareService {
  private shareTypeId = new BehaviorSubject<any>(localStorage.getItem('selectedTypeId') || '');
  private localData = new BehaviorSubject<any>('');
  sharedData = this.localData.asObservable();
  selectedTypeId = this.shareTypeId.asObservable();
  private shareparentId = new BehaviorSubject<any>(localStorage.getItem('selectedparentId') || '')
  selectedparentId = this.shareparentId.asObservable();
  private shareParentId = new BehaviorSubject<any>('');
  shareParentTypeId = this.shareParentId.asObservable();

  constructor() { }
  shareTypeIdData(payload: any, typeName: any) {
    this.shareTypeId.next(payload);
    this.localData.next(typeName);
    localStorage.setItem('selectedTypeId', payload);
  }
  shareparentIdData(payload: any) {
    this.shareparentId.next(payload);
    localStorage.setItem('selectedparentId', payload);
  }
  shareParentTypeIdData(payload: any) {
    this.shareParentId.next(payload);
  }

}
