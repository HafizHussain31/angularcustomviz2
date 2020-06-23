import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Inject } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
  @Input() activeTab: string;
  @Output() activeTabChanged = new EventEmitter<string>();

  constructor(public dialog: MatDialog) { }

  changeActiveTab(tab: string) {
    this.activeTabChanged.emit(tab);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog  {
  name: string;
  XAxisMax = "";
  XAxisMin = "";
  YAxisMax = "";
  YAxisMin = "";
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }


  onCancelClick(): void {
    this.dialogRef.close();
  }

  restoredefault(): void {
  }


  onClickApply(): void {
    console.log(this.XAxisMax, this.XAxisMin, this.YAxisMax, this.YAxisMin);

    var data = {
      xAxisMax: new Date(this.XAxisMax).getTime(),
      xAxisMin: new Date(this.XAxisMin).getTime(),
      yAxisMax: this.YAxisMax,
      yAxisMin: this.YAxisMin
    };
    let toggle2comp = new Toggle2chartComponent();
    let toggle3comp = new Toggle3chartComponent();
    let tabchart1comp = new Tab1chartComponent();

    toggle2comp.chartinterval(data);
    toggle3comp.chartinterval(data);
    tabchart1comp.setinterval(new Date(this.XAxisMin).getTime(), new Date(this.XAxisMax).getTime(), this.YAxisMin, this.YAxisMax);


    this.dialogRef.close();
  }


}
