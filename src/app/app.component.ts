import { Component, OnDestroy, OnInit } from '@angular/core';
import { BscscanService } from './services/bscscan.service';
import { BSC_IDOT_SEARCH_ADDRESS_URL, BURN_WALLET, LP_WALLET, REFLECTION_PERCENT, TOTAL_TOKENS } from './utils/constants';
import { FormGroup, FormControl, Validators } from '@angular/forms'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  burnwalletBalance: number = 0;
  lpWalletBalance: number = 0;

  rewardsForm:any;

  dailyVolume:Number = 0;
  circulationSupply: Number = 0;
  addressBalance: Number = 0;

  dailyReflections: Number = 0;
  monthlyReflections: Number = 0;
  yearlyReflections: Number = 0;
  dailyReflectionsFormatted:any;
  monthlyReflectionsFormatted:any;
  yearlyReflectionsFormatted:any;

  constructor(private bscscanService: BscscanService){}
  async ngOnInit() {
    (await this.bscscanService.getAddressBalance(BURN_WALLET)).subscribe(async (dataBurn) => {
      this.burnwalletBalance = dataBurn;
      (await this.bscscanService.getAddressBalance(LP_WALLET)).subscribe(data =>{ 
        this.lpWalletBalance = data;
        this.circulationSupply = TOTAL_TOKENS - this.burnwalletBalance - this.lpWalletBalance;
        this.updateReflections();
      });
      });
    (await this.bscscanService.getIdotDailyVolume()).subscribe(data => {this.dailyVolume=data;console.log(this.dailyVolume)});
    this.initiateRewardsForm();
    
  }
  initiateRewardsForm() {
    this.rewardsForm = new FormGroup({
      walletAddress: new FormControl('',[]),
      volume: new FormControl('',[]),
      totalAddressBalance: new FormControl('',[]),
      lpBalance: new FormControl('',[]),
    })

    this.rewardsForm.controls['volume'].valueChanges.subscribe((volume:any) => {
        this.dailyVolume = volume;
        this.updateReflections();
    })

    this.rewardsForm.controls['walletAddress'].valueChanges.subscribe(async (address:any) => {
      let addressUrl = BSC_IDOT_SEARCH_ADDRESS_URL + address;
      (await this.bscscanService.getAddressBalance(addressUrl)).subscribe(async (addressBalance) => {

        console.log(addressBalance);
        this.addressBalance = addressBalance;
        this.updateReflections();
      })
    })
    this.rewardsForm.controls['totalAddressBalance'].valueChanges.subscribe((data:any) => {
      this.addressBalance = Number(data);
      this.updateReflections();
    })

    this.rewardsForm.controls['lpBalance'].valueChanges.subscribe((lpBalance:any) => {
      this.lpWalletBalance = Number(lpBalance);
      this.circulationSupply = TOTAL_TOKENS - this.burnwalletBalance - this.lpWalletBalance;
      this.updateReflections();
    })
  }
  updateReflections(){
            //@ts-ignore
            this.dailyReflections = ((this.addressBalance/this.circulationSupply)*(this.dailyVolume*(REFLECTION_PERCENT/100))).toFixed(3);
            //@ts-ignore
            this.monthlyReflections = (this.dailyReflections*30).toFixed(3);
            //@ts-ignore
            this.yearlyReflections = (this.monthlyReflections*12).toFixed(3);

            //@ts-ignore
            this.dailyReflectionsFormatted = new Intl.NumberFormat().format(this.dailyReflections)
            
            //@ts-ignore
            this.monthlyReflectionsFormatted = new Intl.NumberFormat().format(this.monthlyReflections)

            //@ts-ignore
            this.yearlyReflectionsFormatted = new Intl.NumberFormat().format(this.yearlyReflections)
            
  }
  ngOnDestroy(){
    
  }
}
