function renderMap(csvData){
    document.getElementById("container").innerHTML = "";
    var uniqueCountries = [];

    console.log('csvData', csvData)
    for(i = 0; i< csvData.length; i++){
        if(uniqueCountries.indexOf(csvData[i].country) === -1){
            uniqueCountries.push(csvData[i].country);
        }
    }

    var univCount = {};
    csvData.forEach(function(x) {
        if(x.country === 'United States of America'){
            country = 'United States';
        }else if(x.country === 'South Korea' || x.country === 'North Korea'){
            country = 'Korea';
        }else if(x.country === 'Republic of Ireland'){
            country = 'Ireland'
        }else if(x.country === 'Taiwan'){
            country = 'Taiwan, Province of China'
        }else{
            country = x.country;
        }
        univCount[country] = (univCount[country] || 0)+1;
    });
    console.log(univCount);

    uniqueCountries.push("United States");
    if(uniqueCountries.indexOf("South Korea") > -1 || uniqueCountries.indexOf("North Korea") > -1){
        uniqueCountries.push("Korea");
    }
    if(uniqueCountries.indexOf("Republic of Ireland") > -1){
        uniqueCountries.push("Ireland");
    }
    if(uniqueCountries.indexOf("Taiwan") > -1){
       uniqueCountries.push("Taiwan, Province of China");
    }

//    console.log(uniqueCountries.length);
//    console.log(uniqueCountries);

    d3.select(window).on("resize", throttle);

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 9])
        .on("zoom", move);

    var width = document.getElementById('container').offsetWidth;
    var height = width / 2;
    var topo,projection,path,svg,g;
    var graticule = d3.geo.graticule();
    var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

    setup(width,height);

    function setup(width,height){
        projection = d3.geo.mercator()
            .translate([(width/2), (height/2)])
            .scale( width / 2 / Math.PI);

        path = d3.geo.path().projection(projection);

        svg = d3.select("#container").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom)
            .append("g");

        g = svg.append("g");
    }

    d3.json("world-topo-min.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        topo = countries;
        draw(topo);
    });

    function draw(topo) {
        svg.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path)

        g.append("path")
            .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
            .attr("class", "equator")
            .attr("d", path);

        var country = g.selectAll(".country").data(topo);
        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("class", "boundary")
            .attr("id", function(d,i) { return d.id; })
            .attr("title", function(d,i) { return d.properties.name; })
            .style("fill", function(d, i) {
                if(uniqueCountries.indexOf(d.properties.name) > -1){
//                    return d.properties.color;
                      return "pink";
                }else{
                    return "#FFFFF0";
                }
           });

        //offsets for tooltips
        var offsetL = document.getElementById('container').offsetLeft+20;
        var offsetT = document.getElementById('container').offsetTop+10;

        //tooltips
        country.on("mousemove", function(d,i) {
                var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
                if(typeof univCount[d.properties.name] == 'undefined'){
                    count = 0;
                }else{
                    count = univCount[d.properties.name];
                }

                tooltip.classed("hidden", false)
                    .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
                    .html(d.properties.name + " <br>" + count + " universitites");
                })
                .on("mouseout",  function(d,i) {
                    tooltip.classed("hidden", true);
                })
                .on("click", click);
    }

    function redraw() {
        width = document.getElementById('container').offsetWidth;
        height = width / 2;
        d3.select('svg').remove();
        setup(width,height);
        draw(topo);
    }

    function move() {
        var t = d3.event.translate;
        var s = d3.event.scale;
        zscale = s;
        var h = height/4;

        t[0] = Math.min(
            (width/height)  * (s - 1),
            Math.max( width * (1 - s), t[0] )
        );

        t[1] = Math.min(
            h * (s - 1) + h * s,
            Math.max(height  * (1 - s) - h * s, t[1])
        );

        zoom.translate(t);
        g.attr("transform", "translate(" + t + ")scale(" + s + ")");

        //adjust the country hover stroke width based on zoom level
        d3.selectAll(".country").style("stroke-width", 1.5 / s);
    }

    var throttleTimer;
    function throttle() {
        window.clearTimeout(throttleTimer);
        throttleTimer = window.setTimeout(function() {
            redraw();
        }, 200);
    }

    function get_countryWiseData(cntry) {
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

       cntry_data = []
       data.forEach(function(d) {
          if(d.country == cntry){
            cntry_data.push(d)
          }
       })
       return cntry_data;
    }

    //geo translation on mouse click in map
    function click(d) {
        var latlon = projection.invert(d3.mouse(this));

        country = d.properties.name;
        if(country === 'United States'){
            country = 'United States of America';
        }
        if(country === "South Korea" || country === "North Korea"){
            country = 'Korea';
        }
        if(country === "Republic of Ireland"){
            country = "Ireland";
        }
        if(country === "Taiwan"){
           country = "Taiwan, Province of China";
        }
        cntrywiseData = get_countryWiseData(country);
        document.getElementById('stackBar').innerHTML = "";
        get_histogram(cntrywiseData, column);
        parallel(cntrywiseData);

        universityNames = [];
        for(i=0; i<cntrywiseData.length; i++){
            universityNames.push(cntrywiseData[i].university_name);
        }
        universityRankTrend = getRank(universityNames);
        lineChart(universityRankTrend);

        document.getElementById("heading").innerHTML = "<h3>Universities in " + country + "</h3>";
        document.getElementById("radarHeading").innerHTML = "<b>Comparision of each criteria across universitites in "+year+"</b>";
        document.getElementById("updateLine").style.visibility = "visible";
        document.getElementById("countryBar").style.visibility = "hidden";
        document.getElementById("countryBarText").style.visibility = "hidden";
    }

    //function to add points and text to the map (used in plotting capitals)
    function addpoint(lat,lon,text) {
        var gpoint = g.append("g").attr("class", "gpoint");
        var x = projection([lat,lon])[0];
        var y = projection([lat,lon])[1];

        gpoint.append("svg:circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("class","point")
            .attr("r", 1.5);

        //conditional in case a point has no associated text
        if(text.length>0){
            gpoint.append("text")
                .attr("x", x+2)
                .attr("y", y+2)
                .attr("class","text")
                .text(text);
        }
    }
}