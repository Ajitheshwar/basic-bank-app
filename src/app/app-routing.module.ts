import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { HomeComponent } from './home/home.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
            {path : "home", component : HomeComponent},
            {path : "customers", component : CustomersComponent},
            {path : "transactions", component : TransactionsComponent},
            {path : '',pathMatch : "full", redirectTo: "/home"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
