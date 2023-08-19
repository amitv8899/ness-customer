import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.models';

@Injectable({
  providedIn: 'root', // providedIn: 'root' ensures a single instance across the app
})
export class Server {
  startPiont = 'http://localhost:5000';
  constructor(private http: HttpClient) {}

  getCustomers(endPiont: string): Observable<any> {
    let url = this.startPiont + '/' + endPiont;
    return this.http.get(url);
  }

  updateCustomer(endPiont: String, customer: Customer): Observable<any> {
    let url = this.startPiont + '/' + endPiont;
    return this.http.put(url, { customer: customer });
  }
  createCustomer(endPiont: String, customer: Customer): Observable<any> {
    let url = this.startPiont + '/' + endPiont;
    return this.http.post(url, { customer: customer });
  }
  deleteCustomer(endPiont: String, id: Number): Observable<any> {
    let url = this.startPiont + '/' + endPiont + `?ID=${id}`;
    return this.http.delete(url);
  }
  submitCustomerToServer(
    endPiont: String,
    customer: Customer
  ): Observable<any> {
    if (customer.customerID === null) {
      return this.createCustomer(endPiont, customer);
    } else {
      return this.updateCustomer(endPiont, customer);
    }
  }
}
