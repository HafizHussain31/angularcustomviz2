import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as D3 from 'd3v4';
import { EventEmitter } from 'events';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-tab1specialchart',
  templateUrl: './tab1specialchart.component.html',
  styleUrls: ['./tab1specialchart.component.css']
})
export class Tab1specialchartComponent implements OnInit {
  @Input() chart: string;
  chartid: string;
  public options: any = {
  }
  constructor() { }

  ngOnInit(): void {
    let chartStr: string = this.chart;
    console.log(chartStr);
    this.chartid = chartStr.replace(/\s/g, "");

    D3.csv('./assets/Tab1Special.csv', (data) => {
      console.log(data);

      this.options = {
        chart: {
          type: 'column',
          backgroundColor: '#040A17'
        },
        title: {
          text: 'Percent'
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: data.map((d) => d['Bar']),
          crosshair: true
        },
        legend: {
          enabled: false
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Percent'
          }
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
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [{
          data: data.map((d) => parseInt(d['Percent'])),
          color: '#64CB49'
        }]
      };
      let chartContainerId = 'tab1-splchart';
      Highcharts.chart(chartContainerId, this.options);
    })

  }
}
