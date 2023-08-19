import { Component, Inject } from '@angular/core';
import { Server } from 'src/app/Server/Server';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Customer } from 'src/app/models/customer.models';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'bottom-sheet-overview-sheet',
  templateUrl: './CustomerSheetInput.componemt.html',
  template: 'passed in {{data.customer}}',
})
export class CustomerSheetInputComponent {
  customerForm: FormGroup;
  job: String | null = null;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<CustomerSheetInputComponent>,
    private _snakeBar: MatSnackBar,
    private _from: FormBuilder,
    private server: Server,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: { customer: Customer }
  ) {
    this.job =
      data.customer.customerID === null
        ? 'Create New Customer'
        : `Edit Customer : ${data.customer.customerID}`;
    this.customerForm = this._from.group({
      customerName: [data.customer.customerName, Validators.required],
      customerAddress: [data.customer.customerAddress],
      customerContact: [data.customer.customerContact],
      customerPhoneNumber: [data.customer.customerPhoneNumber],
      customerType: [data.customer.customerType, Validators.required],
    });
  }

  onSubmit(customer: any) {
    let submitCustomer: Customer = {
      customerID: this.data.customer.customerID,
      customerAddress: customer.customerAddress,
      customerContact: customer.customerContact,
      customerName: customer.customerName,
      customerPhoneNumber: Number(customer.customerPhoneNumber),
      customerType: customer.customerType,
    };
    if (!this.customerForm.valid) {
      return;
    }
    let url =
      submitCustomer.customerID === null
        ? 'createNewCustomer'
        : 'updateCustomer';
    this.server.submitCustomerToServer(url, submitCustomer).subscribe(
      (response) => {
        console.log(response);
        this._snakeBar.open('user submit', 'Undo', {
          duration: 3000,
        });
        this._bottomSheetRef.dismiss(200);
      },
      (error) => {
        console.log(error);
        this._snakeBar.open('could not submit', 'Undo', {
          duration: 3000,
        });
      }
    );
  }
}
