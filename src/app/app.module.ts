import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatCardModule} from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageComponent } from './homepage/homepage.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import { ViewInventoryComponent } from './view-inventory/view-inventory.component';
import { AddItemComponent } from './add-item/add-item.component';
import { RemoveItemComponent } from './remove-item/remove-item.component';
import { BottomSheetOverviewExampleSheet, RecordComponent } from './record/record.component';
import { ReportComponent } from './report/report.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { DisplayComponent } from './display/display.component';
import { environment } from "src/environments/environment";
import { AngularFireModule} from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from "@angular/fire/auth";
import {MatChipsModule} from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import { DialogContentExampleDialog, EditItemDialog } from './manage-stock/manage-stock.component'; 
import { ManageStockComponent } from './manage-stock/manage-stock.component';
import { ListItemsComponent } from './list-items/list-items.component';
import { AllocationsComponent } from './allocations/allocations.component';
import { AuthService } from './services/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatDividerModule} from '@angular/material/divider';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthGuard } from './guard/auth.guard';
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ViewInventoryComponent,
    AddItemComponent,
    RemoveItemComponent,
    RecordComponent,
    ReportComponent,
    DisplayComponent,
    ManageStockComponent,
    DialogContentExampleDialog,
    EditItemDialog,
    ListItemsComponent,
    BottomSheetOverviewExampleSheet,
    AllocationsComponent,
    DashboardComponent,
    SignUpComponent,
    SignInComponent,
    VerifyEmailComponent
  ],
  imports: [
    BrowserModule,
    MatSidenavModule,
    AppRoutingModule,
    MatListModule,
    MatIconModule,
    MatStepperModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    MatChipsModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    MatPaginatorModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyCM8D_fEU_T8ieaXLEjFtknvcYxkweSM-o",
      authDomain: "itmlgpw-inventory.firebaseapp.com",
      projectId: "itmlgpw-inventory",
      storageBucket: "itmlgpw-inventory.appspot.com",
      messagingSenderId: "626175535227",
      appId: "1:626175535227:web:aed1fcb9a9fbb694b29ade",
      measurementId: "G-072ZGDW7F9"
    }),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  providers: [{provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3500}},AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
