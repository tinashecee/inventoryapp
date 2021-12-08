import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from '../../../node_modules/rxjs/operators';
import {Category} from '../models/category';
import { BehaviorSubject } from 'rxjs'
import { Item } from '../models/item';
import { Allocation } from '../models/allocation';
import { Record } from '../models/record';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class InventoryService {
 categoriesCollection: AngularFirestoreCollection<Category> | undefined;
  categories:Observable<Category[]> | undefined;
  itemsCollection: AngularFirestoreCollection<Item> | undefined;
  items:Observable<Item[]> | undefined;
  itemsCollectiona: AngularFirestoreCollection<Item> | undefined;
  itemsa:Observable<Item[]> | undefined;
  reportCollection: AngularFirestoreCollection<Record> | undefined;
  report:Observable<Record[]> | undefined;
  allocationCollection: AngularFirestoreCollection<Allocation> | undefined;
  allocations:Observable<Allocation[]> | undefined;
  public categories1= new BehaviorSubject<Category[]>([]);
  categories2 = this.categories1.asObservable();
  public items1= new BehaviorSubject<Item[]>([]);
  items2 = this.items1.asObservable();
  public items1a= new BehaviorSubject<Item[]>([]);
  items2a = this.items1a.asObservable();
  public allocations1= new BehaviorSubject<Allocation[]>([]);
  allocations2 = this.allocations1.asObservable();
  public report1= new BehaviorSubject<Record[]>([]);
  report2 = this.report1.asObservable();
  constructor(private firestore: AngularFirestore, private _snackBar: MatSnackBar, private authService:AuthService) { 
    this.getCategories()
    this.getItems()
    this.getUnallocatedItems()
    this.getAllocations()
    this.getReport()
  }
  makeAreport(op:string,details:string){
    let email =  JSON.parse(localStorage.getItem('user') || '{}')
    
    let date: Date = new Date(); 
    let data:Record={
      user:email.email,
      date:date,
      operation:op,
      details:details
     
    }
    this.firestore
            .collection("report")
            .add(data)
  }
  createCategory(data:any,nam:string) {
    return new Promise<any>((resolve, reject) =>{
        this.firestore
            .collection("item_category")
            .add(data)
            .then(res => {
              this.makeAreport('create category',nam)
              this.openSnackBar("Item Category Added","Cancel")})
            .catch(err => {this.openSnackBar("Error Occured","Cancel")});
    });
}
addItem(data:any,nam:string) {
  return new Promise<any>((resolve, reject) =>{
      this.firestore
          .collection("it_inventory")
          .add(data)
          .then(res => {
            this.makeAreport('add item',nam)
            this.openSnackBar("Item Added","Cancel")})
          .catch(err => {this.openSnackBar("Error Occured","Cancel")});
  });
}
allocateDevice(id:string,data:any,nam:string) {
  return new Promise<any>((resolve, reject) =>{
    
      this.firestore
          .collection("allocations")
          .add(data)
          .then(res => {let date: Date = new Date(); 
            this.firestore.doc<Item>(`it_inventory/${id}`).update({
              status:"alloted",
              updatedAt:''+date
          }).then(res=>{
            this.makeAreport('allot item',nam)
            this.openSnackBar("Device Allocation was successful","Cancel")}) .catch(err => {this.openSnackBar("Error Occured","Cancel")});
            })
          .catch(err => {this.openSnackBar("Error Occured","Cancel")});
  });
}
deleteCategory(data:string){
  this.firestore.collection('/item_category', ref => ref.where('name', '==', data)).get()
  .subscribe((querySnapshot) => {
     querySnapshot.forEach((doc) => {
        doc.ref
           .delete()
           .then(() => {
             this.makeAreport('delete category',data)
            this.openSnackBar("Category successfully Deleted!","Cancel")
              console.log('Document successfully Deleted!');
           })
           .catch((error) => {
          
              console.error('Error removing category: ', error);
              this.openSnackBar("Error removing category","Cancel")
           });
     });
  });
}
deleteItem(id:string,nam:string){
  this.firestore.collection(`it_inventory`).doc(id)
  .delete().then(() => {
            this.makeAreport('delete item',nam)
            this.openSnackBar("Item successfully Deleted!","Cancel")
              console.log('Item successfully Deleted!');
           })
           .catch((error) => {
          
              console.error('Error removing item: ', error);
              this.openSnackBar("Error removing item","Cancel")
           });
     
  
};
updateItems(id:string,description:string,quantity:number,expiry:string){
  let date: Date = new Date(); 
  this.firestore.doc<Item>(`it_inventory/${id}`).update({
    item_description:description,
    item_quantity:quantity,
    item_expiration:expiry,
    updatedAt:''+date
}).then(() => {
  this.makeAreport('update item',description)
  this.openSnackBar("Item successfully Updated!","Cancel")
    console.log('Item successfully Updated!');
 })
 .catch((error) => {

    console.error('Error removing item: ', error);
    this.openSnackBar("Error removing item","Cancel")
 });
}
  getCategories() { 
    this.categoriesCollection = this.firestore.collection('item_category');
    this.categories = this.categoriesCollection.snapshotChanges().pipe(map(changes =>{
      return changes.map(a =>{
        const data = a.payload.doc.data() as Category;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
    this.categories.subscribe(res=>{
      let data = res
      this.categories1.next(data);
    })
}
getReport() { 
  this.reportCollection = this.firestore.collection('report');
  this.report = this.reportCollection.snapshotChanges().pipe(map(changes =>{
    return changes.map(a =>{
      const data = a.payload.doc.data() as Record;
      data.id = a.payload.doc.id;
      return data;
    });
  }));
  this.report.subscribe(res=>{
    let data = res
    this.report1.next(data);
  })
}
getItems() { 
  this.itemsCollection = this.firestore.collection('it_inventory');
  this.items = this.itemsCollection.snapshotChanges().pipe(map(changes =>{
    return changes.map(a =>{
      const data = a.payload.doc.data() as Item;
      data.id = a.payload.doc.id;
      return data;
    });
  }));
  this.items.subscribe(res=>{
    let data = res
    this.items1.next(data);
  })
}
getUnallocatedItems() { 
  this.itemsCollectiona = this.firestore.collection('it_inventory', ref => ref.where('status', '!=', 'alloted'));
  this.itemsa = this.itemsCollectiona.snapshotChanges().pipe(map(changes =>{
    return changes.map(a =>{
      const data = a.payload.doc.data() as Item;
      data.id = a.payload.doc.id;
      return data;
    });
  }));
  this.itemsa.subscribe(res=>{
    let data = res
    this.items1a.next(data);
  })
}
getAllocations() { 
  this.allocationCollection = this.firestore.collection('allocations');
  this.allocations = this.allocationCollection.snapshotChanges().pipe(map(changes =>{
    return changes.map(a =>{
      const data = a.payload.doc.data() as Allocation;
      data.id = a.payload.doc.id;
      return data;
    });
  }));
  this.allocations.subscribe(res=>{
    let data = res
    this.allocations1.next(data);
  })
}
getSubjectCategories(){
  return this.categories2;
}
getSubjectReport(){
  return this.report2;
}
getSubjectItems(){
  return this.items2;
}
getSubjectUnallocatedItems(){
  return this.items2a;
}
getSubjectAllocations(){
  return this.allocations2;
}
openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action);
}
}
