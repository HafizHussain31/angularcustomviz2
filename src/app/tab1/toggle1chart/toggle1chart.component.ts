import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as D3 from 'd3v4';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
@Component({
  selector: 'app-toggle1chart',
  templateUrl: './toggle1chart.component.html',
  styleUrls: ['./toggle1chart.component.css']
})
export class Toggle1chartComponent implements OnInit {

  constructor() { }

  public options: any = {
  }

  ngOnInit(): void {
    let options: any = this.options;
    D3.csv('./assets/Toggle1.csv', (data) => {
      console.log(data);

      var seriesData = [];
      data.forEach(element => {
        let tmp = [(new Date(element['Start Date'] + ' ' + element['Start Time'])).getTime(), 0];
        seriesData.push(tmp);
      });




      let options: Highcharts.Options = {
        chart: {
          height: 120,
          type: 'line',
          backgroundColor: 'transparent'
        },
        title: {
          text: null
        },
        xAxis: {
          type: 'datetime',
          visible: false,
        },
        credits : {
          enabled : false
        },
        legend: {
          enabled: false
        },
        yAxis: {
          min: 0,
          max: 0,
          visible: false
        },
        plotOptions: {
          series: {
            marker: {
              enabled: true
            }
          }
        },
        colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
        series: [{
          name: "Winter 2014-2015",
          data: seriesData,
          type: "line"
        }
        ]
      }

      Highcharts.chart('toggle1chart2', options);
    })
  }

}
