import { OnInit ,AfterViewInit, Component, ViewChild, Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Allocation } from '../models/allocation';
import { Record } from '../models/record';
import { InventoryService } from '../services/inventory.service';
import * as html2pdf from 'html2pdf.js'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['Name', 'ID', 'Department', 'Position','Type','Device','Quantity','Serial_#','Allocation_Date','Expiration'];
  dataSource: MatTableDataSource<Allocation> | any;
  allocations:Allocation[] | any;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  constructor(private inventoryService: InventoryService) {
    this.inventoryService.getSubjectAllocations().subscribe(res=>{
      this.allocations=res;
      this.dataSource = new MatTableDataSource(this.allocations);
    }) 
   }
   getIimeConverter(timestamp:any){

    const milliseconds = timestamp.seconds * 1000 // 1575909015000
    
    const dateObject = new Date(milliseconds)
    
    const humanDateFormat = dateObject.toLocaleString() 
   return humanDateFormat
 }
  ngOnInit(): void {
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
