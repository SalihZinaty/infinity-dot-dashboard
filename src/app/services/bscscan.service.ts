import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { DAILY_VOLUME_CMC_URL, PROXY_SERVER_URL } from '../utils/constants';
import { CoinGeckoAPI } from "@coingecko/cg-api-ts";


@Injectable({
  providedIn: 'root'
})
export class BscscanService {
  private cg;
  constructor(private http: HttpClient) {
    this.cg = new CoinGeckoAPI(window.fetch.bind(window))
   }

  async getAddressBalance(address: string) {
    return this.http.get(`${PROXY_SERVER_URL}=${address}`,{responseType:'text'})
    .pipe(map((html:any) => this.extractBscAddressBalance(html)));
  }
  async getIdotDailyVolume(): Promise<Number> {
    let volume=0;
    await this.cg.getCoinsIdMarketChart('infinitydot','usd',1).then(response => {
      let volumes = response.data.total_volumes;
      volume = volumes[volumes.length-1][1];
    })
    return volume;
/*     return this.http.get(`${PROXY_SERVER_URL}=${DAILY_VOLUME_CMC_URL}`,{responseType:'text'})
    .pipe(map((html:any) => {
      let volume;
      volume = (html.match(/\$[0-9,]+ USD/g))[0].split(',').join('').split('$').join('').split(' USD')[0];
     // console.log(volume);
      return Number(volume);
    })) */
  }
  private extractBscAddressBalance(html: string){
    let balance: any;
    //@ts-ignore
    let balanceReg = (html.match(/[0-9,.?]+ IDOT/g));
    if(!balanceReg) return -1
    else {
      balance = balanceReg[0].split(',').join('').split(' IDOT');
    }
    return balance[0];
  }
}
