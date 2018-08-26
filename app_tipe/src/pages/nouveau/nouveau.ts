import { Adresse, AdressesService } from './../../app/services/adresses.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery'


/**
 * Generated class for the NouveauPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nouveau',
  templateUrl: 'nouveau.html',
})
export class NouveauPage {

  adresses: Adresse[] = [];
  afficher1:boolean =true;
  afficher2:boolean = false;
  modif:Adresse;
  reg =/[ ,-,']/g;
  url:string;
  url1:string = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=';
  url2:string = '&destinations=';
  url3:string = '&key=AIzaSyAWKdLVGtlyq65ctnolKAxk0qRY03r_Xp4';

  itinf = [];
  itin= [];
  data:any;
  i:number = 0;
  j:number=0;
  Cl:string[] = [];
  phraseCl:string='';
  distances:any[] = [];
  clients:any[] = [];
  afficher3=false;

  resultat: any[] = [];
  res:any[] = [];
  inde:any[] = [];
  ind:any[] =[]
  


  constructor(public navCtrl: NavController,
              public navParams: NavParams  ,
              private adressesService:AdressesService,
            private alertCtrl: AlertController,
            private http: HttpClient  ) {
      this.adresses = this.adressesService.getAdresses();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NouveauPage');
  }


  addClient(){
    let alert = this.alertCtrl.create({
      title: 'Ajout',
      inputs: [
        {
          name: 'surnom',
          placeholder: 'Nom'
        },
        {
          name: 'adresse',
          placeholder: 'Adresse',
        },
        {
          name: 'volume',
          placeholder: 'Volume ( mètres cubes )',
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ajouter',
          handler: data =>{
            this.adressesService.addAdresse(data)
          }
          
        }
      ]
    });
    alert.present();
  }

  nouveau(){
    this.afficher3=false;
    this.adressesService.nouveau();
    this.afficher1=true;

  }

  enregistrer(){


  }


  removeAdresse(idx:number){
    this.adressesService.deleteAdresse(idx);
  }

  modifAdresse(idx:number){
    this.modif = this.adressesService.getAdresse(idx);
    let alert = this.alertCtrl.create({
      title: 'Modification',
      inputs: [
        {
          name: 'surnom',
          placeholder: 'Nom',
          value: this.modif.surnom,

        },
        {
          name: 'adresse',
          placeholder: 'Adresse',
          value: this.modif.adresse,
        },
        {
          name: 'volume',
          placeholder: 'Volume ( mètres cubes )',
          value: this.modif.volume,
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Modifier',
          handler: data =>{
            this.adressesService.modifAdresse(idx,data)
          }
          
        }
      ]
    });
    alert.present();

  };

  calcul(){


    
    this.afficher1 = false;
    this.afficher2 = true;
    this.adresses = this.adressesService.getAdresses();
    for (this.i=0; this.i< this.adresses.length;this.i++){
      this.clients.push(this.adresses[this.i].volume);
      this.Cl.push(this.adresses[this.i].adresse);
    }
    this.phraseCl = this.adresses[0].adresse;
    for(this.i=1; this.i< this.adresses.length;this.i++){
      this.phraseCl = this.phraseCl + '|' + this.Cl[this.i];
    }
    this.phraseCl = this.phraseCl.replace(this.reg,'_');
    this.url = this.url1 + this.phraseCl + this.url2 + this.phraseCl + this.url3;
    this.http.get(this.url).subscribe(data => {
      for( this.i = 0; this.i < data.rows.length; this.i++ ){
        for (this.j = this.i + 1; this.j < data.rows[this.i].elements.length; this.j++){
          this.distances.push(this.i);
          this.distances.push(this.j);
          this.distances.push( data.rows[this.i].elements[this.j].duration.value);
        }
      }

      $.ajax({
        type: "get",
        url: 'https://tipe2019.yo.fr/tipe.php',
        data: 'clients=' + String(this.clients) + '&distances=' + String(this.distances),
        success: function(data){
          console.log('ok');  
          },
        dataType: 'json'
      }).done(data => {

        console.log(data)

        for ( this.i =1; this.i < data.length/3; this.i++ ){
          if ( Number(data[this.i*3 + 1]) != 0 ){
            this.itin = this.itin.concat( [ Number(data[this.i*3 + 1])])
            
          }
          else {
            this.itinf.push(this.itin);
            this.itin = []
          }

        }


        for ( this.j = 0; this.j < this.itinf.length ; this.j++){
          for( this.i = 0; this.i < this.itinf[this.j].length; this.i++){
            this.res.push( this.adressesService.getAdresse(this.itinf[this.j][this.i]));
            this.ind.push(this.i);
          }
          this.resultat.push(this.res);
          this.inde.push(this.ind);
          this.res = [];
          this.ind = [];
        
        }

        

      })
    });


    console.log(this.inde)
    
    
    /* for( let e in this.itinf){
      for ( this.i = 0; this.i < e.length; this.i ++  ){
        e[this.i] = this.adressesService.getAdresse(e[this.i]);
      }
    } */

    this.afficher2=false;
    this.afficher3 = true;
    
  }



}

