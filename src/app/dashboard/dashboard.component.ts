import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { Item } from '../models/item';
import { AuthService } from '../services/auth.service';
import { InventoryService } from '../services/inventory.service';
export interface Data1{
  name:string,
  percentage:number
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,AfterViewInit {
  items:Item[] | any;
  categories:Category[] | any;
  data1:Data1[] | any;
  count = 0;
  count1 = 0;
  constructor(public authService:AuthService, private inventoryService:InventoryService) {
    /*this.inventoryService.getSubjectItems().subscribe(res=>{
      this.items=res;
      console.log(this.items)
      this.items.array.forEach((e: Item) => {
        if(e.status == "available" && e.item_quantity != null)
        this.count+= e.item_quantity
        
      });
    }) */
   }

  ngOnInit(): void {
    this.getSubjectItems()
    
   
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getSubjectCategories()
  }, 5000);
  }

  getSubjectItems(){
    this.inventoryService.getSubjectItems().subscribe( res =>{
      this.items = res;
      
      this.items.forEach((e: Item) => {
        if(e.status == "available" && e.item_quantity != null){
        this.count+= e.item_quantity
        }
        if(e.status == "alloted" && e.item_quantity != null){
          this.count1+=e.item_quantity
        }
        
      });
     
    });
  }
  getPillColor(n:number){
     
       return 'primary'
     
  }
  getSubjectCategories(){
    let data2:Data1[]=[]
    this.inventoryService.getSubjectCategories().subscribe( res =>{
      this.categories = res;
      this.categories.forEach((element:Category) => {
        let count = 0
       this.items.forEach((elem:Item) => {
        
          if(element.name == elem.item_name && elem.item_quantity && elem.status == "available"){
             count+=elem.item_quantity
             
          }
        });
       
        let df:Data1={
          name:element.name+"",
          percentage:count
        }
       data2.push(df)
        
      });
      this.data1=data2
    });
  }
}
