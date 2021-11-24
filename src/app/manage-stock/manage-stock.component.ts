import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
interface Category {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-manage-stock',
  templateUrl: './manage-stock.component.html',
  styleUrls: ['./manage-stock.component.scss']
})
export class ManageStockComponent implements OnInit {
  selectedValue: string | undefined;
  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  firstFormGroup1!: FormGroup;
  secondFormGroup1!: FormGroup;
  thirdFormGroup1!: FormGroup;
  isOptional = false;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  categoryType: Category[] = [
    {value: 'network', viewValue: 'Network'},
    {value: 'software', viewValue: 'Software'},
    {value: 'hardware', viewValue: 'Hardware'},
  ];
  constructor(private _formBuilder: FormBuilder,public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.firstFormGroup1 = this._formBuilder.group({
      firstCtrl1: ['', Validators.required]
    });
    this.secondFormGroup1 = this._formBuilder.group({
      secondCtrl1: ['', Validators.required]
    });
    this.thirdFormGroup1 = this._formBuilder.group({
      thirdCtrl1: ['']
    });
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {}