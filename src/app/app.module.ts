import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { Tab1Component } from './tab1/tab1.component';
import { Tab2Component } from './tab2/tab2.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Tab2chartComponent } from './tab2/tab2chart/tab2chart.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { Tab1chartComponent } from './tab1/tab1chart/tab1chart.component';
import { Tab1specialchartComponent } from './tab1/tab1specialchart/tab1specialchart.component';
import { Toggle2chartComponent } from './tab1/toggle2chart/toggle2chart.component';
import { Toggle1chartComponent } from './tab1/toggle1chart/toggle1chart.component';
import { Toggle3chartComponent } from './tab1/toggle3chart/toggle3chart.component';
import { Toggle4chartComponent } from './tab1/toggle4chart/toggle4chart.component';
import { Toggle5chartComponent } from './tab1/toggle5chart/toggle5chart.component';
import { DialogOverviewExampleDialog } from './header/header.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DialogOverviewExampleDialog,
    Tab1Component,
    Tab2Component,
    Tab2chartComponent,
    Tab1chartComponent,
    Tab1specialchartComponent,
    Toggle2chartComponent,
    Toggle1chartComponent,
    Toggle3chartComponent,
    Toggle4chartComponent,
    Toggle5chartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatExpansionModule,
  ],
  exports: [

  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DialogOverviewExampleDialog]
})
export class AppModule { }
