import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BscscanService {

  constructor(private http: HttpClient) { }

  async getAddressBalance(address: string) {
    return this.http.get(`https://api.allorigins.win/raw?url=${address}`,{responseType:'text'})
    .pipe(map((html:any) => this.extractBscAddressBalance(html)));
  }

  private extractBscAddressBalance(html: string){
    let balance: any;
    //console.log(html);
    //@ts-ignore
    balance = (html.match(/[0-9,.?]+ IDOT/g))[0].split(',').join('').split(' IDOT')[0];
    return Number(balance)
  }
}
