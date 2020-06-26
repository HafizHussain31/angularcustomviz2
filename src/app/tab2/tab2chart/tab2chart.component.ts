import { Component, OnInit, Input } from '@angular/core';
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
  selector: 'app-tab2chart',
  templateUrl: './tab2chart.component.html',
  styleUrls: ['./tab2chart.component.css']
})
export class Tab2chartComponent implements OnInit {

  @Input() selectedCharts: string;

  serieColors = { 'Chart A': 'rgb(80,152,247)', 'Chart B': 'rgb(226,137,77)', 'Chart C': 'rgb(231,191,77)', 'Chart D': 'rgb(255,192,0)', 'Chart H': '#743979' };
  public options: any = {
  }

  constructor() { }
  ngOnChanges(changes) {
    this.childFunction()
  }
  public childFunction() {
    D3.csv('./assets/Tab2.csv', (data) => {
      let selectedCharts = this.selectedCharts.split(',');
      // let selectedCharts = this.selectedCharts.map(d => d.value);
      let filteredData = data.filter(function (d) {
        let i = 0;
        let s = 0;
        while (i < selectedCharts.length) {
          let tmp = d[selectedCharts[i]] == '' || d[selectedCharts[i]] == undefined ? 0 : 1;
          s = s || tmp;
          i++;
        }
        return s;
      })

      let seriesData = [];
      selectedCharts.forEach((chart) => {
        let tmp = {}, tmpMarker = {};
        // tmpMarker['fillColor'] = "transparent";
        // tmp['marker'] = tmpMarker;
        let tmpdata = [];

        filteredData.forEach(filtereddatum => {

          if(filtereddatum[chart] !== '') {

              let min = filtereddatum["Date Time"].split(':')[0];
              let sec = filtereddatum["Date Time"].split(':')[1].split(".")[0];
              let ms = parseInt(filtereddatum["Date Time"].split(':')[1].split(".")[1]) * 100;
              console.log(min, sec, ms);

              filtereddatum["DateTime"] = new Date().getTime() + new Date(0,0,0,0, min, sec, ms).getTime();
              let tempdatum = [];
              tempdatum.push(filtereddatum["DateTime"]);
              tempdatum.push(parseFloat(filtereddatum[chart]));
              tmpdata.push(tempdatum);
          }
        });

        tmp['data'] = tmpdata;
        tmp['name'] = chart;
        console.log(tmp);

        tmp['color'] = this.serieColors[chart];
        seriesData.push(tmp);
      })


      console.log(seriesData);


      this.options = {
        chart: {
          zoomType: 'x',
          backgroundColor: '#040A17',
          type:'spline'
        },
        title: {
          text: '',
          x: -20 //center
        },
        subtitle: {
          text: '',
          x: -20
        },
        credits : {
          enabled : false
        },
        xAxis: {
          type: 'datetime',
          opposite:true,
          labels: {
             formatter: function() {
               return Highcharts.dateFormat("%M:%S.%MS", this.value);
             }
           }
        },
        yAxis: {
          title: {
            text: ''
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        tooltip: {
          valueSuffix: '°C'
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0,
          showInLegend: false,
          // labelFormat: '{data]'
        },
        series: seriesData
      }
      Highcharts.chart('container', this.options);
    })
  }

  ngOnInit() {

  }
}
