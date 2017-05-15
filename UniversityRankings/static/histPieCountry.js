function barChart(csvData, xcol, ycol){
    document.getElementById('histogram').innerHTML = "";
    var color = d3.scale.category20();
    var newObj = {};
    for( i=0; i<csvData.length; i++){
        var item = csvData[i];
        if(newObj[item.country] === undefined){
            newObj[item.country] = 0;
        }
        newObj[item.country] += parseFloat(item[ycol]);
    }

    var univCount = {};
    csvData.forEach(function(x) {
        univCount[x.country] = (univCount[x.country] || 0)+1;
    });


    var data = [];
    for(i in newObj){
//        if(ycol == 'student_staff_ratio'){
            newObj[i] = newObj[i]/univCount[i];
//        }
        data.push({'country':i, [ycol]:newObj[i]});
    }

    var margin = {top: 20, right: 20, bottom: 120, left: 70},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var svg = d3.select("#histogram").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
        d[xcol] = d[xcol];
        d[ycol] = + d[ycol];
    });

    x.domain(data.map(function(d) { return d[xcol]; }));
    y.domain([0, d3.max(data, function(d) { return d[ycol]; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)" )

    svg.append("g")
        .attr("class", "y axis")
            .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0- (height/2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(ycol);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>"+ycol+":</strong> <span style='color:red'>" + d[ycol] + "</span>";
        })
    svg.call(tip);

    svg.selectAll("histogram")
        .data(data)
        .enter()
        .append("rect")
            .style("fill", function(d,i) {
                    return color(i); })
            .attr("x", function(d) { return x(d[xcol]); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d[ycol]); })
            .attr("height", function(d) { return height - y(d[ycol]); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .on({"click":  function(d,i) {
                    tip.hide(d);
                    getPieCountry(data,xcol,ycol);
            }});
}

function getPieCountry(data, xcol, ycol){
    document.getElementById('histogram').innerHTML = "";
    //Width and height
    var margin = {top: 20, right: 20, bottom: 20, left: 60},
    w = 600 - margin.left - margin.right,
    h = 600 - margin.top - margin.bottom;

    var tip = d3.tip()
        .attr('class', 'd3-tip')
            .offset([-10, 0])
        .html(function(d) {
                return "<strong>"+ycol+"</strong> <span style='color:red'>" + d.data[ycol] + "</span>";
        })

    var outerRadius = w / 2;
	var innerRadius = 0;
	var arc = d3.svg.arc()
	    .innerRadius(innerRadius)
		.outerRadius(outerRadius-20);

    var extended_arc = d3.svg.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius)

	var pie = d3.layout.pie()
	    .sort(null)
		.value(function(d) { return d[ycol]; });

	//Easy colors accessible via a 10-step ordinal scale
	var color = d3.scale.category20();

	//Create SVG element
	var svg = d3.select("#histogram")
	    .append("svg")
		.attr("width", w)
		.attr("height", h);

	svg.call(tip);

	//Set up groups
	var arcs = svg.selectAll("g.arc")
        .data(pie(data))
		    .enter()
		.append("g")
		.attr("class", "arc")
		.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")
        .on({"click":  function(d,i) {
                tip.hide(d);
                barChart(data, xcol, ycol);
            }});

	//Draw arc paths
	arcs.append("path")
	    .style("fill", function(d,i) { return color(i); })
	    .attr("fill", function(d, i) { return color(i); })
		.attr("d", arc)
		.on({"mouseover": function(d,i) {
                tip.show(d);
                d3.select(this).transition()
                .attr("d",extended_arc)
            },
            "mouseout":  function(d,i) {
                tip.hide(d);
                d3.select(this).transition()
                .attr("d",arc)
            },
            });

	//Labels
    arcs.append("text")
	    .attr("transform", function(d) {
	        return "translate(" + arc.centroid(d) + ")";
		})
		.attr("text-anchor", "middle")
		.text(function(d) {
		    return d.data[xcol];
	    });
}