import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ganttChart } from 'highcharts/highcharts-gantt';
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
  selector: 'app-toggle5chart',
  templateUrl: './toggle5chart.component.html',
  styleUrls: ['./toggle5chart.component.css']
})
export class Toggle5chartComponent implements OnInit {
  public options: any = {
  }
  constructor() { }

  ngOnInit(): void {
    D3.csv('./assets/Toggle5.csv', function(data){
      var table = D3.select('#toggle5chart').append('table').style('background-color', 'transparent').style('color', '#fff')
      var thead = table.append('thead')
      var tbody = table.append('tbody')

      thead.append('tr')
      .style('background-color', 'transparent')
        .selectAll('th')
        .data(data.columns)
        .enter()
        .append('th')
        .style('background-color', 'transparent')
        .text(function (d) { return d })

      var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .style('background-color', 'transparent')

      var cells = rows.selectAll('td')
        .data(function (row) {
          return data.columns.map(function (column) {
            return { column: column, value: row[column] }
          })
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value })
    });
  }

}
