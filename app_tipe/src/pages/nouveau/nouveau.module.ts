import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NouveauPage } from './nouveau';

@NgModule({
  declarations: [
    NouveauPage,
  ],
  imports: [
    IonicPageModule.forChild(NouveauPage),
  ],
})
export class NouveauPageModule {}
