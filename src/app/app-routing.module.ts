import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'categories',
    loadChildren: 'app/categories/categories.module#CategoriesModule',
    data: { pageTitle: 'Categories' }
  },
  {
    path: 'locations',
    loadChildren: 'app/locations/locations.module#LocationsModule',
    data: { pageTitle: 'Locations' }
  },
  { path: '', redirectTo: '/categories', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
