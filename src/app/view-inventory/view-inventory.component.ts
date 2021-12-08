import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { InventoryService } from '../services/inventory.service';
export interface Section {
  name: string;
  updated: Date;
}
@Component({
  selector: 'app-view-inventory',
  templateUrl: './view-inventory.component.html',
  styleUrls: ['./view-inventory.component.scss']
})

export class ViewInventoryComponent implements OnInit {

  constructor(private inventoryService:InventoryService) { }

  ngOnInit(): void {
    this.getSubjectCategories()
  }
  categories:Category[] | any;
  getSubjectCategories(){
    this.inventoryService.getSubjectCategories().subscribe( res =>{
      this.categories = res;
      console.log(this.categories)
    });
  }
}
