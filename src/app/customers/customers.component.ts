import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  constructor(private http : HttpClient, private toastr : ToastrService) { }

  ngOnInit(): void {
    this.http.get<any>('/customers').subscribe({
      next : data =>{
        //console.log(data.data)
        this.customers = data.data
      },
      error : err =>{console.log("Error in getting customers data",err)}
    })
    this.allowTransfer = false;
    this.showLowBalance = false;
  }

  showText = ""
  showLowBalance : boolean = false;
  allowTransfer : boolean = false;
  cs : any[] = []
  customers : any[] = []
  custId = 0; 
  scrollToBottom(i : number){
    this.allowTransfer = true;
    this.custId = i
    this.cs = this.customers.filter((cust,id)=> {if(id!=i){
                                                  cust.i = id;
                                                  return true;
                                                }
                                                else{
                                                  return false;
                                                }
    })
    setTimeout(()=>{
      document.getElementById("view")?.scrollIntoView();
    },100)
  }

  submitForm(ref : NgForm){
    //console.log(ref.value)
    if(this.customers[this.custId].balance - ref.value.amount < 0){
      this.showLowBalance = true;
      this.showText = "Insufficient Balance. Your Balance : "+(this.customers[this.custId].balance)
    }
    else{
      this.showLowBalance = false;
      this.customers[this.custId].balance = this.customers[this.custId].balance - ref.value.amount
      this.customers[ref.value.to].balance = this.customers[ref.value.to].balance + ref.value.amount
      let user = {transaction : {from : this.customers[this.custId].name, to : this.customers[ref.value.to].name, amount : ref.value.amount, date : new Date().toDateString()},user : {fromId : this.customers[this.custId]._id, fromBalance : this.customers[this.custId].balance,toId : this.customers[ref.value.to]._id, toBalance : this.customers[ref.value.to].balance}}
      // console.log(this.custId+" "+this.customers[this.custId].name)
      // console.log(ref.value.to+" "+this.customers[ref.value.to].name)
      
      this.http.post<any>('/customers',user).subscribe({
        next : data =>{
          //console.log(data.message)
          this.toastr.success(data.message,"Success")
        },
        error : err => {console.log("Error in updating")}
      })
    }
  }

}
