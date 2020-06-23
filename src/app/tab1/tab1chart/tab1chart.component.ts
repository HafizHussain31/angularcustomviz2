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
          console.log(yellowRangeData);


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
              opposite:true,
              events: {
                afterSetExtremes: function (event) {
                  var divs = document.getElementsByClassName("rowtab1");
                  for(var i = 0; i < divs.length; i++){
                    let chartid = "selected-" + chart.replace(/\s/g, "");

                    var axis = event.target, visiblePoints = 0, abovecount = 0, belowcount = 0, withincount = 0;

                    Highcharts.each(axis.series, function(ob, j) {
                    Highcharts.each(ob.data, function(p, i) {
                      if (p.x >= Math.round(event.min) && p.x <= Math.round(event.max)) {
                        visiblePoints++;

                          if(p.y > filteredRange[0]['Max Yellow']){
                              abovecount++;
                          }
                          else if(p.y < filteredRange[0]['Min Yellow']) {
                              belowcount++;
                          }
                          else {
                              withincount++;
                          }
                        }
                      });
                    });

                    if(visiblePoints < filteredData.length) {

                      var abovepercent = (abovecount/visiblePoints*100).toFixed(2) + "%", belowpercent = (belowcount/visiblePoints*100).toFixed(2) + "%",
                      withinpecent = (withincount/visiblePoints*100).toFixed(2) + "%";

                      document.getElementById(chartid).innerHTML = "<b>Selected <br>"+ "above " +  abovepercent + "<br> within " + withinpecent + "<br> below " + belowpercent + "<b>" ;
                    }
                    if(divs[i].id === 'tab1-' + chartid)
                      continue;

                    var index = document.getElementById(divs[i].id).dataset.highchartsChart;
                    var chartPartner = Highcharts.charts[index];
                    chartPartner.xAxis[0].setExtremes(event.min, event.max);
                    chartPartner.showResetZoom();
                  }
                }
            },
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

public setinterval(xmin, xmax, ymin, ymax) {
  var divs = document.getElementsByClassName("rowtab1");

  for(var i = 0; i < divs.length; i++){
    var index = document.getElementById(divs[i].id).dataset.highchartsChart;
    var chartPartner = Highcharts.charts[index];
    chartPartner.xAxis[0].setExtremes(xmin, xmax);
    chartPartner.yAxis[0].setExtremes(ymin, ymax);
    chartPartner.showResetZoom();
  }
}

public groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

public addtoggle3series(seriesFinalData) {

  var divs = document.getElementsByClassName("rowtab1");

  for(var i = 0; i < divs.length; i++){
    var index = document.getElementById(divs[i].id).dataset.highchartsChart;
    var chartPartner = Highcharts.charts[index];

    var groupedata = this.groupBy(seriesFinalData, "Category");
    const catUnique = [...new Set(seriesFinalData.map(item => item['Category']))];

  var chartseriesarr = [];
    for (let i = 0; i < Object.keys(groupedata).length; i++) {
      var color = D3.schemeCategory20
      var curcolor = color[i];
        console.log(curcolor, i);
        var groupearrs:any[] = Object.values(groupedata);
        var currentarr:any[] = groupearrs[i];
        for (let j = 0; j < currentarr.length; j++) {
          var ele = currentarr[j];
          var data = [];

          var datum1 = [];
          datum1.push(ele.startDate);
          datum1.push(chartPartner.yAxis[0].min);
          datum1.push(chartPartner.yAxis[0].max);
          var datum2 = [];
          datum2.push(ele.endDate)
          datum2.push(chartPartner.yAxis[0].min);
          datum2.push(chartPartner.yAxis[0].max);
          data.push(datum1);
          data.push(datum2);

          var chartseries = {
            name: catUnique[i] + "_toggle3",
            id : 'toggle3',
            data: data,
            color: curcolor,
            type: 'arearange',
          };

          chartseriesarr.push(chartseries);
        }
    }

    for (let j = 0; j < chartseriesarr.length; j++) {
        chartPartner.addSeries(chartseriesarr[j]);
    }
  }


  console.log(chartseriesarr);




}

public removetoggle3series() {
  var divs = document.getElementsByClassName("rowtab1");

  for(var i = 0; i < divs.length; i++){
    var index = document.getElementById(divs[i].id).dataset.highchartsChart;
    var chartPartner = Highcharts.charts[index];
    var seriesLength = chartPartner.series.length;
    console.log(seriesLength);

                var seriestoberemoved = [];
                for(var j = 0; j < seriesLength; j++)
                {
                    if(chartPartner.series[j].name.includes("toggle3")) {
                      seriestoberemoved.push(chartPartner.series[j])
                    }
                }

                for (let k = 0; k < seriestoberemoved.length; k++) {
                    seriestoberemoved[k].remove();
                }
  }

}

}
