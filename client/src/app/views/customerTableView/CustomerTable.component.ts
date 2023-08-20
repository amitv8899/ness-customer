import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer.models';
import { CustomerSheetInputComponent } from 'src/app/views/customerSheetInputView/CustomerSheetInput.componemt';
import { Server } from 'src/app/Server/Server';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customerTable',
  templateUrl: './customerTable.component.html',
  styleUrls: [],
})
export class CustomerTableComponent {
  constructor(
    private _bottomSheet: MatBottomSheet,
    private _snakeBar: MatSnackBar,
    private server: Server
  ) {}

  dataSource: Customer[] = [];
  displayData = this.dataSource; // for filter the data
  curTypeToShow: String = 'All';
  from: Number | null = null;
  to: Number | null = null;

  menuCustomerType: String[] = ['All'];
  displayedColumns: string[] = [
    'customerID',
    'customerName',
    'customerAddress',
    'customerPhoneNumber',
    'customerContact',
    'actions',
  ];
  getData() {
    this.server.getCustomers('getAllCustomers').subscribe({
      next: (value) => {
        this.dataSource = value.data.map((customerJson: any) => ({
          customerID: customerJson.ID,
          customerName: customerJson.customerName,
          customerAddress: customerJson.customerAddress,
          customerContact: customerJson.customerContact,
          customerPhoneNumber: customerJson.customerPhoneNumber,
          customerType: customerJson.customerType,
        }));
        this.displayData = this.dataSource;
        this.menuCustomerType = [
          'All',
          ...new Set(this.dataSource.map((customer) => customer.customerType)),
        ];
      },
      error: (error) => {
        this._snakeBar.open(error.message, 'Undo', {
          duration: 3000,
        });
      },
      complete: () => {},
    });
  }

  ngOnInit() {
    this.getData();
  }

  openBottomSheet(id: Number | null): void {
    const bottomRef = this._bottomSheet.open(CustomerSheetInputComponent, {
      data: {
        customer:
          id !== null
            ? {
                ...this.dataSource.find(
                  (customer) => customer.customerID === id
                ),
              }
            : {
                customerID: null,
                customerName: '',
                customerAddress: '',
                customerContact: '',
                customerPhoneNumber: '',
                customerType: '',
              },
      },
    });
    bottomRef.afterDismissed().subscribe((res) => {
      if (res === 200 || res === 201) {
        this.getData();
      }
    });
  }

  onDelete(id: Number) {
    this.server.deleteCustomer('deleteCustomer', id).subscribe({
      next: (value) => {
        this.getData();
        this._snakeBar.open(`customer: ${id} was deleted`, 'Undo', {
          duration: 3000,
        });
      },
      error: (error) => {
        this._snakeBar.open(error.message, 'Undo', {
          duration: 3000,
        });
      },
      complete: () => {},
    });
  }

  onApplyFilters() {
    // can be replace by calling this.server.get('/getFilterCustomers') with params of : from,to and type and filter will be done by sql command,for large acale of customers
    const filteredCustomers = this.dataSource.filter((customer) => {
      if (customer.customerID === null) {
        return true;
      }
      if (this.from !== null && customer.customerID < this.from) {
        return false;
      }
      if (this.to !== null && customer.customerID > this.to) {
        return false;
      }
      if (
        this.curTypeToShow !== 'All' &&
        customer.customerType !== null &&
        customer.customerType !== this.curTypeToShow
      ) {
        return false;
      }
      return true;
    });
    this.displayData = filteredCustomers;
  }
}
