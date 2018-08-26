import { Component } from '@angular/core';
import { NouveauPage } from '../nouveau/nouveau';
import { HistoriquePage } from '../historique/historique';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = NouveauPage ;
  tab2Root = HistoriquePage;

  constructor() {

  }
}
