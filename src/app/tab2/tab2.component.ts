import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.component.html',
  styleUrls: ['./tab2.component.css']
})
export class Tab2Component implements OnInit {
  charts = new FormControl();
  chartsList: string[] = ['Chart A', 'Chart B', 'Chart C', 'Chart D', 'Chart H'];

  constructor() {
    this.bindData();
  }

  ngOnInit(): void {
  }

  bindData() {
    const selectedChart: any[] = [
      this.chartsList[0]
    ]

    this.charts.setValue(selectedChart)
  }
}
