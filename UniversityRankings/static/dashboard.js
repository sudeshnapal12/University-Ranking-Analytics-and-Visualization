queue()
//        .defer(d3.json, "/timesData_db/timesData_2011")
//        .defer(d3.json, "/timesData_db/timesData_2012")
//        .defer(d3.json, "/timesData_db/timesData_2013")
//        .defer(d3.json, "/timesData_db/timesData_2014")
//        .defer(d3.json, "/timesData_db/timesData_2015")
//        .defer(d3.json, "/timesData_db/timesData_2016")
    .defer(d3.csv, "/timesData_2011")
    .defer(d3.csv, "/timesData_2012")
    .defer(d3.csv, "/timesData_2013")
    .defer(d3.csv, "/timesData_2014")
    .defer(d3.csv, "/timesData_2015")
    .defer(d3.csv, "/timesData_2016")
    .defer(d3.csv, "/radar_2011")
    .defer(d3.csv, "/radar_2012")
    .defer(d3.csv, "/radar_2013")
    .defer(d3.csv, "/radar_2014")
    .defer(d3.csv, "/radar_2015")
    .defer(d3.csv, "/radar_2016")
    .await(makeGraphs);

// Setting the individual year data global after we get from d3.queue()
var g_timesData_2011;
var g_timesData_2012;
var g_timesData_2013;
var g_timesData_2014;
var g_timesData_2015;
var g_timesData_2016;
var g_radar_2011;
var g_radar_2012;
var g_radar_2013;
var g_radar_2014;
var g_radar_2015;
var g_radar_2016;

function makeGraphs(error, timesData_2011, timesData_2012, timesData_2013, timesData_2014, timesData_2015, timesData_2016, radar_2011, radar_2012, radar_2013, radar_2014, radar_2015, radar_2016) {
    g_timesData_2011 = timesData_2011;
    g_timesData_2012 = timesData_2012;
    g_timesData_2013 = timesData_2013;
    g_timesData_2014 = timesData_2014;
    g_timesData_2015 = timesData_2015;
    g_timesData_2016 = timesData_2016;
    g_radar_2011 = radar_2011;
    g_radar_2012 = radar_2012;
    g_radar_2013 = radar_2013;
    g_radar_2014 = radar_2014;
    g_radar_2015 = radar_2015;
    g_radar_2016 = radar_2016;

//    //[CHART2] - BAR CHART
////    barChart(g_timesData_2016, 'country', 'num_students');
//
//    //[CHART3] BUBBLE CHART
//    clickableBubbleChart(g_timesData_2016, 'country', 'univ_count');
//    bubbleChart(g_timesData_2016, 'country', 'univ_count');
    renderMap(g_timesData_2016);
    get_histogram(g_timesData_2016, 'num_students');
    stackBar();
    radar(g_radar_2016);
}

var column = 'num_students';
function updateUIAttribute(){
    column = document.getElementById("options_attr").value;
    if(column == "")
        column = 'num_students';

    updateUIYear_histo();
}

var year = '2016';

function updateUIYear(){
    year = document.getElementById("options_year").value;
    document.getElementById("radarHeading").innerHTML = "<b>Comparision of each criteria across universitites in "+year+"</b>";
    document.getElementById("histHeading").innerHTML = "<b>Distribution of Universities in "+year+"</b>";
    document.getElementById("mapHeading").innerHTML = "<b>Countries with Top 200 Universitites in "+year+"</b>";
    document.getElementById("countryBar").style.visibility = "visible";
    document.getElementById("countryBarText").style.visibility = "visible";
	if(year == "")
		year = '2016';

	if(year == '2016')
	{
		data = g_timesData_2016
		data1 = g_radar_2016;
	}
	else if(year == '2015')
	{
		data = g_timesData_2015
		data1 = g_radar_2015;
	}
	else if(year == '2014')
	{
		data = g_timesData_2014
		data1 = g_radar_2014;
	}
	else if(year == '2013')
	{
		data = g_timesData_2013
		data1 = g_radar_2013;
	}
	else if(year == '2012')
	{
		data = g_timesData_2012
		data1 = g_radar_2012;
	}
	else if(year == '2011')
	{
		data = g_timesData_2011
		data1 = g_radar_2011;
    }
    renderMap(data);
    stackBar();
    radar(data1);
    var barChartType = document.querySelector('input[name = "myRadio"]:checked').value;
    if(barChartType == 1){
        barChart(data, 'country', 'num_students');
    }
    if(barChartType == 2){
        get_histogram(data, 'num_students');
    }
}

function updateUIYear_histo()
{
    console.log('update year histo');
    year = document.getElementById("options_year").value;
    if(year == "")
        year = '2016';

    if(year == '2016')
        data = g_timesData_2016
    else if(year == '2015')
        data = g_timesData_2015
    else if(year == '2014')
        data = g_timesData_2014
    else if(year == '2013')
        data = g_timesData_2013
    else if(year == '2012')
        data = g_timesData_2012
    else if(year == '2011')
        data = g_timesData_2011

    var barChartType = document.querySelector('input[name = "myRadio"]:checked').value;
    if(barChartType == 1){
        barChart(data, 'country', column);
    }
    if(barChartType == 2){
        get_histogram(data, column);
    }
}

function updateLinePlots(){
    document.getElementById("stackBar").innerHTML = "";
    var brushedData = [];
    for(i=0; i<foreground[0].length; i++){
        if(foreground[0][i].style["display"] === ""){
            brushedData.push(foreground[0][i].__data__);
        }
    }
    console.log(brushedData);
    universityNames = [];
    for(i=0; i<brushedData.length; i++){
        universityNames.push(brushedData[i].university_name);
    }

    universityRankTrend = getRank(universityNames);
    lineChart(universityRankTrend);
}

function worldmap(g_world_topo){
    var width = 960,
        height = 580;

    var color = d3.scale.category10();

    var projection = d3.geo.kavrayskiy7()
        .scale(170)
        .translate([width / 2, height / 2])
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    var graticule = d3.geo.graticule();

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("defs").append("path")
        .datum({type: "Sphere"})
        .attr("id", "sphere")
        .attr("d", path);

    svg.append("use")
        .attr("class", "stroke")
        .attr("xlink:href", "#sphere");

    svg.append("use")
        .attr("class", "fill")
        .attr("xlink:href", "#sphere");

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

    world = g_world_topo;

    var countries = topojson.feature(world, world.objects.countries).features,
        neighbors = topojson.neighbors(world.objects.countries.geometries);

    svg.selectAll(".country")
          .data(countries)
        .enter().insert("path", ".graticule")
          .attr("class", "country")
          .attr("d", path)
          .style("fill", function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); });

    svg.insert("path", ".graticule")
          .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
          .attr("class", "boundary")
          .attr("d", path);

    d3.select(self.frameElement).style("height", height + "px");
}

function updateHistDiv(){
    var barChartType = document.querySelector('input[name = "myRadio"]:checked').value;
    if(barChartType == 1){
        barChart(g_timesData_2016, 'country', 'num_students');
    }
    if(barChartType == 2){
        get_histogram(g_timesData_2016, 'num_students');
    }
}

//function for radar chart
function radar(data){
    var margin = {top: 100, right: 100, bottom: 100, left: 100},
				legendPosition = {x: 25, y: 25},
				width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
				height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

	var color = d3.scale.ordinal()
				.range(["#EDC951","#CC333F","#00A0B0"]);

	var radarChartOptions = {
	    w: width,
		h: height,
		margin: margin,
		legendPosition: legendPosition,
		maxValue: 0.5,
		wrapWidth: 60,
		levels: 5,
		roundStrokes: true,
		color: color,
		axisName: "reason",
		areaName: "device",
		value: "value"
		};

    new_data = []
    data.forEach(function(item){
        newSeries = {}
        newSeries.key = item.Country;
        newSeries.values = [];
        newSeries.values.push({"reason":"Citations","device":item.Country,"value":parseFloat(item.Citations)});
        newSeries.values.push({"reason":"Income","device":item.Country,"value":parseFloat(item.Income)});
        newSeries.values.push({"reason":"International","device":item.Country,"value":parseFloat(item.International)});
        newSeries.values.push({"reason":"Research","device":item.Country,"value":parseFloat(item.Research)});
        newSeries.values.push({"reason":"Teaching","device":item.Country,"value":parseFloat(item.Teaching)});
        new_data.push(newSeries);
    })

    RadarChart(".radarChart", new_data, radarChartOptions);
}

function backToHome(){
    document.getElementById('radarChartID').innerHTML = "";
    document.getElementById('stackBar').innerHTML = "";
    radar(g_radar_2016);
    stackBar();
    get_histogram(g_timesData_2016, column);
    document.getElementById("heading").innerHTML = "<h3> Universities across the world </h3>";
    document.getElementById("updateLine").style.visibility = "hidden";
    document.getElementById("radarHeading").innerHTML = "<b>Comparision of each criteria across countries in 2016</b>";
    document.getElementById("countryBar").style.visibility = "visible";
    document.getElementById("countryBarText").style.visibility = "visible";
    document.getElementById("stackBarTitle").innerHTML = "<b>Evolution of each criteria used in ranking</b>";
}