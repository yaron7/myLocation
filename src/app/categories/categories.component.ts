import { Component, OnInit, OnDestroy } from '@angular/core';

import { Category } from './shared/category.model';
import { DataService } from '../core/data.service';
import { Validators, FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CategoryService } from './shared/category.service';
import { Btns } from '../shared/models/BarEvent';

@Component({
  selector: 'ml-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

export class CategoriesComponent implements OnInit, OnDestroy {

  fg: FormGroup;
  categories: Category[];
  isExist: boolean;
  isDeletableMode: boolean;
  isEditableMode: boolean;
  toggleBarClass: string;

  constructor(
    private dataService: DataService,
    private categoryService: CategoryService,
    private fb: FormBuilder) {
    this.categories = new Array<Category>();
  }

  get categoriesFA(): FormArray {
    return this.fg.get('categoriesFA') as FormArray;
  };

  get newCategory(): FormControl {
    return this.fg.get('newCategory') as FormControl;
  }

  ngOnInit() {
    this.createForm();
    this.getCategories();
    this.initializeCategoriesFA(this.categories);
    this.subscribeBarChanges();
    this.subscribeDeletableMode();
    this.subscribeEditableMode();
  }

  ngOnDestroy() {
    this.dataService.resetToolBar();
  }

  createForm() {
    this.fg = this.fb.group({
      newCategory: ['', Validators.required],
      categoriesFA: this.fb.array([])
    });
  }

  initializeCategoriesFA(categories: Category[]) {
    if (categories.length) {
      const fGs = categories.map(category => this.setFormGroup(category));
      const formArray = this.fb.array(fGs);
      this.fg.setControl('categoriesFA', formArray);
    }
  }

  setFormGroup(category: Category) {
    return this.fb.group({
      name: [{ value: category.name, disabled: true }, Validators.required],
      id: [{ value: category.id, disabled: true }]
    });
  }

  addNewCategory() {
    if (!this.newCategory.valid) { return; }
    if (this.isCategoryExist()) {
      return;
    }

    let newCategory: Category = {
      name: this.newCategory.value,
      id: this.categories.length + 1
    };

    //add new category to the FormArray
    this.categoriesFA.push(this.setFormGroup(newCategory));

    //save new category to local storage
    this.saveCategory(newCategory);
  }

  editCategory(fg: FormGroup) {
    //enable editing the category
    fg.enable();
  }

  editDone(fg: FormGroup, fgIdx: number) {
    //disable editing the category
    fg.disable();
    //in case the input saved with empty string deleting the entry
    if (fg.get('name').value == '') {
      this.deleteCategory(fg, fgIdx);
    }
    else {
      let c = fg.value as Category;
      if (c) {
        this.categoryService.updateCategory(c).subscribe();
      }
    }
  }

  deleteCategory(fg: FormGroup, fgIdx: number) {
    let c = fg.value as Category;
    //delete category from FromArray (displaying list)
    this.categoriesFA.removeAt(fgIdx);
    //delete category in datadb
    this.categoryService.deleteCategory(c).subscribe();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      categories => {
        this.categories = categories;
      }
    );
  }

  private saveCategory(newCategory: Category) {
    this.categoryService.saveCategory(newCategory)
      .subscribe(category => {
        this.categories.push(category);
      },
        err => console.log(err)
      );
  }

  private isCategoryExist(): boolean {
    let c = this.categories
      .filter((c) => { return c.name == this.newCategory.value });
    if (c.length) {
      return this.isExist = true;
    }
    else {
      return this.isExist = false;
    }
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
          this.toggleBarClass = 'open-bar';
        }
        else if (res.BtnTrigger && !res.isOpen) {
          this.toggleBarClass = 'close-bar';
        }
      });
  }

}
