import { Component, OnDestroy, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import axios from 'axios';
import { BscscanService } from './services/bscscan.service';
import { BURN_WALLET, LP_WALLET } from './utils/constants';
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
  constructor(private bscscanService: BscscanService){}
  async ngOnInit() {
    (await this.bscscanService.getAddressBalance(BURN_WALLET)).subscribe(data => console.log(data,'ddd'));
    (await this.bscscanService.getAddressBalance(LP_WALLET)).subscribe(data => console.log(data,'ddd'));

  }
  ngOnDestroy(){
    
  }
}
