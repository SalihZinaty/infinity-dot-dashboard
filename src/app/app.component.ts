import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import axios from 'axios';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'idot-rewards-calculator';
  innerHtml  = 'http://localhost:4003/burn';
  text = '';
  ngOnInit() {
   axios.get(this.innerHtml).then((res) => {
     this.text = res.data;
     console.log(this.text);
    })
  }
}
