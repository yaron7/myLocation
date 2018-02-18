import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

import { Category } from '../categories/shared/category.model';
import { BarEvent } from '../shared/models/BarEvent';

@Injectable()
export class DataService {

  private barSource = new BehaviorSubject<BarEvent>({ BtnTrigger: null, isOpen: false });
  private deleteSource = new BehaviorSubject<boolean>(false);
  private editSource = new BehaviorSubject<boolean>(false);

  isBarOpen = this.barSource.asObservable();
  isDeletable = this.deleteSource.asObservable();
  isEditable = this.editSource.asObservable();

  constructor() { }

  toggleAddItemBar(barEv: BarEvent) {
    this.barSource.next(barEv);
    this.editSource.next(false);
    this.deleteSource.next(false);
  }

  toggleDeletableMode(isDeletable: boolean) {
    if (this.barSource.value.isOpen) {
      this.barSource.next({ BtnTrigger: null, isOpen: false });
    }
    this.editSource.next(false);
    this.deleteSource.next(isDeletable);
  }

  toggleEditableMode(isEditable: boolean) {
    if (this.barSource.value.isOpen) {
      this.barSource.next({ BtnTrigger: null, isOpen: false });
    }
    this.deleteSource.next(false);
    this.editSource.next(isEditable);
  }

  resetToolBar() {
    this.barSource.next({ BtnTrigger: null, isOpen: false });
    this.deleteSource.next(false);
    this.editSource.next(false);
  }

}
