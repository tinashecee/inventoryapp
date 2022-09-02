import { OnInit ,AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute} from "@angular/router";
import { Item } from '../models/item';
import { InventoryService } from '../services/inventory.service';
import * as html2pdf from 'html2pdf.js'

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class ListItemsComponent implements  AfterViewInit {


  displayedColumns: string[] = ['Device_Type', 'Name', 'Serial_#', 'Status', 'Expiration', 'Quantity', 'Supplier' , 'Price','Recorded_Date'];
  displayedColumns1: string[] = ['Device_Type', 'Name', 'Serial_#', 'Expiration', 'Quantity', 'Supplier' , 'Price','Recorded_Date'];
  
  dataSource: MatTableDataSource<Item> | any;
  dataSource1: MatTableDataSource<Item> | any;
  dataSource2: MatTableDataSource<Item> | any;
  dataSource3: MatTableDataSource<Item> | any;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  paginator1!: MatPaginator;
  paginator2!: MatPaginator;
  paginator3!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  sort1: MatSort = new MatSort;
  sort2: MatSort = new MatSort;
  sort3: MatSort = new MatSort;
  items:Item[] | any;
  items1:Item[] | any;
  items2:Item[] | any;
  items3:Item[] | any;
  constructor(private route: ActivatedRoute, private inventoryService: InventoryService) {

    //this.route.params.subscribe( params => console.log(params) );
    this.inventoryService.getSubjectUnallocatedItems().subscribe(res=>{
      this.items=res;
      this.dataSource = new MatTableDataSource(this.items);
    }) 
    this.inventoryService.getSubjectUnallocatedConsumables().subscribe(res=>{
      this.items1=res;
      this.dataSource1 = new MatTableDataSource(this.items1);
    }) 
    this.inventoryService.getSubjectAllocatedItems().subscribe(res=>{
      this.items2=res;
      this.dataSource2 = new MatTableDataSource(this.items2);
    }) 
    this.inventoryService.getSubjectAllocatedConsumables().subscribe(res=>{
      this.items3=res;
      this.dataSource3 = new MatTableDataSource(this.items3);
    }) 
    // Assign the data to the data source for the table to render
   
  }
   getIimeConverter(timestamp:any){
    if(timestamp){
     const milliseconds = timestamp.seconds * 1000 // 1575909015000
     
     const dateObject = new Date(milliseconds)
     
     const humanDateFormat = dateObject.toLocaleString() 
    return humanDateFormat
    }
    else{
      return "";
    }
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource1.paginator1 = this.paginator1;
    this.dataSource1.sort1 = this.sort1;

    this.dataSource2.paginator2 = this.paginator2;
    this.dataSource2.sort2 = this.sort2;

    this.dataSource3.paginator = this.paginator3;
    this.dataSource3.sort = this.sort3;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilter1(event: Event) {
    const filterValue1 = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue1.trim().toLowerCase();

    if (this.dataSource1.paginator1) {
      this.dataSource1.paginator1.firstPage();
    }
  }
  applyFilter2(event: Event) {
    const filterValue2 = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue2.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator2.firstPage();
    }
  }
  applyFilter3(event: Event) {
    const filterValue3 = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue3.trim().toLowerCase();

    if (this.dataSource3.paginator3) {
      this.dataSource3.paginator3.firstPage();
    }
  }
  download(){
    var element = document.getElementById('table');
var opt = {
  margin:       1,
  filename:     'download.pdf',
  image:        { type: 'jpeg', quality: 0.98 },
  html2canvas:  { scale: 2 },
  jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
};
 
// New Promise-based usage:
html2pdf().from(element).set(opt).save();
  }
}

