import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { CategoriesComponent } from './categories.component';
import { CategoryService } from './shared/category.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: CategoriesComponent
      }]),
  ],
  declarations: [
    CategoriesComponent
  ],
  providers: [CategoryService]
})
export class CategoriesModule { }
