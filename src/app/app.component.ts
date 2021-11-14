import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import axios from 'axios';
import { BscscanService } from './services/bscscan.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'idot-rewards-calculator';
  innerHtml  = 'http://localhost:4003/burn';
  text = '';

  constructor(private bscscanService: BscscanService){}
  ngOnInit() {
    let a = this.bscscanService.getAddresses();
    console.log(a,'from here!!');
  }
}
