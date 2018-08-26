import { Injectable } from '@angular/core';

@Injectable()
export class AdressesService {

    public adresses:Adresse[]= [
        {
            surnom: "Dépot",
            adresse:'lycée Aubanel, Avignon, 84000',
            volume: 0
        },
        
        {
            surnom: "Pompidou",
            adresse:'Centre Pompidou, Paris, France',
            volume: 15
        },
        {
            surnom: "SuperU",
            adresse:'superU, courthèzon, France',
            volume: 32
        },
        {
            surnom: "Bordeaux",
            adresse:'Bordeaux, France',
            volume: 19
        },
        {
            surnom: "lazar",
            adresse:'lycée des lazaristes',
            volume: 12 
        }
        
    ];
      

    constructor(){
        

    }

    getAdresses(){
        return this.adresses
    }

    getAdresse( idx: number){
      return this.adresses[idx]
    }

    addAdresse(obj:Adresse){
        this.adresses.push({surnom: obj.surnom, adresse: obj.adresse, volume: obj.volume})
    }

    deleteAdresse(idx:number){
        this.adresses.splice(idx,1);
    }

    modifAdresse(idx:number, obj:Adresse ){
        this.adresses[idx]= obj
    }

    nouveau(){
        this.adresses.splice(1,this.adresses.length - 1 );
    }

}


export interface Adresse {
    surnom:string;
    adresse:string;
    volume:number

}