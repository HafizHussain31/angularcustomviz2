import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Inject } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Toggle2chartComponent } from '../tab1/toggle2chart/toggle2chart.component';
import { Toggle3chartComponent } from '../tab1/toggle3chart/toggle3chart.component';
import { Tab1chartComponent } from '../tab1/tab1chart/tab1chart.component';
export interface DialogData {
  name: string;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  name: string;
  label: string = 'tab1';
  @Input() activeTab: string;
  @Output() activeTabChanged = new EventEmitter<string>();

  constructor(public dialog: MatDialog) { }

  changeActiveTab() {
    this.activeTabChanged.emit(this.activeTab);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  changeStatus() {
    this.changeActiveTab()
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  styleUrls: ['./header.component.css']
})
export class DialogOverviewExampleDialog  {
  name: string;
  XAxisMin = ''
  XAxisMax = ''
  YAxisMax : number;
  YAxisMin : number;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

ngOnInit(): void {
  this.XAxisMin = new Date(Tab1chartComponent.minDate).toISOString().slice(0, 16);
  this.XAxisMax = new Date(Tab1chartComponent.maxDate).toISOString().slice(0, 16);
  this.YAxisMax = Tab1chartComponent.yMax;
  this.YAxisMin = Tab1chartComponent.yMin;
}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  restoredefault(): void {
    let tabchart1comp = new Tab1chartComponent();
    tabchart1comp.resetzoom();
    this.dialogRef.close();
  }


  onClickApply(): void {
    console.log(new Date(this.XAxisMin), this.XAxisMax, this.YAxisMax, this.YAxisMin);

    Tab1chartComponent.yMax = this.YAxisMax;
    Tab1chartComponent.yMin = this.YAxisMin;

    var data = {
      xAxisMax: new Date(this.XAxisMax).getTime(),
      xAxisMin: new Date(this.XAxisMin).getTime(),
      yAxisMax: this.YAxisMax,
      yAxisMin: this.YAxisMin
    };

    let tabchart1comp = new Tab1chartComponent();


    tabchart1comp.setintervalfrompopup(new Date(this.XAxisMin).getTime(), new Date(this.XAxisMax).getTime(), this.YAxisMin, this.YAxisMax);


    this.dialogRef.close();
  }


}
