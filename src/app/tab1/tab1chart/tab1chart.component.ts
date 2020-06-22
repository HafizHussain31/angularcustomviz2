import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
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
  selector: 'app-tab1chart',
  templateUrl: './tab1chart.component.html',
  styleUrls: ['./tab1chart.component.css']
})
export class Tab1chartComponent implements OnInit, OnDestroy {

  @Input() chart: string;
  chartid: string;
  above : string;
  within :  string;
  below : string;
  splchart : boolean;
  ordchart : boolean = true;

  serieColors = { 'Chart A': 'rgb(68,114,196)', 'Chart B': 'rgb(237,125,49)', 'Chart C': 'rgb(165,165,165)', 'Chart D': 'rgb(255,192,0)', 'Chart H': '#743979' };
  public options: any = {
  }

  constructor() {

  }

  ngOnChanges(changes) {

    this.childFunction()
  }
  public childFunction() {

  }

  ngOnDestroy() {

  }
  ngOnInit() {
    let chart: string = this.chart;
    let chartid: string = this.chartid;
    let options: any = this.options;
    if (chart != "Special") {
      this.ordchart = true;
      this.splchart = false;
      this.chartid = chart.replace(/\s/g, "");
      D3.csv('./assets/Tab1.csv', (data) => {
        D3.csv('./assets/Tab1Range.csv', (rangeData) => {
          console.log(chart);

          //let selectedChart = this.chart;
          let selectedChart = this.chart;
          // let selectedCharts = this.selectedCharts.map(d => d.value);
          let filteredData = data.filter(function (d) {
            return d['Chart Type'] == selectedChart
          })
          let filteredRange = rangeData.filter(d => d['Replacement '] == selectedChart);
          let seriesData = [];
          filteredData.forEach(function (d) {
            let tmp = [];
            tmp[0] = new Date(d['Date'] + ' ' + d['Time']).getTime();
            tmp[1] = parseFloat(d['Value']);
            seriesData.push(tmp);
          })

          let abovedata = (filteredData.filter(word => word['Value'] > filteredRange[0]['Max Yellow']).length / filteredData.length) * 100;
          let belowdata = (filteredData.filter(word => word['Value'] < filteredRange[0]['Min Yellow']).length / filteredData.length) * 100;
          let withindata = (filteredData.filter(word => word['Value'] <= filteredRange[0]['Max Yellow'] &&
                            word['Value'] >= filteredRange[0]['Min Yellow']).length / filteredData.length) * 100;

          this.above = abovedata.toFixed(2) + "% above";
          this.below = belowdata.toFixed(2) + "% below";
          this.within = withindata.toFixed(2) + "% within";

          console.log(abovedata, belowdata, withindata);


          let greenRangeData = [];
          let tmp1 = [];
          tmp1[0] = seriesData[0][0];
          tmp1[1] = parseFloat(filteredRange[0]['Min Yellow']);
          tmp1[2] = parseFloat(filteredRange[0]['Max Yellow']);
          greenRangeData.push(tmp1);
          tmp1 = [];
          tmp1[0] = seriesData[seriesData.length - 1][0];
          tmp1[1] = parseFloat(filteredRange[0]['Min Yellow']);
          tmp1[2] = parseFloat(filteredRange[0]['Max Yellow']);
          greenRangeData.push(tmp1);

          let yellowRangeData = [];
          tmp1 = [];
          tmp1[0] = seriesData[0][0];
          tmp1[1] = parseFloat(filteredRange[0]['Min Green']);
          tmp1[2] = parseFloat(filteredRange[0]['Max G']);
          yellowRangeData.push(tmp1);
          tmp1 = [];
          tmp1[0] = seriesData[seriesData.length - 1][0];
          tmp1[1] = parseFloat(filteredRange[0]['Min Green']);
          tmp1[2] = parseFloat(filteredRange[0]['Max G']);
          yellowRangeData.push(tmp1);

          console.log(greenRangeData);

          options = {
            chart: {
              zoomType: 'x',
              backgroundColor: '#040A17'
            },
            title: {
              text: ''
            },
            subtitle: {
              text: ''
            },
            credits : {
              enabled : false
            },
            xAxis: {
              type: 'datetime',
              opposite:true
            },
            yAxis: {
              title: {
                text: 'Exchange rate'
              }
            },
            legend: {
              enabled: false
            },
            plotOptions: {
              series: {
                marker: {
                  enabled: false
                }
              }
            },

            series: [
              {
                type: 'arearange',
                name: 'USD to EUR',
                data: greenRangeData
              }, {
                type: 'arearange',
                name: 'USD to EUR',
                data: yellowRangeData
              },
              {
                type: 'line',
                name: 'USD to EUR',
                data: seriesData
              }]
          }

          let chartContainerId = 'tab1-' + this.chartid;
          console.log(chartContainerId);

          Highcharts.chart(chartContainerId, options);
        })
      })
    } else {
      this.splchart = true;
      this.ordchart = null;
      this.chartid = chart.replace(/\s/g, "");
      D3.csv('./assets/Tab1Special.csv', (data) => {
        console.log(data);

        let selectedChart = chart;
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
}
