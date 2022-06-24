import { OnInit ,AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Record } from '../models/record';
import { InventoryService } from '../services/inventory.service';
import * as html2pdf from 'html2pdf.js'

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['User', 'Task', 'Date', 'Details'];
  dataSource: MatTableDataSource<Record> | any;
  report:Record[] | any;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  operations:Record[] | any
  ngOnInit(): void {
  }

  constructor(private inventoryService: InventoryService) {
    //this.route.params.subscribe( params => console.log(params) );
    this.inventoryService.getSubjectReport().subscribe(res=>{
      this.operations=res;
      this.dataSource = new MatTableDataSource(this.operations);
    }) 
   
  }
  getStringObj(a:any){
    return(JSON.stringify(a))
  }
  getIimeConverter(timestamp:any){

    const milliseconds = timestamp.seconds * 1000 // 1575909015000
    
    const dateObject = new Date(milliseconds)
    
    const humanDateFormat = dateObject.toLocaleString() 
   return humanDateFormat
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
