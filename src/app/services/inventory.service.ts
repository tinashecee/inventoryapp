import { Component, Injectable, NgZone } from '@angular/core';
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
import {MatDialog} from '@angular/material/dialog';
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
  itemsCollectionb: AngularFirestoreCollection<Item> | undefined;
  itemsb:Observable<Item[]> | undefined;
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
  public items1b= new BehaviorSubject<Item[]>([]);
  items2b = this.items1b.asObservable();
  public items1c= new BehaviorSubject<Item[]>([]);
  items2c = this.items1c.asObservable();
  public items1d= new BehaviorSubject<Item[]>([]);
  items2d = this.items1d.asObservable();
  public allocations1= new BehaviorSubject<Allocation[]>([]);
  allocations2 = this.allocations1.asObservable();
  public report1= new BehaviorSubject<Record[]>([]);
  report2 = this.report1.asObservable();
  constructor(private firestore: AngularFirestore, private _snackBar: MatSnackBar, public dialog: MatDialog,private authService:AuthService) { 
    this.getCategories()
    this.getItems()
    this.getUnallocatedItems()
    this.getUnallocatedConsumable()
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
    this.dialog.open(DialogElementsExampleDialo,{
      maxWidth: '100vw',
      width: '80%',
      panelClass: 'full-screen-modal'
      ,disableClose: true
    });
    return new Promise<any>((resolve, reject) =>{
      
        this.firestore
            .collection("item_category")
            .add(data)
            .then(res => {
              this.dialog.closeAll()
              this.makeAreport('create category',data.toString())
              this.openSnackBar("Item Category Added","Cancel")})
            .catch(err => {
              this.dialog.closeAll()
              this.openSnackBar("Error Occured","Cancel")});
    });
}
addItem(data:any,nam:string) {
  this.dialog.open(DialogElementsExampleDialo,{
    maxWidth: '100vw',
    width: '80%',
    panelClass: 'full-screen-modal'
    ,disableClose: true
  });
  return new Promise<any>((resolve, reject) =>{
    
      this.firestore
          .collection("it_inventory")
          .add(data)
          .then(res => {
            this.dialog.closeAll();
            this.makeAreport('add item',nam+"/"+data.item_serial_number)
            this.openSnackBar("Item Added","Cancel")})
          .catch(err => {
            this.dialog.closeAll();
            this.openSnackBar("Error Occured","Cancel")});
  });
}
allocateDevice(id:string,data:any,nam:string,g:number,q:number) {
  this.dialog.open(DialogElementsExampleDialo,{
    maxWidth: '100vw',
    width: '80%',
    panelClass: 'full-screen-modal'
    ,disableClose: true
  });
  return new Promise<any>((resolve, reject) =>{
    if(g==0){
      this.firestore
          .collection("allocations")  
          .add(data)
          .then(res => {
            
            let date: Date = new Date(); 
            this.firestore.doc<Item>(`it_inventory/${id}`).update({
              status:"alloted",
              item_quantity:g,
              updatedAt:''+date
          }
          
          ).then(res=>{
            let run = true
            const querySnapshot =   this.firestore.collection('item_category', ref => ref.where('name', '==', data.device_type));
            querySnapshot.snapshotChanges().pipe(
              map(actions => actions.map(a => {   
                const data = a.payload.doc.data() as Category;
                data.id = a.payload.doc.id;
                return data;
              }))).subscribe((_doc: any) => {
               let quantity = _doc[0].quantity_allocated + q
               console.log(quantity)
               if(run == true){
               this.firestore.doc(`item_category/${_doc[0].id}`).update({quantity_allocated: quantity})
               run = false
               }
              }) 
            this.dialog.closeAll();
            this.makeAreport('allot item',nam+"/"+data.item_serial_number)
            this.openSnackBar("Item Allocation was successful","Cancel")}) .catch(err => {this.dialog.closeAll();this.openSnackBar("Error Occured","Cancel")});
            })
          .catch(err => {
            this.dialog.closeAll();
            this.openSnackBar("Error Occured","Cancel")});
          }else{

            this.firestore
          .collection("allocations")  
          .add(data)
          .then(res => {
            
            let date: Date = new Date(); 
            this.firestore.doc<Item>(`it_inventory/${id}`).update({
              item_quantity:g,
              updatedAt:''+date
          }
          
          ).then(res=>{
            let run = true
            const querySnapshot =   this.firestore.collection('item_category', ref => ref.where('name', '==', data.device_type));
            querySnapshot.snapshotChanges().pipe(
              map(actions => actions.map(a => {   
                const data = a.payload.doc.data() as Category;
                data.id = a.payload.doc.id;
                return data;
              }))).subscribe((_doc: any) => {
               let quantity = _doc[0].quantity_allocated + q
               console.log(quantity)
               if(run == true){
               this.firestore.doc(`item_category/${_doc[0].id}`).update({quantity_allocated: quantity})
               run = false
               }
              }) 
            this.dialog.closeAll();
            this.makeAreport('allot item',nam+"/"+data.item_serial_number)
            this.openSnackBar("Device Allocation was successful","Cancel")}) .catch(err => {this.dialog.closeAll();this.openSnackBar("Error Occured","Cancel")});
            })
          .catch(err => {
            this.dialog.closeAll();
            this.openSnackBar("Error Occured","Cancel")});
          }
  });
}
deleteCategory(data:string){
  this.dialog.open(DialogElementsExampleDialo,{
    maxWidth: '100vw',
    width: '80%',
    panelClass: 'full-screen-modal'
    ,disableClose: true
  });
  this.firestore.collection('/item_category', ref => ref.where('name', '==', data)).get()
  .subscribe((querySnapshot) => {
     querySnapshot.forEach((doc) => {
        doc.ref
           .delete()
           .then(() => {
            this.dialog.closeAll();
             this.makeAreport('delete category',data)
            this.openSnackBar("Category successfully Deleted!","Cancel")
              console.log('Document successfully Deleted!');
           })
           .catch((error) => {
            this.dialog.closeAll();
              console.error('Error removing category: ', error);
              this.openSnackBar("Error removing category","Cancel")
           });
     });
  });
}
deleteItem(id:string,nam:string){
  this.dialog.open(DialogElementsExampleDialo,{
    maxWidth: '100vw',
    width: '80%',
    panelClass: 'full-screen-modal'
    ,disableClose: true
  });
  this.firestore.collection(`it_inventory`).doc(id)
  .delete().then(() => {
            this.dialog.closeAll();
            this.makeAreport('delete item',nam)
            this.openSnackBar("Item successfully Deleted!","Cancel")
              console.log('Item successfully Deleted!');
           })
           .catch((error) => {
            this.dialog.closeAll();
              console.error('Error removing item: ', error);
              this.openSnackBar("Error removing item","Cancel")
           });
     
  
};
updateItems(id:string,description:string,quantity:number,expiry:string){
  this.dialog.open(DialogElementsExampleDialo,{
    maxWidth: '100vw',
    width: '80%',
    panelClass: 'full-screen-modal'
    ,disableClose: true
  });
  let date: Date = new Date(); 
  this.firestore.doc<Item>(`it_inventory/${id}`).update({
    item_description:description,
    item_quantity:quantity,
    item_expiration:expiry,
    updatedAt:''+date
}).then(() => {
  this.dialog.closeAll();
  this.makeAreport('update item',description)
  this.openSnackBar("Item successfully Updated!","Cancel")
    console.log('Item successfully Updated!');
 })
 .catch((error) => {
    this.dialog.closeAll();
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
  this.itemsCollectiona = this.firestore.collection('it_inventory', ref => ref.where('status', '!=', 'alloted').where('item_type', '==', 'asset'));
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
getUnallocatedConsumable() { 
  this.itemsCollectionb = this.firestore.collection('it_inventory', ref => ref.where('item_quantity', '>=', 0).where('item_type', '==', 'consumable'));
  this.itemsb = this.itemsCollectionb.snapshotChanges().pipe(map(changes =>{
    return changes.map(a =>{
      const data = a.payload.doc.data() as Item;
      data.id = a.payload.doc.id;
      return data;
    });
  }));
  this.itemsb.subscribe(res=>{
    let data = res
    this.items1b.next(data);
  })
}
getAllocatedItems() { 
  this.itemsCollectiona = this.firestore.collection('it_inventory', ref => ref.where('status', '==', 'alloted').where('item_type', '==', 'asset'));
  this.itemsa = this.itemsCollectiona.snapshotChanges().pipe(map(changes =>{
    return changes.map(a =>{
      const data = a.payload.doc.data() as Item;
      data.id = a.payload.doc.id;
      return data;
    });
  }));
  this.itemsa.subscribe(res=>{
    let data = res
    this.items1c.next(data);
  })
}
getAllocatedConsumable() { 
  this.itemsCollectionb = this.firestore.collection('it_inventory', ref => ref.where('item_quantity', '==', 0).where('item_type', '==', 'consumable'));
  this.itemsb = this.itemsCollectionb.snapshotChanges().pipe(map(changes =>{
    return changes.map(a =>{
      const data = a.payload.doc.data() as Item;
      data.id = a.payload.doc.id;
      return data;
    });
  }));
  this.itemsb.subscribe(res=>{
    let data = res
    this.items1d.next(data);
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
getSubjectUnallocatedConsumables(){
  return this.items2b;
}
getSubjectAllocatedItems(){
  return this.items2c;
}
getSubjectAllocatedConsumables(){
  return this.items2d;
}
getSubjectAllocations(){
  return this.allocations2;
}
openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action);
}
}
@Component({
  selector: 'dialog-elements-example-dialo',
  templateUrl: 'dialog-elements-example-dialo.html',
})
export class DialogElementsExampleDialo {}
