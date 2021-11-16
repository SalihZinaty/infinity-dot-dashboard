import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { DAILY_VOLUME_CMC_URL, PROXY_SERVER_URL } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class BscscanService {

  constructor(private http: HttpClient) { }

  async getAddressBalance(address: string) {
    return this.http.get(`${PROXY_SERVER_URL}=${address}`,{responseType:'text'})
    .pipe(map((html:any) => this.extractBscAddressBalance(html)));
  }
  async getIdotDailyVolume() {
    return this.http.get(`${PROXY_SERVER_URL}=${DAILY_VOLUME_CMC_URL}`,{responseType:'text'})
    .pipe(map((html:any) => {
      let volume;
      volume = (html.match(/\$[0-9,]+ USD/g))[0].split(',').join('').split('$').join('').split(' USD')[0];
     // console.log(volume);
      return Number(volume);
    }))
  }
  private extractBscAddressBalance(html: string){
    let balance: any;
    //console.log(html);
    //@ts-ignore
    balance = (html.match(/[0-9,.?]+ IDOT/g))[0].split(',').join('').split(' IDOT')[0];
    return Number(balance)
  }
}
