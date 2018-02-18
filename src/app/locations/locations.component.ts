import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { DataService } from '../core/data.service';
import { Location, Coordinates } from '../locations/shared/location.model';
import { LocationService } from './shared/location.service';
import { Category } from '../categories/shared/category.model';
import { CategoryService } from '../categories/shared/category.service';
import { Btns, BarEvent } from '../shared/models/BarEvent';

@Component({
  selector: 'ml-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit, OnDestroy {

  fg: FormGroup;
  locations: Location[];
  categories: Category[];
  selectedCategory: string;
  isDeletableMode: boolean;
  isEditableMode: boolean;
  toggleBarClass: string;
  formButton: number;
  isPlaceSelected: boolean = false;

  //form model
  private locationDTO = new Location(null, null, 'Tel Aviv, Israel', null, { id: null, name: null });

  get category(): FormControl {
    return this.fg.get('category') as FormControl;
  }

  get locatoin(): FormControl {
    return this.fg.get('locationName') as FormControl;
  }

  get address(): FormControl {
    return this.fg.get('address') as FormControl;
  }

  constructor(
    private dataService: DataService,
    private categoryService: CategoryService,
    private locationService: LocationService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.locations = new Array<Location>();
    this.categories = new Array<Category>();
  }

  ngOnInit() {
    this.subscribeBarChanges();
    this.subscribeDeletableMode();
    this.subscribeEditableMode();
    this.getCategories();
    this.getLocations();
    this.createForm();
  }

  ngOnDestroy() {
    this.dataService.resetToolBar();
  }

  createForm() {
    this.fg = this.fb.group({
      category: [{ value: '', disabled: this.categories.length == 0 }, Validators.required],
      locationName: [{ value: '', disabled: true }, Validators.required],
      address: [{ value: '', disabled: true }, Validators.required]
    });
  }

  selectedChange() {
    if (this.category.value) {
      this.locatoin.enable();
      this.address.enable();
    }
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      categories => this.categories = categories
    )
  }

  addLoction() {
    if (this.fg.valid) {
      this.locationDTO.id = this.setLocationId();
      this.locationDTO.category = this.category.value as Category;
      // let c = this.categories.find(c => c.id == this.category.value);
      // this.locationDTO.category.name = c.name || '';

      if (this.locationDTO) {
        this.locationService.updateLocation(this.locationDTO).subscribe(
          () => {
            this.getLocations();
          },
          err => console.log(err)
        );
        this.dataService.toggleAddItemBar({ BtnTrigger: Btns.Add, isOpen: false });
      }
      this.getLocations();
    }
  }

  editLocation(location: Location) {
    //open bar to show location details
    this.dataService.toggleAddItemBar({ BtnTrigger: Btns.Edit, isOpen: true });

    //set selected location field in the form
    this.locationDTO.category = location.category;

    this.fg.get('category').setValue(location.category);
    this.locatoin.setValue(location.name);
    this.address.setValue(location.address);

  }

  editDone(category) {
    category.isEditMode = false;
    //in case the input saved with empty string deleting the entry
    if (category.name == '') {
      this.deleteCategory(category);
    }
  }

  deleteCategory(c) {
    let category = this.categories.filter(i => i.id == c.id);
    if (category != null) {
      this.categoryService.deleteCategory(category[0]).subscribe();
      this.getCategories();
    }
  }

  addressEntered(elm) {
    if (elm) {
      elm.scrollIntoView({ behavior: "smooth" });
    }
  }

  //----------------- google maps -----------------

  placeChanged(place) {

    if (place) {
      this.isPlaceSelected = true;
      //set Location model props
      this.locationDTO.address = place.formatted_address;
      this.locationDTO.coordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      this.ref.detectChanges();
    }

  }

  private saveLocation() {
    this.locationService.saveLocation(this.locationDTO).subscribe(
      () => {
        this.dataService.toggleAddItemBar({ BtnTrigger: Btns.Add, isOpen: false });
        this.fg.reset();
      },
      err => {
        err => console.log(err)
      }
    );
  }

  private setLocationId(): number {
    let len = this.locations.length;
    if (len) {
      return this.locations[this.locations.length - 1].id + 1;
    }
    else {
      return 0;
    }
  }

  private getLocations() {
    this.locationService.getLocations().subscribe(
      locations => {
        if (locations.length) {
          this.locations = locations;
          this.locations.map(l => l['isEditMode'] = false);
        }
      });
  }

  private subscribeDeletableMode() {
    this.dataService.isDeletable
      .subscribe(res => this.isDeletableMode = res);
  }

  private subscribeEditableMode() {
    this.dataService.isEditable
      .subscribe(isEditable => {
        this.isEditableMode = isEditable;
      });
  }

  private subscribeBarChanges() {
    this.dataService.isBarOpen
      .subscribe(res => {
        if (res.BtnTrigger && res.isOpen) {
          this.formButton = res.BtnTrigger;
          this.toggleBarClass = 'open-bar';
        }
        else if (res.BtnTrigger && !res.isOpen) {
          this.fg.reset();
          this.isPlaceSelected = false;
          this.toggleBarClass = 'close-bar';
        }
      });
  }

}
