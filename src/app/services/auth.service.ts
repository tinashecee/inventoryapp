import { Component, Injectable, NgZone } from '@angular/core';
import { User } from "../models/user";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { InventoryService } from './inventory.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data
  public userEmail= new BehaviorSubject<string>("");
  userEmail1 = this.userEmail.asObservable();
  emailVeried=false;
  isUser = false;

  constructor(
    private afs: AngularFirestore,   // Inject Firestore service
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private router: Router,
    private ngZone: NgZone, // NgZone service to remove outside scope warning,
    private inventoryService: InventoryService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.getUser()
  }
 async getUser(){
  await this.afAuth.authState.subscribe(user => {
    if (user) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
      const album = userRef.valueChanges();
      let name: any,permissions: any,e;
      this.isUser=true;
      this.emailVeried=user.emailVerified;
      album.subscribe(value => {
        name = value.usersName;
        permissions = value.permissions;
        e = value.email;
        
      const userData: User = {
        uid: user.uid,
        email: user.email+'',
        displayName: user.displayName+'',
        photoURL: user.photoURL+'',
        emailVerified: user.emailVerified,
        permissions: permissions,
        usersName:name
      }
      this.userData = userData;
      localStorage.setItem('user', JSON.stringify(this.userData));
      let a:any
      a = localStorage.getItem('user')
      JSON.parse(a);
    })
      
    } else {
      localStorage.setItem('user', null || '{}');
      let a:any
      a = localStorage.getItem('user')
      JSON.parse(a);
    }
  })
 }
  // Sign in with email/password
  SignIn(email: any, password: any) {
    this.dialog.open(DialogElementsExampleDialog,{
      maxWidth: '100vw',
      width: '80%',
      panelClass: 'full-screen-modal'
      ,disableClose: true
    });
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.dialog.closeAll();
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
        this.userEmail.next(result.user?.email+'');
      }).catch((error) => {
        this.dialog.closeAll();
        this.openSnackBar(error.message,"Cancel")
      }) 
  }

  // Sign up with email/password
  SignUp(username:any, email:any, password:any) {
    this.dialog.open(DialogElementsExampleDialog,{
      maxWidth: '100vw',
      width: '80%',
      panelClass: 'full-screen-modal'
      ,disableClose: true
    });
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.dialog.closeAll();
        this.SendVerificationMail();
        this.SetUserData1(result.user,username);
      }).catch((error) => {
        this.dialog.closeAll();
        this.openSnackBar(error.message,"Cancel")
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    let a:any
    a= this.afAuth.auth.currentUser
    return a.sendEmailVerification()
    .then(() => {
      this.router.navigate(['verify-email']);
    })
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail:any) {
    this.dialog.open(DialogElementsExampleDialog,{
      maxWidth: '100vw',
      width: '80%',
      panelClass: 'full-screen-modal'
      ,disableClose: true
    });
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      this.openSnackBar('Password reset email sent, check your inbox.',"Cancel")
    }).catch((error) => {
      this.dialog.closeAll();
      this.openSnackBar(error.message,"Cancel")
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    let f:any
    f=localStorage.getItem('user')
    const user = JSON.parse(localStorage.getItem('user') || '{}');
   // return (user !== null && user.emailVerified !== false) ? true : false;
   
   if(this.isUser === true && this.emailVeried === false){ window.alert("Email not verified!")}
   return (this.emailVeried === true) ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider:any) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
      this.SetUserData(result.user);
    }).catch((error) => {
      this.openSnackBar(error.message,"Cancel")
    })
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user:any) {
    let date: Date = new Date(); 
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const album = userRef.valueChanges();
    let name: any,permissions: any,e;
    album.subscribe(value => {
      name = value.usersName;
      permissions = value.permissions;
      e = value.email;
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      permissions: permissions,
      usersName:name
    }
    this.userData=userData
    return userRef.set(userData, {
      merge: true
    })
    });
    
  }
  SetUserData1(user:any,name:string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    let date: Date = new Date(); 
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      permissions: "restricted",
      createdAt: date,
      usersName:name
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign out
  SignOut() {
    this.dialog.open(DialogElementsExampleDialog,{
      maxWidth: '100vw',
      width: '80%',
      panelClass: 'full-screen-modal'
      ,disableClose: true
    });
    return this.afAuth.auth.signOut().then(() => {
      this.dialog.closeAll();
      localStorage.removeItem('user');
      this.userData=null
      this.isUser = false
      this.emailVeried = false
      this.router.navigate(['sign-in']);
    })
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
 

}
@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'dialog-elements-example-dialog.html',
})
export class DialogElementsExampleDialog {}