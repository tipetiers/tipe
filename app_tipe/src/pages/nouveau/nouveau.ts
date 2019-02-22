import { HTTP } from '@ionic-native/http';
import { MapPage } from './../map/map';
import { Adresse, AdressesService } from './../../app/services/adresses.service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
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



//FAIRE UN DEBOGAGUE AVEC SI C'est LE DEUXIEME TOUR CA AFFICHE L'URL
  compteur:number = 0;
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
  ind:any[] =[];
  teste:any;
  desespoir: string;

  @ViewChild('map') mapElement: ElementRef ;
  map: any;
  


  constructor(public navCtrl: NavController,
              public navParams: NavParams  ,
              private adressesService:AdressesService,
            private alertCtrl: AlertController,
            private http: HttpClient,
            private modalCtrl: ModalController,  
            private httpB:HTTP) {
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
    this.clients=[];
    this.Cl = [];
    this.distances = [];
    this.resultat = [];
    this.inde = [];
    this.itin = [];
    this.itinf = [];

  }


  enregistrer(){


  }

  test(){
    this.httpB.get('https://tipe2019.yo.fr/tipe.php?clients=0,15,32,19,12&distances=0,1,23242,0,2,1237,0,3,19199,0,4,8052,1,2,22578,1,3,20234,1,4,15880,2,3,19668,2,4,7509,3,4,18920', {}, {})
  .then(data => {

    console.log(data.status);
    this.teste = data.data; 
    console.log(data.headers);

  })
  .catch(error => {

    console.log(error.status);
    console.log(error.error); // error message as string
    console.log(error.headers);

  });
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



  montrerCarte(i){

    let profileModal = this.modalCtrl.create(MapPage, { clients: this.resultat[i] });
    profileModal.present(); 

  }

  
  calcul(){

    this.compteur ++;


    
    this.afficher1 = false;
    this.afficher2 = true;

    
    this.adresses = this.adressesService.getAdresses();
    for (this.i=0; this.i< this.adresses.length;this.i++){
      this.clients.push(this.adresses[this.i].volume);
      this.Cl.push(this.adresses[this.i].adresse.toLowerCase()) ;
    }
    this.phraseCl = this.adresses[0].adresse;
    for(this.i=1; this.i< this.adresses.length;this.i++){
      this.phraseCl = this.phraseCl + '%7C' + this.Cl[this.i];
    }

    this.reg= /[ ,',-]/g;
    this.phraseCl = this.phraseCl.replace(this.reg,'_');
    this.reg= /[é,è,ê]/g;
    this.phraseCl = this.phraseCl.replace(this.reg,'e');
    this.reg= /[à,â]/g;
    this.phraseCl = this.phraseCl.replace(this.reg,'a');
    this.reg= /[ô]/g;
    this.phraseCl = this.phraseCl.replace(this.reg,'o');
    this.reg= /[ù,û]/g;
    this.phraseCl = this.phraseCl.replace(this.reg,'u');
    this.reg= /[ï,î]/g;
    this.phraseCl = this.phraseCl.replace(this.reg,'i');
    this.url = this.url1 + this.phraseCl + this.url2 + this.phraseCl + this.url3;

    

    
    
    this.httpB.get(this.url,{},{}).then(data =>{
      
      for ( this.i = 1; this.i < this.clients.length + 1; this.i++ ){
      
      
        for(this.j = this.i + 1 ; this.j< this.clients.length + 1; this.j++ ){
          this.distances.push(this.i- 1);
          this.distances.push(this.j - 1);
          this.distances.push(data.data.split('elements')[this.i].split('duration')[this.j].split('value" : ')[1].split(' ')[0])
          
        }
        
      } 
      this.desespoir = String(this.distances[0])
      for( this.i = 1; this.i < 3*this.clients.length*(this.clients.length - 1)/2; this.i ++){
        if ((this.i + 1)%3 == 0 ){
          this.desespoir = this.desespoir + ',' + String(this.distances[this.i].substring(0,this.distances[this.i].length-1));
        }
        else{
          this.desespoir = this.desespoir +','+ String(this.distances[this.i]);
          
        }
      }

      
      
      
      
      this.httpB.get('https://tipe2019.yo.fr/tipe.php?clients='+ this.clients +'&distances=' + String(this.desespoir), {}, {})
      .then(data => {
        
          for ( this.i =1; this.i < data.data.length/3; this.i++ ){
            if ( Number(data.data[this.i*3 + 2]) != 0 ){
              this.itin = this.itin.concat( [ Number(data.data[this.i*3 + 2])])
              
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
          
          
          this.afficher2=false;
          this.afficher3 = true;
          
        })
        .catch(error => {
          
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
          
        });
        
        
        
      }).catch(error => {
          
        console.log(error.status);
        this.teste=error.error; // error message as string
        console.log(error.headers);
        
      });
      
      
      
      //'https://tipe2019.yo.fr/tipe.php?clients='+String(this.clients)+'&distances=' + String(this.distances)
  /* 
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

        
        this.afficher2=false;
        this.afficher3 = true;
    

        

      })
      
    }); */


    
    
    


  }


}

