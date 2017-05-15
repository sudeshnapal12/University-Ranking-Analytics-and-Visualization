function average(data, year){
    var totalTeaching = 0;
    var totalInternational = 0;
    var totalResearch = 0;
    var totalCitations = 0;
    var totalIncome = 0;
    for(var i = 0; i < data.length; i++) {
        totalTeaching += parseFloat(data[i]['teaching']);
        totalInternational += parseFloat(data[i]['international']);
        totalResearch += parseFloat(data[i]['research']);
        totalCitations += parseFloat(data[i]['citations']);
        totalIncome += parseFloat(data[i]['income']);
    }
    var avgTeaching = totalTeaching / data.length;
    var avgInternational = totalInternational / data.length;
    var avgReseach = totalResearch / data.length;
    var avgCitations = totalCitations / data.length;
    var avgIncome = totalIncome / data.length;

    return {label:year, "Teaching":avgTeaching, "International":avgInternational, "Research": avgReseach, "Citations":avgCitations, "Income":avgIncome};
}

function stackBar(){
    document.getElementById("stackBar").innerHTML = "";
    avg2011 = average(g_timesData_2011, 2011);
    avg2012 = average(g_timesData_2012, 2012);
    avg2013 = average(g_timesData_2013, 2013);
    avg2014 = average(g_timesData_2014, 2014);
    avg2015 = average(g_timesData_2015, 2015);
    avg2016 = average(g_timesData_2016, 2016);
    dataset = [avg2011, avg2012, avg2013, avg2014, avg2015, avg2016];

    var margin = {top: 70, right: 50, bottom: 30, left: 100},
    width = 600 ;
    height = 350 ;
    var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1,.3);
    var y = d3.scale.linear()
            .rangeRound([height, 0]);
    var colorRange = d3.scale.category20();
    var color = d3.scale.ordinal()
                .range(['#8f2447', '#e085a3','#808000', '#CD853F', '#FFA500'])
//            .range(colorRange.range());
    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));
    var svg = d3.select("#stackBar").append("svg")
//            .attr("width", width + margin.left + margin.right)
//            .attr("height", height + margin.top + margin.bottom)
              .attr("width", 750)
              .attr("height", 450)
            .append("g")
//            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            .attr("transform", "translate(100,20)");
    var divTooltip = d3.select("#stackBar").append("div").attr("class", "toolTip");
    color.domain(d3.keys(dataset[0]).filter(function(key) { return key !== "label"; }));
    dataset.forEach(function(d) {
        var y0 = 0;
        d.values = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
        d.total = d.values[d.values.length - 1].y1;
    });
    x.domain(dataset.map(function(d) { return d.label; }));
    y.domain([0, d3.max(dataset, function(d) { return d.total; })]);
    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 9)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Total Score %");
    var bar = svg.selectAll(".label")
            .data(dataset)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x(d.label) + ",0)"; });
//    svg.selectAll(".x.axis .tick text")
//            .call(wrap, x.rangeBand());
            
    var bar_enter = bar.selectAll("rect")
    .data(function(d) { return d.values; })
    .enter();

    bar_enter.append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .style("fill", function(d) { return color(d.name); });

    bar_enter.append("text")
        .text(function(d) { return d3.format(".2s")(d.y1-d.y0)+"%"; })
        .attr("y", function(d) { return y(d.y1)+(y(d.y0) - y(d.y1))/2; })
        .attr("x", x.rangeBand()/3)
        .style("fill", '#ffffff');
    
    bar.on("mousemove", function(d){
        divTooltip.style("left", d3.event.pageX+10+"px");
        divTooltip.style("top", d3.event.pageY-25+"px");
        divTooltip.style("display", "inline-block");
        var elements = document.querySelectorAll(':hover');
        l = elements.length
        l = l-1
        element = elements[l].__data__
        value = element.y1 - element.y0
        divTooltip.html((d.label)+"<br>"+element.name+"<br>"+value+"%");
        });
    bar.on("mouseout", function(d){
        divTooltip.style("display", "none");
        });
    svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(0,"+(height+30)+")");
    var legend = d3.legend.color()
            .shapeWidth(height/4)
            .shapePadding(10)
            .orient('horizontal')
            .scale(color);
    svg.select(".legendLinear")
            .call(legend);
}