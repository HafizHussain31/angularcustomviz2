import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Tab1chartComponent } from './tab1chart/tab1chart.component'

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.component.html',
  styleUrls: ['./tab1.component.css']
})
export class Tab1Component implements OnInit {

  mySelections: string[];

  charts = new FormControl();
  chartsList: string[] = ['Chart A', 'Chart B', 'Chart C', 'Chart D', 'Chart F', 'Chart G', 'Chart H', 'Chart I', 'Chart J', 'Chart K', 'Chart L', 'Chart M', 'Chart N', 'Special'];
  tmpschartsList: string[] = ['Chart A', 'Chart B', 'Chart C', 'Chart D', 'Chart F', 'Chart G', 'Chart H', 'Chart I', 'Chart J', 'Chart K', 'Chart L', 'Chart M', 'Chart N', 'Special'];
  toggle1: boolean;
  toggle2: boolean;
  toggle3: boolean;
  toggle4: boolean;
  toggle5: boolean;
  splchart: boolean = false;
  chartB : boolean = false;
  dataArray: any;
  filterText: any = "";
  isZoomed: boolean = false;
  @ViewChild('chartselect') chartselect:any;

  constructor() {
    this.bindData();
  }

  ngOnInit(): void {
  }

  bindData() {
    const anotherList: any[] = [
      this.chartsList[0]
    ]

    this.charts.setValue(anotherList)
    this.mySelections = ['Chart A'];
  }

  restoredefault(): void {
    let tabchart1comp = new Tab1chartComponent();
    tabchart1comp.resetzoom();
  }

  onExpand() {

  }

public static toggle1Checked = false;
public static toggle2Checked = false;
public static toggle3Checked = false;

  onToggle3(event) {
Tab1Component.toggle3Checked = event.checked;
      if(!event.checked) {
        let tab1chart = new Tab1chartComponent();
        tab1chart.removetoggle3series();
        Tab1chartComponent.selectedlabels = {};
      }

  }

  onToggle2(event) {
Tab1Component.toggle2Checked = event.checked;
  }

  onToggle1(event) {
      Tab1Component.toggle1Checked = event.checked;
  }

  onToggle4(event) {
      if(event.checked) {
        this.toggle3 = true;
      }
  }

  onToggle5(event) {
      if(event.checked) {
        let tab1chart = new Tab1chartComponent();
        tab1chart.addToggle5PlotLine();
      }
      else {
        let tab1chart = new Tab1chartComponent();
        tab1chart.removeToggle5PlotLine();
      }
  }

  onKey(value) {
      this.dataArray= [];
      if(value === '') {
          this.chartsList = this.tmpschartsList;
      }
      else {
        this.selectSearch(value);
      }
  }

  selectSearch(value:string){
    let filter = value.toLowerCase();
    for (let i = 0 ; i < this.tmpschartsList.length; i++) {
        let option = this.tmpschartsList[i];
        if (option.toLowerCase().indexOf(filter) >= 0) {
            this.dataArray.push(option);
        }
    }
    this.chartsList = this.dataArray;
}

closed() {
  this.chartsList = this.tmpschartsList;
  this.filterText = "";
}

  changed() {
    if (this.charts.value.length < 5) {

      console.log(this.charts.value);

      if(this.charts.value.includes("Chart B")) {
        this.chartB = true;
      }
      else {
        this.chartB = false;
      }

      this.mySelections = this.charts.value;
      if(this.charts.value.includes('Special')) {
        this.chartselect.close();
        this.charts.setValue(['Special']);
        this.splchart = true;
      }
      else {
          this.charts.setValue(this.mySelections);
          this.splchart = false;
      }
    } else {
      this.charts.setValue(this.mySelections);
    }
  }
  clicked(chart: string) {
    console.log(chart);
  }
}
