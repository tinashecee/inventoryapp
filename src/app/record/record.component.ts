import { OnInit ,AfterViewInit, Component, ViewChild, Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { InventoryService } from '../services/inventory.service';
import { Item } from '../models/item';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit,AfterViewInit {
  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  isEditable = false;
  displayedColumns: string[] = ['Asset_Type', 'Name', 'Serial_#', 'Status','Recorded_Date'];
  dataSource: MatTableDataSource<Item> | any;

  displayedColumns1: string[] = ['Consumable_Type', 'Name', 'Serial_#', 'Quantity','Recorded_Date'];
  dataSource1: MatTableDataSource<Item> | any;
  clickedRows = new Set<Item>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  items1:Item[] | any;
  items:Item[] | any;
  constructor(private _formBuilder: FormBuilder, private _bottomSheet: MatBottomSheet, private inventoryService: InventoryService) {

    //this.route.params.subscribe( params => console.log(params) );
    this.inventoryService.getSubjectUnallocatedItems().subscribe(res=>{
      this.items=res;

      this.dataSource = new MatTableDataSource(this.items);
    })
    this.inventoryService.getSubjectUnallocatedConsumables().subscribe(res=>{
      this.items1=res;
      this.dataSource1 = new MatTableDataSource(this.items1);
    }) 
   }
  openBottomSheet(id:string,a:string,b:string, c:string, d:string, e:number): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet, {
      data: { id:id,device_name:a ,device_serial_number: b, item_expiration: c, item_name: d, item_quantity:e}});
  }
  getIimeConverter(timestamp:any){

    const milliseconds = timestamp.seconds * 1000 // 1575909015000
    
    const dateObject = new Date(milliseconds)
    
    const humanDateFormat = dateObject.toLocaleString() 
   return humanDateFormat
 }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }
}
@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet-overview-example-sheet.html',
})
export class BottomSheetOverviewExampleSheet {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;
  fifthFormGroup!: FormGroup;
  sixthFormGroup!: FormGroup;
  isLinear = true;
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {id:string,device_name: string,device_serial_number:string, item_expiration:string, item_name:string, item_quantity:number},private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>,private _formBuilder: FormBuilder, private inventoryService: InventoryService) {
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
    this.sixthFormGroup = this._formBuilder.group({
      sixthCtrl: ['', Validators.required]
    });
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  record(){
    this._bottomSheetRef.dismiss();
    let date: Date = new Date(); 
    let data = {
      recepient_name:this.firstFormGroup.get('firstCtrl')?.value,
      recepient_province:this.secondFormGroup.get('secondCtrl')?.value,
      recepient_office:this.thirdFormGroup.get('thirdCtrl')?.value,
      recepient_department:this.fourthFormGroup.get('fourthCtrl')?.value,
      recepient_position:this.fifthFormGroup.get('fifthCtrl')?.value,
      quantity:this.sixthFormGroup.get('sixthCtrl')?.value,
      device_name:this.data.device_name,
      device_type:this.data.item_name,
      item_expiration:this.data.item_expiration,
      device_serial_number:this.data.device_serial_number,
      allocationDate:date

    }
    if(this.data.item_quantity<this.sixthFormGroup.get('sixthCtrl')?.value){
      this.inventoryService.openSnackBar("Invalid Amount! Alloted more items that available","Cancel")
    }else{
      let g=this.data.item_quantity - this.sixthFormGroup.get('sixthCtrl')?.value
    this.inventoryService.allocateDevice(this.data.id,data,this.firstFormGroup.get('firstCtrl')?.value+" "+this.data.device_serial_number,g,this.sixthFormGroup.get('sixthCtrl')?.value)
  }
}

}