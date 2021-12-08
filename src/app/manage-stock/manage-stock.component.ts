import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { InventoryService } from '../services/inventory.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Item } from '../models/item';
interface Cat {
  value: string;
  viewValue: string;
}
export interface Category {
  description:string;
  type:string;
  name:string;

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
  fourthFormGroup!: FormGroup;
  fifthFormGroup!: FormGroup;
  firstFormGroup1!: FormGroup;
  secondFormGroup1!: FormGroup;
  thirdFormGroup1!: FormGroup;
  isOptional = false;
  categories:any;
  filterValue:any;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  categoryType: Cat[] = [
    {value: 'network', viewValue: 'Network'},
    {value: 'software', viewValue: 'Software'},
    {value: 'hardware', viewValue: 'Hardware'},
  ];
  myControl = new FormControl('d');
  options: Category[] = [];
  filteredOptions: Observable<Category[]> | any;
  items: Item[] | any;
  constructor(private _formBuilder: FormBuilder,public dialog: MatDialog, private inventoryService: InventoryService) {}

  openDialog(name:string) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog , {
      data: {
        name:name
      }});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openDialog1(id:string,name:string,desc: string, qnty: number) {
    const dialogRef = this.dialog.open(EditItemDialog , {
      data: {
        id:id,
        item_name:name,
        item_description:desc,
        item_quantity:qnty


      }});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: '',
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ['', Validators.required]
    });
    this.fifthFormGroup = this._formBuilder.group({
      fifthCtrl: ['', Validators.required]
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
    this.getSubjectCategories();
    this.getSubjectItems();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.options.slice())),
    );
  }
  isDisabled(){
    if(this.filterValue != null && this.filterValue != ""){
       return false;
    }
    return true;
  } 
  displayFn(user: Category): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): Category[] {
    this.filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(this.filterValue));
  }
  createCategory() {
    let data={
      name:this.firstFormGroup1.get('firstCtrl1')?.value,
      description:this.secondFormGroup1.get('secondCtrl1')?.value,
      type:this.thirdFormGroup1.get('thirdCtrl1')?.value,
    }
    this.inventoryService.createCategory(data,this.firstFormGroup1.get('firstCtrl1')?.value);  
  }
  addItem(){
    let dat: Date = new Date(); 
    let data = { 
      item_name:this.filterValue,
      item_serial_number:this.secondFormGroup.get('secondCtrl')?.value,
      item_description:this.thirdFormGroup.get('thirdCtrl')?.value,
      item_expiration:this.fourthFormGroup.get('fourthCtrl')?.value,
      item_quantity:this.fifthFormGroup.get('fifthCtrl')?.value,
      status:"available",
      createdAt:dat
    }
   this.inventoryService.addItem(data,this.thirdFormGroup.get('thirdCtrl')?.value)
  }
  getSubjectCategories(){
    this.inventoryService.getSubjectCategories().subscribe( res =>{
      let data = res;
      let data1:Category[] = [];
      data.forEach(e=>{
        let str1 = ''+e.name;
        let str2 = ''+e.description;
        let str3 = ''+e.type;
        data1.push({
          name:str1,
          description:str2,
          type:str3
        })
      })
      this.options = data1;
    });
  }
  getSubjectItems(){
    this.inventoryService.getSubjectItems().subscribe( res =>{
      this.items = res;
    });
  }
 
  
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data:{name: string}, private db: InventoryService) {
    
  }
  deleteCategory(name:string){
    this.db.deleteCategory(name)
  }
}

@Component({
  selector: 'edit-item-dialog',
  templateUrl: 'edit-item-dialog.html',
})
export class EditItemDialog {
  editItemFormGroup1!: FormGroup;
  editItemFormGroup2!: FormGroup;
  editItemFormGroup3!: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data:{id:string,item_name: string, item_description: string, item_quantity: number }, private db: InventoryService, private _formBuilder: FormBuilder) {
    this.editItemFormGroup1 = this._formBuilder.group({
      itemDescCtrl: ['', Validators.required]
    });
    this.editItemFormGroup2 = this._formBuilder.group({
      itemQntyCtrl: '',
    });
    this.editItemFormGroup3 = this._formBuilder.group({
      itemExpiryCtrl: '',
    });
  }
  updateItem(){
    this.db.updateItems(this.data.id, this.editItemFormGroup1.get('itemDescCtrl')?.value, this.editItemFormGroup2.get('itemQntyCtrl')?.value, this.editItemFormGroup3.get('itemExpiryCtrl')?.value)
  }
  deleteItem(){
    this.db.deleteItem(this.data.id,this.editItemFormGroup1.get('itemDescCtrl')?.value)
  }
}