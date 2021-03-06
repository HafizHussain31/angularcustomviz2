import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ganttChart } from 'highcharts/highcharts-gantt';
import { Tab1chartComponent } from '../tab1chart/tab1chart.component';
import { Toggle3chartComponent } from '../toggle3chart/toggle3chart.component';
import * as D3 from 'd3v4';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
import { AppComponent } from '../../app.component';

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
@Component({
  selector: 'app-toggle2chart',
  templateUrl: './toggle2chart.component.html',
  styleUrls: ['./toggle2chart.component.css']
})
export class Toggle2chartComponent implements OnInit {

  @Input() filteredData: any;
          toggle3X: any;
          toggle3XEnd: any;


  public options: any = {
  }
  constructor() { }

  ngOnInit(): void {


    var
      map = Highcharts.map,
      series,
      states = [];

    D3.csv('./assets/Toggle2.csv', (data) => {


      let groupedData = D3.nest()
        .key(function (d) { return d.Category; })
        .entries(data);

      groupedData.forEach((element) => {
        let tmp = [];
        tmp['model'] = element['key'];
        tmp['deals'] = [];
        element.values.forEach(el => {
          let tmpDate = new Date(el['Start Date'] + ' ' + el['Start Time']);
          let startstamp = tmpDate.getTime();
          let tmpdeal = [];
          tmpdeal['from'] = startstamp;
          let endDate = new Date(el['End Date'] + ' ' + el['End Time']);
          let endstamp = endDate.getTime();
          tmpdeal['to'] = endstamp;
          tmp['deals'].push(tmpdeal);
        });
        states.push(tmp);
      });




      console.log(states);

      series = states.map(function (car, i) {
        let model = car.model;
        let data = car.deals.map(function (deal) {

          return {
            id: 'deal-' + i,
            rentedTo: deal.rentedTo,
            startDate: deal.from,
            endDate: deal.to,
            label: model,
            duration: (deal.to - deal.from) / (1000 * 60),
            dependsOn:[],
            y: i
          };
        });
        return {
          name: car.model,
          data: data
        };
      });

      let filterminmax = this.filteredData;
      let filteredseries = [];
      if(filterminmax !== undefined) {
        for (let i = 0; i < series.length; i++) {
          var tmp =  series[i].data.filter(function (e) {
                  return e.startDate >= filterminmax.xAxisMin && e.endDate <= filterminmax.xAxisMax;
          });
          let seriesdatum = states[i];
          seriesdatum.deals = tmp
          filteredseries.push(seriesdatum);
        }
      }

      console.log(series);
      console.log(filteredseries);



    // kind of https://s3.amazonaws.com/wordpress-production/wp-content/uploads/sites/15/2016/04/gantt-updated-dependencies-1024x578.png

    const prepareDataElement = ({ id, label, startDate, endDate, duration, dependsOn }) => {
      if ((!startDate || !endDate) && !duration) {
        //throw new Exception('Wrong element format: should contain either startDate and duration, or endDate and duration or startDate and endDate');
      }

      if (startDate) startDate = new Date(startDate);

      if (endDate) endDate = new Date(endDate);

      if (startDate && !endDate && duration) {
        endDate = new Date(startDate);
        if(duration[1] === "Days")
          endDate.addDays(duration[0]);
      }

      if (!startDate && endDate && duration) {
        startDate = new Date(endDate);

        if(duration[1] === "Days")
          startDate.addDays(-duration[0]);
      }

      if (!dependsOn)
        dependsOn = [];

      return {
        id,
        label,
        startDate,
        endDate,
        duration,
        dependsOn
      };
    };

    const findDateBoundaries = data => {
      let minStartDate, maxEndDate;

      // data.forEach(({ startDate, endDate }) => {
      //   if (!minStartDate || startDate < minStartDate) minStartDate = new Date(startDate);
      //
      //   if (!minStartDate || endDate < minStartDate) minStartDate = new Date(endDate);
      //
      //   if (!maxEndDate || endDate > maxEndDate) maxEndDate = new Date(endDate);
      //
      //   if (!maxEndDate || startDate > maxEndDate) maxEndDate = new Date(startDate);
      // });

      minStartDate = new Date(Tab1chartComponent.minDate);
      maxEndDate = new Date(Tab1chartComponent.maxDate);

      return {
        minStartDate,
        maxEndDate
      };
    };

    const createDataCacheById = data => data.reduce((cache, elt) => Object.assign(cache, { [elt.id]: elt }), {});

    const createChildrenCache = data => {
      const dataCache = createDataCacheById(data);

      const fillDependenciesForElement = (eltId, dependenciesByParent) => {
        dataCache[eltId].dependsOn.forEach(parentId => {
          if (!dependenciesByParent[parentId])
            dependenciesByParent[parentId] = [];

          if (dependenciesByParent[parentId].indexOf(eltId) < 0)
            dependenciesByParent[parentId].push(eltId);

          fillDependenciesForElement(parentId, dependenciesByParent);
        });
      };

      return data.reduce((cache, elt) => {
        if (!cache[elt.id])
          cache[elt.id] = [];

        fillDependenciesForElement(elt.id, cache);

        return cache;
      }, {});
    }

    const sortElementsByChildrenCount = data => {
      const childrenByParentId = createChildrenCache(data);

      return data.sort((e1, e2) => {
        if (childrenByParentId[e1.id] && childrenByParentId[e2.id] && childrenByParentId[e1.id].length > childrenByParentId[e2.id].length)
          return -1;
        else
          return 1;
      });
    };

    const sortElementsByEndDate = data =>
      data.sort((e1, e2) => {
        if (new Date(e1.endDate) < (new Date(e2.endDate)))
          return -1;
        else
          return 1;
      });

    const sortElements = (data, sortMode) => {
      if (sortMode === 'childrenCount') {
        return sortElementsByChildrenCount(data);
      } else if (sortMode === 'date') {
        return sortElementsByEndDate(data);
      }
    }

    const parseUserData = data => data.map(prepareDataElement);

    const createPolylineData = (rectangleData, elementHeight) => {
      // prepare dependencies polyline data
      const cachedData = createDataCacheById(rectangleData);

      // used to calculate offsets between elements later
      const storedConnections = rectangleData.reduce((acc, e) => Object.assign(acc, { [e.id]: 0 }), {});

      // create data describing connections' lines
      return rectangleData.flatMap(d =>
        d.dependsOn
          .map(parentId => cachedData[parentId])
          .map(parent => {
            const color = '#' + (Math.max(0.1, Math.min(0.9, Math.random())) * 0xFFF << 0).toString(16);

            // increase the amount rows occupied by both parent and current element (d)
            storedConnections[parent.id]++;
            storedConnections[d.id]++;

            const deltaParentConnections = storedConnections[parent.id] * (elementHeight / 4);
            const deltaChildConnections = storedConnections[d.id] * (elementHeight / 4);

            const points = [
              d.x, (d.y + (elementHeight / 2)),
              d.x - deltaChildConnections, (d.y + (elementHeight / 2)),
              d.x - deltaChildConnections, (d.y - (elementHeight * 0.25)),
              parent.xEnd + deltaParentConnections, (d.y - (elementHeight * 0.25)),
              parent.xEnd + deltaParentConnections, (parent.y + (elementHeight / 2)),
              parent.xEnd, (parent.y + (elementHeight / 2))
            ];

            return {
              points: points.join(','),
              color
            };
          })
      );
    };

    const createElementData = (data, elementHeight, xScale, fontSize) =>
      data.map((d, i) => {
        const x = xScale(d.startDate);
        const xEnd = xScale(d.endDate);
        const y = i * elementHeight * 1.5;
        const width = xEnd - x;
        const height = elementHeight;

        const charWidth = (width / fontSize);
        const dependsOn = d.dependsOn;
        const id = d.id;

        const tooltip = d.duration;

        const singleCharWidth = fontSize * 0.5;
        const singleCharHeight = fontSize * 0.45;

        let label = d.label;

        // if (label.length > charWidth) {
        //   label = label.split('').slice(0, charWidth - 3).join('') + '...';
        // }

        const labelX = x + ((width / 2) - ((label.length / 2) * singleCharWidth));
        const labelY = y + ((height / 2) + (singleCharHeight));

        return {
          x,
          y,
          xEnd,
          width,
          height,
          id,
          dependsOn,
          label,
          labelX,
          labelY,
          tooltip
        };
      });

    const createChartSVG = (data, placeholder, { svgWidth, svgHeight, elementHeight, scaleWidth, scaleHeight, fontSize, minStartDate, maxEndDate, margin, showRelations }) => {
      // create container element for the whole chart
      var svgtodelete = D3.select("#toggle2chart2");
      svgtodelete.selectAll("*").remove();
      const svg = D3.select("#toggle2chart2").append('svg').attr('width', svgWidth).attr('height', svgHeight)
                  .on("mousedown", svgmousedown)
                  .on("mouseup", svgmouseup)
                  .on("mousemove", svgmousemove)
                  .on("mouseout", svgmouseout);

                  let dragrect : any;
                  let dragwidth : any;
                  let panStartPoint : any;
                  let panEndPoint : any;
                  let mouseDown : boolean = false;
                  function svgmousedown() {

                    if(D3.event.shiftKey) {
                        var m = D3.mouse(this);
                        panStartPoint = m[0];
                    }
                    else {
                      mouseDown = true;
                      var m = D3.mouse(this);

                      dragrect = svg.append("rect")
                          .attr("x", m[0])
                          .attr("y", m[1])
                          .attr("class", "zoomingrect")
                          .attr("height", 0)
                          .attr("width", 0)
                          .style("fill", "steelblue")
                          .style("opacity", 0.2);
                    }

                    svg.on("mousemove", svgmousemove);
                  }

                  function svgmousemove(d) {
                    if(D3.event.shiftKey) {
                      var m = D3.mouse(this);
                      panEndPoint = m[0];
                    }
                    else if(!mouseDown) {
                      AppComponent.highchartsmouseover = true;

                      let appcomp = new AppComponent();
                      appcomp.appMouseMoveFn();
                    }
                    else {
                      var m = D3.mouse(this);
                      dragwidth = Math.max(0, m[0] - +dragrect.attr("x"));
                      dragrect.attr("width", Math.max(0, m[0] - +dragrect.attr("x")))
                          .attr("height", Math.max(0, m[1] - +dragrect.attr("y")));
                    }
                  }

                  function svgmouseup() {
                    mouseDown = false;
                    if(D3.event.shiftKey) {

                      console.log(Tab1chartComponent.maxDate, Tab1chartComponent.actualMaxDate);

                      if(Tab1chartComponent.zoomed === 1) {

                      var panstartDate = new Date(xScale.invert(panStartPoint)).getTime();
                      var panendDate = new Date(xScale.invert(panEndPoint)).getTime();

                      var datediff = panendDate - panstartDate;

                      let tabchart1comp = new Tab1chartComponent();
                      console.log(minStartDate + datediff, maxEndDate + datediff);

                      tabchart1comp.setintervalfrompopup(Tab1chartComponent.minDate - datediff, Tab1chartComponent.maxDate - datediff, 1, 5);
                    }
                    }
                    else {

                      console.log(dragrect.attr("x"), dragwidth);
                      let scaledraggedWidth = dragwidth + +dragrect.attr("x");

                      if(scaledraggedWidth < 0)
                          return;

                      Tab1chartComponent.zoomed = 1;
                      var zoomedstarttime = new Date(xScale.invert(+dragrect.attr("x") - 100)).getTime();
                      var zoomendtime = new Date(xScale.invert(scaledraggedWidth - 100)).getTime();

                      console.log(new Date(zoomedstarttime), new Date(zoomendtime));

                      svg.selectAll(".zoomingrect").remove();

                      let tabchart1comp = new Tab1chartComponent();

                      tabchart1comp.setintervalfrompopup(zoomedstarttime, zoomendtime, 1, 6);
                    }

                    svg.on("mousemove", null);
                  }

                  function svgmouseout() {
                    AppComponent.highchartsmouseover = false;

                    let appcomp = new AppComponent();
                    appcomp.appMouseMoveFn();
                  }

      const xScale = D3.scaleTime()
        .domain([minStartDate, maxEndDate])
        .range([0, svgWidth - 100]);

      // prepare data for every data element
      const rectangleData = createElementData(data, elementHeight, xScale, fontSize);

      // create data describing connections' lines
      const polylineData = createPolylineData(rectangleData, elementHeight);

      const xAxis = D3.axisBottom(xScale);

      // create container for the data
      const g1 = svg.append('g').attr('transform', `translate(91.5,${margin.top})`);

      const linesContainer = g1.append('g').attr('transform', `translate(0,${margin.top})`);
      const barsContainer = g1.append('g').attr('transform', `translate(0,${margin.top})`);

      //g1.append('g').call(xAxis);

      // create axes
      const bars = barsContainer
        .selectAll('g')
        .data(rectangleData)
        .enter()
        .append('g');

      // add stuff to the SVG
      if (showRelations) {
        linesContainer
          .selectAll('polyline')
          .data(polylineData)
          .enter()
          .append('polyline')
          .style('fill', 'none')
          .style('stroke', d => d.color)
          .attr('points', d => d.points);
      }

      var ids = {};

      var totallabelTransform = function(d) {

        return "translate(" + scaleWidth + "," + (d.y - 60) + ")";
      };



      bars
        .append('svg')
        .attr('width',1145)
        .attr('height',scaleHeight)
        .append('rect')
        .attr('x', d => Math.max(0, d.x))
        .attr('y', function(d) {
          if(ids[d.id] === undefined) {
            ids[d.id] = d.y;
            return d.y;
          }
         return ids[d.id]; })
        .attr('width', function(d) {
            if(d.x >= 0) {
              return d.width;
            }
            else {
              return d.width + d.x;
            }
        })
        .attr('height', d => d.height)
        .style('fill', '#F3D849')
        .style('stroke', 'black');




        // bars
        // .filter(function(d){
        //   var ypos = domain.indexOf(d.y);
        //   var xpos = domain.indexOf(d.x);
        //   return xpos == ypos;
        // })
        // .append("text")
        // .text(function(d) {
        //     return "hafiz"
        // })
        // .style("font-size", 14)
        // .style("text-align", "center")
        // .style("fill", "#fff")
        // .attr("transform", totallabelTransform);

        var distinctstage = [];

      bars
      .filter(function(d){
        if(distinctstage.includes(d.label)) { return false;}
        distinctstage.push(d.label);
        return true;
      })
        .append('text')
        .style('fill', '#fff')
        .style('font-family', 'sans-serif')
        .attr('x', d => -60)
        .attr('y', d => d.labelY)
        .text(d => d.label);

        distinctstage = [];

        function sum(items, prop){
           return items.reduce( function(a, b){
               return a + b[prop];
           }, 0);
       };

        bars
        .filter(function(d){
          if(distinctstage.includes(d.label)) { return false;}
          distinctstage.push(d.label);
          return true;
        })
          .append('text')
          .style('fill', '#fff')
          .style('font-family', 'sans-serif')
          .attr('x', d => scaleWidth - 20)
          .attr('y', d => d.labelY)
          .text(function(d) {
              var fildata = data.filter(function(t) { return t.label === d.label})

              return sum(fildata, "duration").toFixed(0);
            });

            distinctstage = [];

            if(Tab1chartComponent.minDate > Tab1chartComponent.actualMinDate) {
                bars
                .filter(function(d){
                  if(distinctstage.includes(d.label)) { return false;}
                  distinctstage.push(d.label);
                  return true;
                })
                  .append('text')
                  .style('fill', '#4170ae')
                  .style('font-family', 'sans-serif')
                  .attr('x', d => scaleWidth + 20)
                  .attr('y', d => d.labelY)
                  .text(function(d) {

                      var fildata = data.filter(function(t)
                      {
                        if(t.startDate.getTime() > Tab1chartComponent.minDate && t.endDate.getTime() < Tab1chartComponent.maxDate) {

                            return t.label === d.label
                        }
                        else {
                          return false;
                        }
                      })

                      return sum(fildata, "duration").toFixed(0);
                    });
              }

      bars
        .append('title')
        .text(d => d.tooltip);

        if(Toggle3chartComponent.toogle3ClickNumber === 1) {
            console.log(this.toggle3X, this.toggle3XEnd)
            svg
              .append('rect')
              .attr('x', 90)
              .attr('y', 0)
              .attr('width', this.toggle3X)
              .attr('height', svgHeight)
              .style('fill', '#313B50')
              .style('opacity', 0.7);

              svg
                .append('rect')
                .attr('x', 90 + this.toggle3XEnd)
                .attr('y', 0)
                .attr('width', svgWidth)
                .attr('height', svgHeight)
                .style('fill', '#313B50')
                .style('opacity', 0.7);
          }
    };

    const createGanttChart = (placeholder, data, { elementHeight, sortMode, showRelations, svgOptions }) => {

      const margin = (svgOptions && svgOptions.margin) || {
        top: elementHeight * 2,
        left: elementHeight * 4
      };

      const scaleWidth = ((svgOptions && svgOptions.width) || 600) - (margin.left * 3.4);
      const scaleHeight = Math.max((svgOptions && svgOptions.height) || 200, data.length * elementHeight * 2) - (margin.top * 2);

      const svgWidth = scaleWidth + (margin.left * 2);
      const svgHeight = scaleHeight / 2 + (margin.top * 2);

      const fontSize = (svgOptions && svgOptions.fontSize) || 12;

      if (!sortMode) sortMode = 'date';

      if (typeof(showRelations) === 'undefined') showRelations = true;

      data = parseUserData(data); // transform raw user data to valid values
      data = sortElements(data, sortMode);

      const { minStartDate, maxEndDate } = findDateBoundaries(data);



      // add some padding to axes
      minStartDate.setDate(minStartDate.getDate())
      maxEndDate.setDate(maxEndDate.getDate())

      createChartSVG(data, placeholder, { svgWidth, svgHeight, scaleWidth, elementHeight, scaleHeight, fontSize, minStartDate, maxEndDate, margin, showRelations });
    };

    let seriesFinalData = [];
    for (let index = 0; index < series.length; index++) {

      for (let j = 0; j < series[index].data.length; j++) {
        seriesFinalData.push(series[index].data[j]);
      }

      if(series[index].data.length === 0) {
        seriesFinalData.push(series[index]);
      }
    }

    createGanttChart(document.querySelector('body'), seriesFinalData, {
      elementHeight: 20,
      sortMode: 'date', // alternatively, 'childrenCount'
      showRelations: false,
      svgOptions: {
        width: 1455,
        height: 400,
        fontSize: 12
      }
    });
  });

  }

  public buildChart() {

  }

  public chartinterval(data, x, xEnd){
    this.filteredData = data;
    this.toggle3X = x;
    this.toggle3XEnd = xEnd;
    this.ngOnInit();

    }



}
