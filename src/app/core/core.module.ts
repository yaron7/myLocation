import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { DataService } from './data.service';
import { BottomBarComponent } from './bottom-bar/bottom-bar.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  exports:[
    ToolbarComponent,
    BottomBarComponent
  ],
  declarations: [
    ToolbarComponent,
    BottomBarComponent
  ],
  providers:[DataService]
})
export class CoreModule { }
