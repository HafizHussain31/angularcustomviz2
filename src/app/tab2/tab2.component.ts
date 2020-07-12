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
  tmpschartsList: string[] = ['Chart A', 'Chart B', 'Chart C', 'Chart D', 'Chart H'];
  dataArray: any;
  filterText: any = "";
  constructor() {
    this.bindData();
  }

  ngOnInit(): void {
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

handleInput(event: KeyboardEvent): void{
   event.stopPropagation();
} 

  bindData() {
    const selectedChart: any[] = [
      this.chartsList[0]
    ]

    this.charts.setValue(selectedChart)
  }
}
