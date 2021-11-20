import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BASE_BSC_API, BSC_API_KEY, BSC_TRANSACTIONS_URL, REWARDS_ADDRESS } from '../utils/constants';
import { CoinGeckoAPI } from "@coingecko/cg-api-ts";


@Injectable({
  providedIn: 'root'
})
export class BscscanService {
  private cg;
  constructor(private http: HttpClient) {
    this.cg = new CoinGeckoAPI(window.fetch.bind(window))
   }

   async getAddressRewards(address: string) {
     return this.http.get(`${BSC_TRANSACTIONS_URL}=${address}&tag=latest&apikey=${BSC_API_KEY}`).pipe(map((data) => this.filterDataByRewards(data)))
   }
  filterDataByRewards(data: any) {
     let reflectionsTransactions = data.result.filter((transaction:any) => {
       return transaction.from.toLowerCase() == REWARDS_ADDRESS.toLowerCase();
     });
     let dotRewards = reflectionsTransactions.map((transaction:any) => {
       let dotReward = transaction.value;
       let formattedDotReward
       if(dotReward.length > 18) {
         let dec = dotReward.slice(dotReward.length-18,dotReward.length)
         let tens = dotReward.slice(0,dotReward.length-18);
         formattedDotReward = Number(Number(tens + '.' + dec).toFixed(4));
       } else {
         let zeros = 18 - dotReward.length + 1;
         let dotRewardArr = dotReward.split('');
         for(let i=0;i<zeros;i++){
           dotRewardArr.unshift('0');
         }
         dotRewardArr.splice(1,0,'.')
         formattedDotReward = Number(Number(dotRewardArr.join('')).toFixed(4));
       }
       return formattedDotReward
     })
     let sumRewards = 0
     dotRewards.map((reward:any) => sumRewards = sumRewards + reward)
     return sumRewards;
   }
  async getAddressBalance(address: string) {
    return this.http.get(`${BASE_BSC_API}=${address}&tag=latest&apikey=${BSC_API_KEY}`).pipe(map(res => {
      //@ts-ignore
      let formattedNumber = res.result.slice(0,res.result.length-9)  + '.' + res.result.slice(res.result.length-9,res.result.length);
      return formattedNumber
    }))
  }
  async getIdotDailyVolume(): Promise<Number> {
    let volume=0;
    await this.cg.getCoinsIdMarketChart('infinitydot','usd',1).then(response => {
      let volumes = response.data.total_volumes;
      volume = volumes[volumes.length-1][1];
    })
    return volume;
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
