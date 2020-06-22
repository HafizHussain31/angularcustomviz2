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
  public options: any = {
  }
  constructor() { }

  ngOnInit(): void {
    D3.csv('./assets/Toggle1.csv', (data) => {
      let seriesData = [];
      data.forEach(element => {
        let tmp = [new Date(element['Start Date'] + ' ' + element['Start Time']), 0];
        seriesData.push(tmp);
      });
      let options = {
        chart: {
          height: 120,
          type: 'spline',
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
        tooltip: {
          headerFormat: '<table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
            '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
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
          data: seriesData
        }
        ]
      }

      //Highcharts.chart('toggle1chart', options);
    })
  }

}
