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


  displayedColumns: string[] = ['Device_Type', 'Name', 'Serial_#', 'Status', 'Expiration' ,'Recorded_Date'];
  dataSource: MatTableDataSource<Item> | any;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  items:Item[] | any;
  constructor(private route: ActivatedRoute, private inventoryService: InventoryService) {

    //this.route.params.subscribe( params => console.log(params) );
    this.inventoryService.getSubjectItems().subscribe(res=>{
      this.items=res;
      this.dataSource = new MatTableDataSource(this.items);
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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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

