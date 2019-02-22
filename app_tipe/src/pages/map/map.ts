import { AdressesService } from './../../app/services/adresses.service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef ;
  map: any;

  clients:any[];
  i:number = 0;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private viewCtrl: ViewController, 
              private params: NavParams,
              private adressesService: AdressesService ) {

      this.clients = params.get('clients');
      
  }

  ionViewDidLoad() {
    this.initMap();
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }


  calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = [];

    for (this.i = 0; this.i < this.clients.length ; this.i ++){
      waypts.push({location: String(this.clients[this.i].adresse)})
    }

    var depot = this.adressesService.getAdresse(0).adresse

  
    directionsService.route({
      origin: depot,
      destination: depot,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
        
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 14,
    });
    directionsDisplay.setMap(this.map);
    this.calculateAndDisplayRoute(directionsService,directionsDisplay);
  }

}
