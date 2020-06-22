import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.component.html',
  styleUrls: ['./tab1.component.css']
})
export class Tab1Component implements OnInit {

  mySelections: string[];

  charts = new FormControl();
  chartsList: string[] = ['Chart A', 'Chart B', 'Chart C', 'Chart D', 'Chart F', 'Chart G', 'Chart H', 'Chart I', 'Chart J', 'Chart K', 'Chart L', 'Chart M', 'Chart N', 'Special'];
  toggle1: boolean;
  toggle2: boolean;
  toggle3: boolean;
  toggle4: boolean;
  toggle5: boolean;
  splchart: boolean = false;

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
  changed() {
    if (this.charts.value.length < 5) {
      if(this.charts.value.includes('Special')) {
        this.splchart = true;
      }
      else {
          this.splchart = false;
      }
      this.mySelections = this.charts.value;
    } else {
      this.charts.setValue(this.mySelections);
    }
  }
  clicked(chart: string) {
    console.log(chart);
  }
}
