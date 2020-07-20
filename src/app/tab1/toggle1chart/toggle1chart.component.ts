import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as D3 from 'd3v4';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
import { Tab1chartComponent } from '../tab1chart/tab1chart.component';
import { AppComponent } from '../../app.component';

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




      options =  {
        chart: {
          height: 120,
          type: 'line',
          backgroundColor: 'transparent',
          zoomType: 'x',
          panning: true,
          panKey: 'shift',
          resetZoomButton: {
            theme: {
                display: 'none'
            }
        }
        },
        title: {
          text: null
        },
        xAxis: {
          type: 'datetime',
          visible: false,
          max : Tab1chartComponent.actualMaxDate,
          min : Tab1chartComponent.actualMinDate,
          events: {
            afterSetExtremes: function (event) {
              Tab1chartComponent.maxDate = event.max;
              Tab1chartComponent.minDate = event.min;

              let tabchart1comp = new Tab1chartComponent();
              tabchart1comp.setintervalfrompopup(Tab1chartComponent.minDate, Tab1chartComponent.maxDate, 1, 5);

            }
          }
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
          useHTML: true,
          backgroundColor: '#000000',
          borderColor: '#000000',
          style: {
            color: 'gray'
          }
        },
        plotOptions: {
          series: {
            marker: {
              enabled: true
            },
            events: {
              mouseOver: function () {
                AppComponent.highchartsmouseover = true;

                let appcomp = new AppComponent();
                appcomp.appMouseMoveFn();
              },
              mouseOut: function () {
                AppComponent.highchartsmouseover = false;

                let appcomp = new AppComponent();
                appcomp.appMouseMoveFn();
              }
            }
          }
        },
        colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
        series: [{
          name: "",
          data: seriesData,
          type: "line",
          point: {
          events: {
            click: function(e) {
              this.series.chart.tooltip.refresh(this, e, true);
            }
          }
        }
        }
        ]
      }

      Highcharts.wrap(Highcharts.Tooltip.prototype, 'refresh', function(proceed, point, event, click) {
        if (click) {
          proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        }
      });

      Highcharts.chart('toggle1chart2', options);
    })
  }

public chartinterval(data){

  var index = document.getElementById('toggle1chart2').dataset.highchartsChart;
  var chartPartner = Highcharts.charts[index];
  chartPartner.xAxis[0].setExtremes(data.xAxisMin, data.xAxisMax);
  chartPartner.showResetZoom();


}
}
