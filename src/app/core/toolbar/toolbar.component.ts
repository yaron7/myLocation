import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../data.service';
import { Button } from 'selenium-webdriver';
import { Btns } from '../../shared/models/BarEvent';

@Component({
  selector: 'ml-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  title: string;
  private isBarOpen: boolean;
  private subscription: Subscription;
  private isDeletable: boolean;
  private isEditable: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.title = this.route.firstChild.snapshot.data['pageTitle'];
        }
      });

    this.subscription = this.dataService.isBarOpen
      .subscribe(res => {
        this.isBarOpen = res.isOpen;
      });

    this.subscription = this.dataService.isDeletable
      .subscribe(res => {
        this.isDeletable = res;
      });

    this.subscription = this.dataService.isEditable
      .subscribe(res => {
        this.isEditable = res;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  editableMode() {
    this.dataService.toggleEditableMode(!this.isEditable);
  }

  deletableMode() {
    this.dataService.toggleDeletableMode(!this.isDeletable);
  }

  toggaleAddBar() {
    this.dataService.toggleAddItemBar({ BtnTrigger: Btns.Add, isOpen: !this.isBarOpen });
  }

}
