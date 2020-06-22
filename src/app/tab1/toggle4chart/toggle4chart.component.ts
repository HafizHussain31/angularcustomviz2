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
  selector: 'app-toggle4chart',
  templateUrl: './toggle4chart.component.html',
  styleUrls: ['./toggle4chart.component.css']
})
export class Toggle4chartComponent implements OnInit {
  public options: any = {
  }
  constructor() { }

  ngOnInit(): void {
    D3.csv('./assets/Toggle4.csv', function(data) {
      var table = D3.select('#toggle4chart').append('table').style('background-color', 'transparent').style('color', '#fff')
      var thead = table.append('thead')
      var tbody = table.append('tbody')

      var filteredcolumns = [];
      for (let i = 0; i < data.columns.length; i++) {
        if(data.columns[i].includes('%')) continue;
        filteredcolumns.push(data.columns[i]);
      }


      thead.append('tr')
      .style('background-color', 'transparent')
        .selectAll('th')
        .data(filteredcolumns)
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
          return filteredcolumns.map(function (column) {
            return { column: column, value: row[column] }
          })
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value })
    });
  }

}
