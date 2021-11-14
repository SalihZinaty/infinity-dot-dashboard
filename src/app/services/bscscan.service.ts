import { Injectable } from '@angular/core';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class BscscanService {

  constructor(private http: HttpClient) { }

  async getAddresses() {
    const   burnWallet  = 'https://bscscan.com/token/0x73b96Ac0814EAfF828779De589840d1172aaAa70?a=0x000000000000000000000000000000000000dead';
    const lpWallet = 'https://bscscan.com/token/0x73b96Ac0814EAfF828779De589840d1172aaAa70?a=0x2fb061745263c069a5cb933b3c873783adc66ef5';
    let response;
    await this.http.get(burnWallet).subscribe(res => response = res);
    return response;
    /* let text: string = 'xx'
    await axios.get(burnWallet,{responseType: 'text'}).then(res => {
        text = res.data;
    });
    let a = text.match(/[0-9,.?]+ IDOT/g);
    console.log(a);
    //@ts-ignore
    res.send({balance: a[0]}); */
  }
}
