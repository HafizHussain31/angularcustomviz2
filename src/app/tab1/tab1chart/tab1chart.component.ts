import { Component, OnInit, Input, Output, OnDestroy, Inject } from '@angular/core';
import * as Highcharts from 'highcharts';

import * as D3 from 'd3v4';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
import { Toggle3chartComponent } from '../toggle3chart/toggle3chart.component';
import { Toggle2chartComponent } from '../toggle2chart/toggle2chart.component';
import { Toggle1chartComponent } from '../toggle1chart/toggle1chart.component';
import { Tab1Component } from '../tab1.component';
import { AppComponent } from '../../app.component';

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

import customEvents from 'highcharts-custom-events';
customEvents(Highcharts);


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
  parent1 : Tab1Component;

  serieColors = { 'Chart A': 'rgb(68,114,196)', 'Chart B': 'rgb(237,125,49)', 'Chart C': 'rgb(165,165,165)', 'Chart D': 'rgb(255,192,0)', 'Chart H': '#743979' };
  public options: any = {
  }

  constructor(@Inject(Tab1Component) private parent: Tab1Component = null) {
      this.parent1 = parent;

  }

  ngOnChanges(changes) {

    this.childFunction()
  }
  public childFunction() {

  }

  ngOnDestroy() {

  }

  public static minDate = 0;
  public static maxDate = 0;
  public static zoomed = 0;
  public static actualMinDate = 0;
  public static actualMaxDate = 0;
  public static yMax = 6;
  public static yMin = 1;

  ngOnInit() {




    let chart: string = this.chart;
    let chartid: string = this.chartid;
    let options: any = this.options;
    let parent:any = this.parent;
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


          let maxvalue = 0;

          filteredData.forEach(function (d) {
            let tmp = [];
            tmp[0] = new Date(d['Date'] + ' ' + d['Time']).getTime();
            tmp[1] = parseFloat(d['Value']);

            if(maxvalue < tmp[1])
              maxvalue = tmp[1];
            seriesData.push(tmp);
          })

          var xAxisdates = filteredData.map(function(d){return new Date(d['Date'] + ' ' + d['Time']).getTime()});

          Tab1chartComponent.maxDate = Math.max(...xAxisdates);
          Tab1chartComponent.minDate = Math.min(...xAxisdates);

          Tab1chartComponent.actualMaxDate = Math.max(...xAxisdates);
          Tab1chartComponent.actualMinDate = Math.min(...xAxisdates);

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

          for (let i = 0; i < greenRangeData.length; i++) {
            const element = greenRangeData[i];
            if(maxvalue < element[2])
              maxvalue = element[2]
          }

          for (let i = 0; i < yellowRangeData.length; i++) {
            const element = yellowRangeData[i];
            if(maxvalue < element[2])
              maxvalue = element[2]
          }


          let finalseries = [
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
            }];

            if(Tab1chartComponent.toggle3seriestobeadded !== undefined) {
              console.log(Tab1chartComponent.toggle3seriestobeadded);

              for (let i = 0; i < Tab1chartComponent.toggle3seriestobeadded.length; i++) {
                const element = Tab1chartComponent.toggle3seriestobeadded[i];
                element.data[0][2] = maxvalue;
                element.data[1][2] = maxvalue;
              }

              finalseries.push(...Tab1chartComponent.toggle3seriestobeadded);
            }

            var divs = document.getElementsByClassName("rowtab1");


            var index = document.getElementById(divs[0].id).dataset.highchartsChart;
            var chartPartner = Highcharts.charts[index];

            if(chartPartner !== undefined) {

              var seriesLength = chartPartner.series.length;

              var seriestoberemoved = [];
              for(var j = 0; j < seriesLength; j++)
              {
                  if(chartPartner.series[j].name.includes("toggle3")) {
                    for (let k = 0; k < finalseries.length; k++) {
                      console.log(finalseries[k]);

                      let element = finalseries[k];
                      if(element.name === chartPartner.series[j].name) {
                        element = chartPartner.series[j].visible;
                      }
                    }
                  }
              }
          }

          options = {
            chart: {
              zoomType: 'x',
              backgroundColor: '#040A17',
              panning: true,
              panKey: 'shift',
              resetZoomButton: {
                theme: {
                    display: 'none'
                }
            }
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
              offset: 0,
              labels: {
                  events: {
                    click: function(a) {
                      if(this.value.includes('</a>')) {
                        this.chart.xAxis[0].setExtremes(this.pos, this.pos + (24 * 60 * 60 * 1000));
                      }
                    }
                  },
                  formatter: function () {
                      let val = this.value - (330 * 60000);
                      if(this.dateTimeLabelFormat === "%e. %b") {
                        return '<a style="fill: blue; href="javascript:void(0);" onclick="ShowOld(2367,146986,2);">' + Highcharts.dateFormat('%e.%b', this.value)
                         + '</a> <br> <br>' +  Highcharts.dateFormat('%H.%M', this.value);
                      }
                      else {
                        return Highcharts.dateFormat(this.dateTimeLabelFormat, this.value);
                      }
                  }
              },
              events: {
                afterSetExtremes: function (event) {
                  Tab1chartComponent.maxDate = event.max;
                  Tab1chartComponent.minDate = event.min;

                  if(Tab1chartComponent.minDate > Tab1chartComponent.actualMinDate)
                    parent.isZoomed = true;
                  else
                    parent.isZoomed = false;

                  var divs = document.getElementsByClassName("rowtab1");
                  for(var i = 0; i < divs.length; i++){

                        let selectedchartid = "selected-" + chart.replace(/\s/g, "");
                        let chartid = chart.replace(/\s/g, "");
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

                          document.getElementById(selectedchartid).innerHTML = "<b>Selected <br>"+ "above " +  abovepercent + "<br> within " + withinpecent + "<br> below " + belowpercent + "<b>" ;
                        }
                        else {
                          document.getElementById(selectedchartid).innerHTML = "";
                        }

                        console.log(divs[i].id, chartid);

                        var index = document.getElementById(divs[i].id).dataset.highchartsChart;
                        var chartPartner = Highcharts.charts[index];


                        if(chartPartner.resetZoomButton) {
                          //chartPartner.resetZoomButton.destroy();
                        }

                        if(divs[i].id === 'tab1-' + chartid) {
                          continue;
                        }

                        chartPartner.xAxis[0].setExtremes(event.min, event.max);

                  }

                  var minmaxdata = {
                    xAxisMax: event.max,
                    xAxisMin: event.min,
                    yAxisMax: 0,
                    yAxisMin: 0
                  };

                  if(Tab1Component.toggle1Checked) {
                    let toggle1comp = new Toggle1chartComponent();
                    toggle1comp.chartinterval(minmaxdata);
                  }

                  if(Tab1Component.toggle2Checked) {
                    let toggle2comp = new Toggle2chartComponent();
                    toggle2comp.chartinterval(minmaxdata, undefined, undefined);
                  }

                  if(Tab1Component.toggle3Checked) {
                    let toggle3comp = new Toggle3chartComponent();
                    toggle3comp.chartinterval(minmaxdata);
                  }
                }
            },
            },
            yAxis: {
              title: {
                text: ''
              },
              min: 0,
              max:maxvalue
            },
            legend: {
              enabled: false
            },
            plotOptions: {
              series: {
                marker: {
                  enabled: false
                },
              events: {
                mouseOver: function () {
                  AppComponent.highchartsmouseover = true;
                },
                mouseOut: function () {
                  AppComponent.highchartsmouseover = false;
                }
              }
              }
            },

            series: finalseries
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
            max: 100,
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

public setintervalfrompopup(xmin, xmax, ymin, ymax) {
  var divs = document.getElementsByClassName("rowtab1");

    var index = document.getElementById(divs[0].id).dataset.highchartsChart;
    var chartPartner = Highcharts.charts[index];

    console.log(xmin + (550 * 60000), xmax);

    chartPartner.xAxis[0].setExtremes(xmin, xmax);
    chartPartner.yAxis[0].setExtremes(ymin, ymax);
    chartPartner.showResetZoom();
}

public groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

public addtoggle3seriestonewchart() {

}
static toggle3seriestobeadded : any;
public addtoggle3series(seriesFinalData) {

  var divs = document.getElementsByClassName("rowtab1");

  var index = document.getElementById(divs[0].id).dataset.highchartsChart;
  var chartPartner = Highcharts.charts[index];

  var seriesLength = chartPartner.series.length;

  for(var j = 0; j < seriesLength; j++)
  {
      if(chartPartner.series[j].name.includes("toggle3")) {
        return;
      }
  }

  for(var i = 0; i < divs.length; i++){
    var index = document.getElementById(divs[i].id).dataset.highchartsChart;
    var chartPartner = Highcharts.charts[index];

    var groupedata = this.groupBy(seriesFinalData, "Category");
    const catUnique = [...new Set(seriesFinalData.map(item => item['Category']))];
    this.addtoggle3labels(groupedata);
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
          console.log(chartPartner.yAxis[0]);

          var datum1 = [];
          datum1.push(ele.startDate);
          datum1.push(chartPartner.yAxis[0].dataMin);
          datum1.push(chartPartner.yAxis[0].dataMax);
          var datum2 = [];
          datum2.push(ele.endDate)
          datum2.push(chartPartner.yAxis[0].dataMin);
          datum2.push(chartPartner.yAxis[0].dataMax);
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
  Tab1chartComponent.toggle3seriestobeadded = chartseriesarr;



}

static groupedDatabkup = {}
public addtoggle3labels(groupedata) {

  console.log(groupedata);


Tab1chartComponent.groupedDatabkup = groupedata;

var catUnique = Object.keys(groupedata);
var catValues = Object.values(groupedata);
var finaldata = [];
console.log(catUnique);
for (let i = 0; i < catUnique.length; i++) {

  var datum = {
      name : catUnique[i],
      data : groupedata[catUnique[i]]
  };
  finaldata.push(datum);
}
console.log(finaldata);


var color = D3.scaleOrdinal(D3.schemeCategory20);
var svgtodelete = D3.select("#toggle3blocks");
svgtodelete.selectAll("*").remove();
var height = 50;
  const svg = D3.select("#toggle3blocks").append('svg').attr('width', 500).attr('height', height)
              .attr("transform", "translate(50,0)");;

              var bar = svg.selectAll("g")
                  .data(finaldata)
                .enter().append("g");

                bar.append("rect")
                    .attr("class", "selectedbar")
                    .attr("id", function(d, i) { return "selectedbar" + i })
                    .attr("x", function(d, i) { return i * 150; })
                    .attr("y", 0)
                    .attr("width", 120)
                    .style("stroke", function(d, i) { return color(i);  } )
                    .style("stroke-width", 1)
                    .style("fill", "transparent")
                    .attr("height", 50)
                    .style("opacity", 0);

              bar.append("rect")
                  .attr("class", "bar")
                  .attr("x", function(d, i) { return i * 150 + 10; })
                  .attr("y", 10)
                  .attr("width", 30)
                  .style("fill", function(d, i) { return color(i);  } )
                  .attr("height", 30)
                  .on("mouseover", function(d){
                    D3.select(this).style("cursor", "pointer");
                    D3.select(this).style("fill", function() {
                        return D3.rgb(D3.select(this).style("fill")).darker(0.4);
                        });
                  })
                  .on("mouseout", function(d){
                    D3.select(this).style("fill", function() {
                        return D3.rgb(D3.select(this).style("fill")).darker(-0.4);
                        });
                  })
                  .on("click", this.clickevent);

              bar.append("text")
                  .attr("x", function(d, i) { return i * 150 + 50; })
                  .attr("y", 30)
                  .attr("fill", "#fff")
                  .style("font-size", 16)
                  .text(function(d) { return d.name; })
                  .on("mouseover", function(d){
                    D3.select(this).style("cursor", "pointer");
                    D3.select(this).style("fill", function() {
                        return D3.rgb(D3.select(this).style("fill")).darker(0.4);
                        });
                  })
                  .on("mouseout", function(d){
                    D3.select(this).style("fill", function() {
                        return D3.rgb(D3.select(this).style("fill")).darker(-0.4);
                        });
                  })
                  .on("click", this.clickevent);

                  svg.append("text")
                  .attr("x", catUnique.length * 150)
                  .attr("y", 30)
                  .attr("fill", "steelblue")
                  .style("font-size", 16)
                  .text(function(d) { return "See all" })
                  .on("mouseover", function(d){
                    D3.select(this).style("cursor", "pointer");
                    D3.select(this).style("fill", function() {
                        return D3.rgb(D3.select(this).style("fill")).darker(0.4);
                        });
                  })
                  .on("mouseout", function(d){
                    D3.select(this).style("fill", function() {
                        return D3.rgb(D3.select(this).style("fill")).darker(-0.4);
                        });
                  })
                  .on("click", this.seealltoggle3labels);
}

public seealltoggle3labels() {

  Tab1chartComponent.selectedlabels = {};

    var divs = document.getElementsByClassName("rowtab1");

  for(var i = 0; i < divs.length; i++){
    var index = document.getElementById(divs[i].id).dataset.highchartsChart;
    var chartPartner = Highcharts.charts[index];
    var seriesLength = chartPartner.series.length;

                var seriestoberemoved = [];
                for(var j = 0; j < seriesLength; j++)
                {
                    if(chartPartner.series[j].name.includes("toggle3")) {
                      chartPartner.series[j].show();
                    }
                }
  }

  for (let i = 0; i < D3.selectAll(".selectedbar")['_groups'][0].length; i++) {
    const element = D3.selectAll(".selectedbar")['_groups'][0][i];

    element['__data__'].clicked = false;
  }

  D3.selectAll(".selectedbar").style('opacity', 0);

  let toggle3comp = new Toggle3chartComponent();
  let undefineddata;
  toggle3comp.chartinterval(undefineddata);

}

public static selectedlabels = {};
public clickevent(d, colorindex) {


let keys = Object.keys(Tab1chartComponent.selectedlabels);

let alllabelsdisabled = false;
if(d.clicked === true) {


  for (let i = 0; i < keys.length; i++) {
    alllabelsdisabled = true;
    if(keys[i] === d.name + "_toggle3") {
      continue;
    }
    if(Tab1chartComponent.selectedlabels[keys[i]].clicked) {
      alllabelsdisabled = false;
      break;
    }
  }
}

if(alllabelsdisabled) {
  var divs = document.getElementsByClassName("rowtab1");

  for(var i = 0; i < divs.length; i++){
    var index = document.getElementById(divs[i].id).dataset.highchartsChart;
    var chartPartner = Highcharts.charts[index];
    var seriesLength = chartPartner.series.length;

                var seriestoberemoved = [];
                for(var j = 0; j < seriesLength; j++)
                {
                    if(chartPartner.series[j].name.includes("toggle3")) {
                      chartPartner.series[j].show();
                    }
                }
  }

  d.clicked = !d.clicked;
  D3.selectAll(".selectedbar").style('opacity', 0);

  Tab1chartComponent.selectedlabels = {};
  let toggle3comp = new Toggle3chartComponent();
  let undefineddata;
  toggle3comp.chartinterval(undefineddata);
  return;
}

if(d.clicked === undefined)
  d.clicked = false;


Tab1chartComponent.selectedlabels[d.name + "_toggle3"] = {}
Tab1chartComponent.selectedlabels[d.name + "_toggle3"].colorindex = colorindex;
Tab1chartComponent.selectedlabels[d.name + "_toggle3"].clicked = d.clicked;

  var divs = document.getElementsByClassName("rowtab1");

  for(var i = 0; i < divs.length; i++){
    var index = document.getElementById(divs[i].id).dataset.highchartsChart;
    var chartPartner = Highcharts.charts[index];
    var seriesLength = chartPartner.series.length;

                var seriestoberemoved = [];
                for(var j = 0; j < seriesLength; j++)
                {
                    if(chartPartner.series[j].name.includes("toggle3")) {
                      chartPartner.series[j].hide();
                    }
                }
                for(var j = 0; j < seriesLength; j++)
                {

                    if(chartPartner.series[j].name === d.name + "_toggle3") {
                        if(d.clicked === undefined || !d.clicked) {
                            chartPartner.series[j].show();


                            Tab1chartComponent.selectedlabels[d.name + "_toggle3"].clicked = true;
                            D3.select("#selectedbar" + colorindex).style("opacity", 1);
                          }
                        else {
                          chartPartner.series[j].hide();
                          Tab1chartComponent.selectedlabels[d.name + "_toggle3"].clicked = false;
                          D3.select("#selectedbar" + colorindex).style("opacity", 0);

                        }
                    }
                    else {
                          if(chartPartner.series[j].name.includes("toggle3")) {
                            console.log(Tab1chartComponent.selectedlabels);
                              if(Tab1chartComponent.selectedlabels[chartPartner.series[j].name] !== undefined &&
                                Tab1chartComponent.selectedlabels[chartPartner.series[j].name].clicked) {
                                chartPartner.series[j].show();
                              }
                              else {
                                chartPartner.series[j].hide();
                              }
                        }
                    }
              }
  }

    d.clicked = !d.clicked;

    let toggle3comp = new Toggle3chartComponent();
    let undefineddata;
    toggle3comp.chartinterval(undefineddata);

}

public filtertoggle3chart(){

}

public removetoggle3series() {

  Tab1chartComponent.toggle3seriestobeadded = [];

  var svgtodelete = D3.select("#toggle3blocks");
  svgtodelete.selectAll("*").remove();

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

public resetzoom() {
  var divs = document.getElementsByClassName("rowtab1");

    var index = document.getElementById(divs[0].id).dataset.highchartsChart;
    var chartPartner = Highcharts.charts[index];
    chartPartner.xAxis[0].setExtremes();
    chartPartner.yAxis[0].setExtremes();
    Tab1chartComponent.yMax = 6;
    Tab1chartComponent.yMin = 1;
}

public addToggle5PlotLine() {

  var divs = document.getElementsByClassName("rowtab1");
  for(var i = 0; i < divs.length; i++){

    if(divs[i].id.includes('ChartB')) {
      var index = document.getElementById(divs[i].id).dataset.highchartsChart;
      var chartPartner = Highcharts.charts[index];
      var seriesLength = chartPartner.series.length;

      for(var j = 0; j < seriesLength; j++)
      {
          if(chartPartner.series[j].type === 'arearange') {
            chartPartner.series[j].hide();
          }
      }
      var yAxis = chartPartner.yAxis[0];

      yAxis.addPlotLine({
        value: 65,
        width: 1,
        id: 'toogle5',
        color: 'red',
        dashStyle: 'longdash'
      });
    }
  }

}

public removeToggle5PlotLine() {
  var divs = document.getElementsByClassName("rowtab1");
  for(var i = 0; i < divs.length; i++){

    if(divs[i].id.includes('ChartB')) {
      var index = document.getElementById(divs[i].id).dataset.highchartsChart;
      var chartPartner = Highcharts.charts[index];
      var seriesLength = chartPartner.series.length;

      for(var j = 0; j < seriesLength; j++)
      {
          if(chartPartner.series[j].type === 'arearange') {
            chartPartner.series[j].show();
          }
      }

      var yAxis = chartPartner.yAxis[0];
      yAxis.removePlotLine('toogle5');
    }
  }
}
}
