import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NguiMapModule} from '@ngui/map';
import { SharedModule } from '../shared/shared.module';
import { LocationsComponent } from './locations.component';
import { LocationService } from './shared/location.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: LocationsComponent
      }]),
    NguiMapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCSq9qXmp5bbTPSNKKOvp1HTeyEeP9B25M&libraries=visualization,places,drawing' })
  ],
  declarations: [
    LocationsComponent
  ],
  providers: [LocationService]
})
export class LocationsModule { }
