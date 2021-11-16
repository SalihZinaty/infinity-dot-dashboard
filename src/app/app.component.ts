import { Component, OnDestroy, OnInit } from '@angular/core';
import { BscscanService } from './services/bscscan.service';
import { BURN_WALLET, LP_WALLET } from './utils/constants';
import { FormGroup, FormControl, Validators } from '@angular/forms'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'idot-rewards-calculator';
  innerHtml  = 'http://localhost:4003/burn';
  text = '';
  burnBalance = '';
  lpBalance = '';
  burnwalletBalance: number = 0;
  lpWalletBalance: number = 0;
  rewardsForm:any;
  constructor(private bscscanService: BscscanService){}
  async ngOnInit() {
    (await this.bscscanService.getAddressBalance(BURN_WALLET)).subscribe(data => this.burnwalletBalance = data);
    (await this.bscscanService.getAddressBalance(LP_WALLET)).subscribe(data => this.lpWalletBalance = data);
    this.initiateRewardsForm();
    
  }
  initiateRewardsForm() {
    this.rewardsForm = new FormGroup({
      walletAddress: new FormControl('',[]),
      volume: new FormControl('',[]),
      totalAddressBalance: new FormControl('',[]),
      lpBalance: new FormControl('',[]),
    })
  }
  ngOnDestroy(){
    
  }
}
