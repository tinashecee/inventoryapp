import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { InventoryService } from '../services/inventory.service';
import {FormGroup, FormControl} from '@angular/forms';
import { Allocation } from '../models/allocation';
export interface Data1{
  name:string,
  percentage:number
}
@Component({
  selector: 'app-allocations',
  templateUrl: './allocations.component.html',
  styleUrls: ['./allocations.component.scss']
})
export class AllocationsComponent implements OnInit,AfterViewInit {
  selected1!: Date | null;
  selected!: Date | null;
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
  constructor( private inventoryService: InventoryService) { }
  data1:Data1[] | any;
  items2:Category[] | any;
  data:Allocation[] | any;
  categories:Category[] | any;
  ngOnInit(): void {
    
    this.inventoryService.getSubjectCategories().subscribe(res=>{
      this.items2=res;
    })  
    this.barc()
    
  }
  ngAfterViewInit() {
    setTimeout(() => {
      //this.getSubjectCategories()
  }, 5000);
  }
  
 barc(){
  this.inventoryService.getSubjectAllocations().subscribe(res=>{
    this.data=res;
    console.log(this.data)
    this.data.forEach(d=>{
      const milliseconds = d.allocationDate.seconds * 1000 // 1575909015000
    
    const date = new Date(milliseconds)
     
      console.log("Date: "+date.getDate()+
          "/"+(date.getMonth()+1)+
          "/"+date.getFullYear());
    })
  }) 
 }
 

}
