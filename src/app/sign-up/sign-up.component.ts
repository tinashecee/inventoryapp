import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
//import validator and FormBuilder
import {  AbstractControl, FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent?.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  //Create FormGroup
  //Create FormGroup
  //requiredForm!: FormGroup;
  myForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(public authService: AuthService, private fb: FormBuilder) {
      //this.myForm();
      this.myForm = this.fb.group({
        name: ['', Validators.required ],
        email: ['', [Validators.required, 
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")] ],
        password: ['', [Validators.required]],
        confirmPassword: ['']
      }, { validator: this.checkPasswords });
     }
     
    /*
  myForm() {
    this.requiredForm = this.fb.group({
    name: ['', Validators.required ],
    email: ['', [Validators.required, 
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")] ],
      password: 
        [
          Validators.required,
         ],
         confirmPassword: ['']
    }, { validator: this.checkPasswords
    });
 }*/
 checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
  let pass = group.get('password')?.value;
  let confirmPass = group.get('confirmPassword')?.value
  return pass === confirmPass ? null : { notSame: true }
}
  ngOnInit(): void {
  }

}
