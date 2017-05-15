// functions for histograms
function get_histogram(csvdata, field){
    var num_bins = 15;
    data = [];
    for (i=0; i<csvdata.length; i++)
    {
        data.push(parseFloat(csvdata[i][field]))
    }
    binning_the_data(data, field, num_bins)
}

function binning_the_data(data,field,num_bins) {
    document.getElementById("histogram").innerHTML = "";
    var color = d3.scale.category20();
    var min_data = d3.min(data);
    var max_data = d3.max(data);
    var bin_size = (max_data - min_data)/ num_bins ;
    var binmargin = (max_data - min_data)*0.008;

    var margin = {top: 10, right: 30, bottom: 50, left: 60};
        var width = 650 - (margin.left+100) - margin.right;
        var height = 400 - (margin.top+40) - margin.bottom;

        // Set the limits of the x axis
        var xmin = min_data ;
        var xmax = max_data ;

    histogram_data = new Array(num_bins);
    for(var i=0; i<num_bins; i++)
    {
        histogram_data[i] = {numfill: 0, range: (min_data + i*bin_size).toFixed(2) + " - " + (min_data + (i+1)*bin_size).toFixed(2)};
    }

    // Fill histogram_data with y-axis values
       data.forEach(function(d) {
        var bin = Math.floor((d - min_data) / bin_size);
        if ((bin.toString() != "NaN") && (bin < histogram_data.length)) {
            histogram_data[bin].numfill += 1;
        }
       });

       var x = d3.scale.linear()
         .domain([0, (xmax - xmin)])
         .range([0, width]);

       // Scale for the placement of the bars
       var x2 = d3.scale.linear()
              .domain([xmin, xmax])
          .range([0, width]);

       var y = d3.scale.linear()
             .domain([0, d3.max(histogram_data, function(d) {
                        return d.numfill;
                        })])
         .range([height, 0]);

       var xAxis = d3.svg.axis()
                 .scale(x2)
             .ticks(num_bins)
             .orient("bottom");


       var yAxis = d3.svg.axis()
             .scale(y)
             .ticks(8)
             .orient("left");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Number of universities :</strong> <span style='color:red'>" + d.numfill + "</span>";
            })

    var svg = d3.select("#histogram").append("svg")
            .attr("width", width + (margin.left+30) + margin.right)
            .attr("height", height + (margin.top+40) + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (margin.left+10) + "," +
                        (margin.top+40) + ")");

    svg.call(tip);

    // set up the bars
        var bar = svg.selectAll(".bar")
            .data(histogram_data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d, i) { return "translate(" +
             x2(i * bin_size + min_data) + "," + y(d.numfill) + ")"; })
            .style("fill", function(d,i) {
                    return color(i); })

      // add rectangles of correct size at correct location
    bar.append("rect")
        .attr("x", x(binmargin))
        .attr("width", x(bin_size - 2 * binmargin))
        .attr("height", function(d) { return height - y(d.numfill); })
        .on({
            "mouseover": function(d,i){

                d3.select(this)
                    .attr("y",d3.select(this).attr("y") - 15)
                    .attr("height",parseInt(d3.select(this).attr("height")) + 15)
                    .attr("x",x(binmargin) - 5)
                    .attr("width",x(bin_size -2 *binmargin) + 10)
                tip.show(d);
            } ,
            "mouseout": function(d,i){
                tip.hide(d);
                d3.select(this)
                    .attr("y",parseInt(d3.select(this).attr("y")) + 15)
                    .attr("height",parseInt(d3.select(this).attr("height")) - 15)
                    .attr("x",x(binmargin))
                    .attr("width",x(bin_size -2 *binmargin))

            } ,
                "click":  function(d,i) {
            tip.hide(d);
            get_pie_chart(data,histogram_data,field);
          },
            })

        // add the x axis and x-label
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
            // .selectAll("text")
            // .style("text-anchor", "end")
   //   .attr("dx", "-.8em")
   //   .attr("dy", ".15em")
   //   .attr("transform", "rotate(0)");

    if(field == 'num_students')
        x_text = 'Number of Students'
    else if(field == 'international')
        x_text = 'International Score'
    else if(field == 'research')
        x_text = 'Research Score'
    else if(field == 'income')
        x_text = 'Industry Income'
    else
        x_text = 'Student-Staff Ratio'

    svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text(x_text);

    // add the y axis and y-label
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(yAxis);

    svg.append("text")
        .attr("class", "ylabel")
        .attr("y", 0 - (margin.left)) // x and y switched due to rotation
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Number of Universities");
}

// functions to get pie charts
function get_pie_chart(data,histogram_data,field)
{
    var margin = {top: 10, right: 40, bottom: 30, left:40},
    width = 500;
    height = 500 ;

    var color = d3.scale.category20();

    document.getElementById('histogram').innerHTML = "";

    var radius = (Math.min(width, height)) / 2;

    var arc = d3.svg.arc()
            .outerRadius(radius - 10)
        .innerRadius(0);

    var extended_arc = d3.svg.arc()
             .outerRadius(radius+10)
             .innerRadius(0)

    var labelArc = d3.svg.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

    var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.numfill; });

    var tip = d3.tip()
          .attr('class', 'd3-tip')
              .offset([-10, 0])
          .html(function(d) {
                return "<strong> Number of universities :</strong> <span style='color:red'>" + d.data.numfill + "</span>";
            })
    var svg = d3.select("#histogram").append("svg")
            .attr("width", width+50)
            .attr("height", height+50)
            .append("g")
            .attr("transform", "translate(290, 250)");
//            .attr("transform", "translate(" + width/2  + "," + height/2 + ")");

    svg.call(tip);

    var g = svg.selectAll(".arc")
            .data(pie(histogram_data))
        .enter().append("g")
            .attr("class", "arc")
        .on({
                "click":  function(d,i) {
            tip.hide(d);
            binning_the_data(data,field,15);
            },
               });

    g.append("path")
            .attr("d", arc)
            .style("fill", function(d,i) { return color(i); })
        .on({
                "mouseover": function(d,i) {
                d3.select(this).transition()
                .attr("d",extended_arc)
                tip.show(d);
            },
                "mouseout":  function(d,i) {
                tip.hide(d);
                d3.select(this).transition()
                .attr("d",arc)
                },
               });


    g.append("text")
            .attr("transform", function(d,i) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) {
            return d.data.numfill==0?"":d.data.range; });

    function type(d) {
        d.numfill = +d.numfill;
        return d;
    }
}