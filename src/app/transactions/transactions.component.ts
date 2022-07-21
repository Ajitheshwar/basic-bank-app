import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  constructor(private http : HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>('/transactions').subscribe({
      next : data => {
        //console.log(data.data)
        this.transactions = data.data
        this.transactions.reverse()
      },
      error : err =>{console.log("Error in getting transactions data ",err)}
    })
  }

  transactions : any[] = []

}
