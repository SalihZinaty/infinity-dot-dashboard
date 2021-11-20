import { Component, OnDestroy, OnInit } from '@angular/core';
import { BscscanService } from './services/bscscan.service';
import { BSC_IDOT_SEARCH_ADDRESS_URL, BURN_WALLET, INITIAL_VOLUME, LP_WALLET, REFLECTION_PERCENT, TOTAL_TOKENS } from './utils/constants';
import { FormGroup, FormControl, Validators } from '@angular/forms'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  rewardsForm:any;
  totalEarnedRewards = 0;
  addressBalance: Number = 0;
  polkaDotPrice: Number = 0;
  totalIdotVolume = 0;
  totalDistributedRewards = 0;
  totalDistributedRewardsDOT = 0;
  totalEarnedRewardsInUSD = 0;
  constructor(private bscscanService: BscscanService){}
  async ngOnInit() {
    this.initiateRewardsForm();
    let recent_volumes = 0;
    (await this.bscscanService.getAllVolumes()).subscribe(async (volumes) => {
      volumes.map((vol: number) => recent_volumes = recent_volumes + vol);
      this.totalIdotVolume = INITIAL_VOLUME + recent_volumes;
      this.totalDistributedRewards = Number((this.totalIdotVolume * 0.08).toFixed(3));
      //@ts-ignore
      this.polkaDotPrice = await (await this.bscscanService.getPolkaDotPrice());
      //@ts-ignore
      this.totalDistributedRewardsDOT = (this.totalDistributedRewards/this.polkaDotPrice).toFixed(4)
    })
  }
  initiateRewardsForm() {
    this.rewardsForm = new FormGroup({
      walletAddress: new FormControl('',[])
    })

    this.rewardsForm.controls['walletAddress'].valueChanges.subscribe(async (address:any) => {
      await (await this.bscscanService.getAddressRewards(address)).subscribe(async (res) => {
        this.totalEarnedRewards = res;
        //@ts-ignore
       this.polkaDotPrice = await (await this.bscscanService.getPolkaDotPrice());
       //@ts-ignore
       this.totalEarnedRewardsInUSD = this.totalEarnedRewards * this.polkaDotPrice;
      });
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
