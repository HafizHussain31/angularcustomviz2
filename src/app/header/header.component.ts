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

  fullScreen() {

    var isInFullScreen = (document['fullscreenElement'] && document['fullscreenElement'] !== null) ||
        (document['webkitFullscreenElement'] && document['webkitFullscreenElement'] !== null) ||
        (document['mozFullScreenElement'] && document['mozFullScreenElement'] !== null) ||
        (document['msFullscreenElement'] && document['msFullscreenElement'] !== null);

    var docElm = document.documentElement;
    if (!isInFullScreen) {
        if (docElm['requestFullscreen']) {
            docElm['requestFullscreen']();
        } else if (docElm['mozRequestFullScreen']) {
            docElm['mozRequestFullScreen']();
        } else if (docElm['webkitRequestFullScreen']) {
            docElm['webkitRequestFullScreen']();
        } else if (docElm['msRequestFullscreen']) {
            docElm['msRequestFullscreen']();
        }
    } else {
        if (document['exitFullscreen']) {
            document.exitFullscreen();
        } else if (document['webkitExitFullscreen']) {
            document['webkitExitFullscreen']();
        } else if (document['mozCancelFullScreen']) {
            document['mozCancelFullScreen']();
        } else if (document['msExitFullscreen']) {
            document['msExitFullscreen']();
        }
    }
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
  console.log(new Date(Tab1chartComponent.minDate));

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

    var d = new Date();

    var datemin = new Date(this.XAxisMin);
    var datemax = new Date(this.XAxisMax);



    var data = {
      xAxisMax: datemax.setMinutes(datemax.getMinutes() - d.getTimezoneOffset()),
      xAxisMin: datemin.setMinutes(datemin.getMinutes() - d.getTimezoneOffset()),
      yAxisMax: this.YAxisMax,
      yAxisMin: this.YAxisMin
    };

    let tabchart1comp = new Tab1chartComponent();

    console.log(data);



    tabchart1comp.setintervalfrompopup(data.xAxisMin, data.xAxisMax, this.YAxisMin, this.YAxisMax);


    this.dialogRef.close();
  }



}
