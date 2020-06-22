import { Component, OnInit } from '@angular/core';
import * as D3 from 'd3v4';

@Component({
  selector: 'app-toggle3chart',
  templateUrl: './toggle3chart.component.html',
  styleUrls: ['./toggle3chart.component.css']
})
export class Toggle3chartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var
      series,
      states = [];

    D3.csv('./assets/Toggle3.csv', (data) => {
          console.log(data);


          let columns = data['columns'];
          series = data
          console.log(series);

          series.forEach((el, i) => {
            let tmp = el;
            tmp['id'] = "id" + i;
            tmp['duration'] = parseInt(el['Amount']);
            tmp['label'] = el['Type'];
            let tmpDate = new Date(el['Start Date'] + ' ' + el['Start Time']);
            let startstamp = tmpDate.getTime();
            tmp['startDate'] = startstamp;
            let endDate = new Date(el['End Date'] + ' ' + el['End Time']);
            let endstamp = endDate.getTime();
            tmp['endDate'] = endstamp;
            tmp['dependsOn'] = [];
            states.push(tmp);
        });


        console.log(states);

        function groupBy(xs, key) {
          return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
          }, {});
        };

        const catUnique = [...new Set(states.map(item => item['label']))];
        var groupedstates = groupBy(states, "label");

        console.log(catUnique);
        console.log(groupedstates);


        let seriesdata = [];
        for (let i = 0; i < catUnique.length; i++) {
          var seriesdatum = {};
          seriesdatum.name = catUnique[i];
          seriesdatum.data = groupedstates[catUnique[i]];
          seriesdata.push(seriesdatum)
        }

        console.log(seriesdata);


        var margin = {top: 20, right: 20, bottom: 50, left: 50},
            width = 1100 - margin.left - margin.right,
            height = 1000 - margin.top - margin.bottom;

             var color = D3.scaleOrdinal(D3.schemeCategory20);

             console.log(color);

                  // kind of https://s3.amazonaws.com/wordpress-production/wp-content/uploads/sites/15/2016/04/gantt-updated-dependencies-1024x578.png

                  const prepareDataElement = ({ id, label, startDate, endDate, duration, dependsOn, Category }) => {
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
                      dependsOn,
                      Category
                    };
                  };

                  const findDateBoundaries = data => {
                    let minStartDate, maxEndDate;

                    data.forEach(({ startDate, endDate }) => {
                      if (!minStartDate || startDate < minStartDate) minStartDate = new Date(startDate);

                      if (!minStartDate || endDate < minStartDate) minStartDate = new Date(endDate);

                      if (!maxEndDate || endDate > maxEndDate) maxEndDate = new Date(endDate);

                      if (!maxEndDate || startDate > maxEndDate) maxEndDate = new Date(startDate);
                    });

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

                    const sortElementsalphaOrder = data =>
                      data.sort((e1, e2) => {
                        if (e1.label < e2.label)
                          return -1;
                        else if(e1.label > e2.label)
                          return 1;
                        else return 0;
                      });

                  const sortElements = (data, sortMode) => {
                    if (sortMode === 'childrenCount') {
                      return sortElementsByChildrenCount(data);
                    } else if (sortMode === 'date') {
                      return sortElementsalphaOrder(data);
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
                      console.log(d);

                      const x = xScale(d.startDate);
                      const xEnd = xScale(d.endDate);
                      const y = i * elementHeight * 1.5;
                      const width = xEnd - x;
                      const height = elementHeight;
                      const category = d.Category;

                      const charWidth = (width / fontSize);
                      const dependsOn = d.dependsOn;
                      const id = d.id;

                      const tooltip = d.duration;

                      const singleCharWidth = fontSize * 0.5;
                      const singleCharHeight = fontSize * 0.45;

                      console.log(d);

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
                        tooltip,
                        category
                      };
                    });

                  const createChartSVG = (data, placeholder, { svgWidth, svgHeight, elementHeight, scaleWidth, scaleHeight, fontSize, minStartDate, maxEndDate, margin, showRelations }) => {
                    // create container element for the whole chart
                    const svg = D3.select("#toggle3chart").append('svg').attr('width', svgWidth).attr('height', svgHeight);

                    const xScale = D3.scaleTime()
                      .domain([minStartDate, maxEndDate])
                      .range([0, scaleWidth]);

                    // prepare data for every data element
                    const rectangleData = createElementData(data, elementHeight, xScale, fontSize);

                    // create data describing connections' lines
                    const polylineData = createPolylineData(rectangleData, elementHeight);

                    const xAxis = D3.axisBottom(xScale);

                    // create container for the data
                    const g1 = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

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
                    var fillids = {};

                    var totallabelTransform = function(d) {

                      return "translate(" + scaleWidth + "," + (d.y - 60) + ")";
                    };

                    let nextlevel = 0;
                    let prevCat = "";
                    let nextlevelCat = 0;
                    var totalCat = [];

                    bars
                      .append('rect')
                      .attr('x', d => d.x)
                      .attr('y', function(d) {

                        let catspace = 0;

                        // Uncomment Mandatory
                        if(prevCat === ""){
                          prevCat = d.category;
                          let totalcatdatum = {}
                          totalcatdatum.category =  d.category;
                          totalcatdatum.yAxis = 0;
                          let arr = groupBy(seriesFinalData, "Category")[d.category];
                          const catUnique = [...new Set(arr.map(item => item['label']))];
                          totalcatdatum.count = catUnique.length;
                          console.log(totalcatdatum);

                          totalCat.push(totalcatdatum);
                          catspace = 0;
                        }
                        else if(prevCat !== d.category)  {
                          prevCat = d.category;
                          nextlevelCat += 30;
                          var totalcatdatum = {}
                          totalcatdatum.category =  d.category;
                          totalcatdatum.yAxis = nextlevelCat;
                          let arr = groupBy(seriesFinalData, "Category")[d.category];
                          const catUnique = [...new Set(arr.map(item => item['label']))];
                          totalcatdatum.count = catUnique.length;
                          console.log(totalcatdatum);
                          totalCat.push(totalcatdatum);
                          catspace = nextlevelCat;
                        }
                        else {
                          catspace = nextlevelCat;
                        }

                        if(ids[d.label] === undefined) {
                          ids[d.label] = nextlevel;

                          nextlevel += 30;

                          return nextlevel - 30 + catspace;
                        }

                       return ids[d.label] + catspace;
                     })
                      .attr('width', function(d) {
                       return d.width})
                      .attr('height', d => d.height)
                      .style('fill', function(d, i) {
                        if(fillids[d.category] === undefined) {
                          fillids[d.category] = color(i);
                        }
                       return fillids[d.category]  });

                       console.log(totalCat);
                       let nextcatx = 0;
                       let nexttextx = 0;
                       for (let i = 0; i < totalCat.length; i++) {
                         const element = totalCat[i];

                         svg
                         .append('rect')
                         .attr('x', 0)
                         .attr('rx', 10)
                         .attr('ry', 10)
                         .attr('y', function(d) {
                           let catx = nextcatx;
                           nextcatx += (element.count * 45);
                           console.log(nextcatx);

                            return 50 + catx;
                        })
                         .attr('width', function(d) {
                          return scaleWidth + 120;
                        })
                         .attr('height', 20)
                         .style('fill', function(d) {
                           return fillids[element.category]
                         });

                         svg.attr('height', nextcatx + 80);

                         svg
                         .append('text')
                         .attr('x', 10)
                         .style('font-size', 10)
                         .attr('y', function(d) {
                           let catx = nexttextx;
                           nexttextx += (element.count * 45);
                           console.log(nexttextx);

                            return 65 + catx;
                        })
                         .style('fill', function(d) {
                           return i % 2 === 0 ? "#fff" : "#000";
                         }).text(function(d) {
                          return element.category });

                       }


                      var distinctstage = [];
                      ids = {}
                      nextlevel = 0;
                      prevCat = "";
                      nextlevelCat = 0;
                    bars
                    .filter(function(d){
                      console.log(d.label);

                      if(distinctstage.includes(d.label)) { console.log(d);
                       return false;}

                      distinctstage.push(d.label);
                      console.log(distinctstage);

                      return true;
                    })
                      .append('text')
                      .style('fill', '#fff')
                      .style('font-family', 'sans-serif')
                      .style('font-size', '9')
                      .attr('x', d => -60)
                      .attr('y', function(d) {

                        let catspace = 0;

                        if(prevCat === ""){
                          prevCat = d.category;
                          catspace = 0;
                        }
                        else if(prevCat !== d.category)  {
                          prevCat = d.category;
                          nextlevelCat += 30;
                          catspace = nextlevelCat;
                        }
                        else {
                          catspace = nextlevelCat;
                        }


                        if(ids[d.label] === undefined) {
                          ids[d.label] = d.y;
                          //console.log(ids[d.label], d.label);
                          console.log(d);
                          nextlevel += 30;
                          return nextlevel - 15 + catspace;
                        }
                       return ids[d.label] + catspace;
                      })
                      .text(function(d) {
                       return d.label });

                      distinctstage = [];
                      ids = {}
                      nextlevel = 0;
                      prevCat = "";
                      nextlevelCat = 0;

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
                        .attr('x', d => scaleWidth + 20)
                        .attr('y', function(d) {

                          let catspace = 0;

                          if(prevCat === ""){
                            prevCat = d.category;
                            catspace = 0;
                          }
                          else if(prevCat !== d.category)  {
                            prevCat = d.category;
                            nextlevelCat += 30;
                            catspace = nextlevelCat;
                          }
                          else {
                            catspace = nextlevelCat;
                          }

                          if(ids[d.label] === undefined) {
                            ids[d.label] = d.y;
                            //console.log(ids[d.label], d.label);
                            console.log(d);
                            nextlevel += 30;
                            return nextlevel - 15 + catspace;
                          }
                         return ids[d.label] + catspace;
                        })
                        .text(function(d) {
                            var fildata = data.filter(function(t) { return t.label === d.label})

                            return sum(fildata, "duration").toFixed(0);
                          });

                    bars
                      .append('title')
                      .text(d => d.tooltip);
                  };

                  const createGanttChart = (placeholder, data, { elementHeight, sortMode, showRelations, svgOptions }) => {

                    const margin = (svgOptions && svgOptions.margin) || {
                      top: elementHeight * 2,
                      left: elementHeight * 3
                    };

                    const scaleWidth = ((svgOptions && svgOptions.width) || 600) - (margin.left * 3);
                    //const scaleHeight = Math.max((svgOptions && svgOptions.height) || 200, data.length * elementHeight * 2) - (margin.top * 2);
                    const scaleHeight = 1000;
                    const svgWidth = scaleWidth + (margin.left * 2);
                    const svgHeight = scaleHeight / 2 + (margin.top * 2);

                    const fontSize = (svgOptions && svgOptions.fontSize) || 12;

                    if (!sortMode) sortMode = 'date';

                    if (typeof(showRelations) === 'undefined') showRelations = true;

                    data = parseUserData(data); // transform raw user data to valid values
                    console.log(data);

                    data = sortElements(data, sortMode);
                    console.log(data);


                    const { minStartDate, maxEndDate } = findDateBoundaries(data);



                    // add some padding to axes
                    minStartDate.setDate(minStartDate.getDate())
                    maxEndDate.setDate(maxEndDate.getDate())

                    createChartSVG(data, placeholder, { svgWidth, svgHeight, scaleWidth, elementHeight, scaleHeight, fontSize, minStartDate, maxEndDate, margin, showRelations });
                  };

                  console.log(seriesdata);

                  let seriesFinalData = [];
                  for (let index = 0; index < seriesdata.length; index++) {

                    for (let j = 0; j < seriesdata[index].data.length; j++) {
                      seriesFinalData.push(seriesdata[index].data[j]);
                    }
                  }

                  console.log(seriesFinalData);


                  createGanttChart(document.querySelector('body'), seriesFinalData, {
                    elementHeight: 20,
                    sortMode: 'date', // alternatively, 'childrenCount'
                    showRelations: false,
                    svgOptions: {
                      width: 1200,
                      height: 400,
                      fontSize: 12
                    }
                  });



    });

  }

}
