// importing securities from securitiesinfo.js
// 

$(document).ready(function(){


// Public Variables

  var security,
  timeScales = {'1D':1, '1W':8, '1M':32, '3M':94, '6M':187, '1Y':366, '2Y':731},
  timeScale
  // TEXT = ['MMM','3M Company', 'Industrials'],
  // NUMERIC = [new Date, 0, 0, 0, 0, 0, 0],
  // data = [0,0,0,0,0],
  // GRAPHIC = { "Meta Data":{},"Time Series (Daily)":{} }


// Variables for printSecSel(), printTimeSel(), and callDatePriceAPI()
	var orderOfOps = 'neitherHasGone'

// printSecSel() -> 
	function printSecSel() {
		$('#selectedSecurityValue').text($('#securitySelection > option:selected').val())

		security = $('option:selected').val()
		timeScale =  $('#timeSelection > option:selected').val()

		console.log('timeScale = ' + timeScale + ', security = ' + security)

		if (orderOfOps === 'printSecSelWentFirst' || orderOfOps === 'neitherHasGone') {
			orderOfOps = 'printSecSelWentFirst'
			printTimeSel()
		} else {
			orderOfOps = 'neitherHasGone'
		}

		console.log(orderOfOps)
	}

	function printTimeSel() {
		$('#selectedTimeValue').text($('#timeSelection > option:selected').val())

		security = $('option:selected').val()
		timeScale =  $('#timeSelection > option:selected').val()

		console.log('timeScale = ' + timeScale + ', security = ' + security)

		if (orderOfOps === 'printTimeSelWentFirst' || orderOfOps === 'neitherHasGone') {
			orderOfOps = 'printTimeSelWentFirst'
			printSecSel()
		} else {
			orderOfOps = 'neitherHasGone'
		}
	}


	///////////////////////// Functions called by DOM //////////////////////////


	// Securities select
  $.each(securities, function(index) {
  		// console.log(securities[index].Name)   
     	$('#securitySelection')
         .append($("<option></option>")
                    .attr("value", securities[index].Symbol)
                    .text(securities[index].Name));  
	});

// TimeScale select
	$.each(timeScales, function(key, value) {
  	   
     $('#timeSelection')
         .append($("<option></option>")
                    .attr("value", value)
                    .text(key)); 
	});

// Callback activated by security select
	$('#securitySelection').change(function() {
		printSecSel()
		callDatePriceAPI(timeScale, security)
	})

// Callback activated by time select
	$('#timeSelection').change(function() {
		printTimeSel()
		callDatePriceAPI(timeScale, security).then(
			function () {
				paintChart(output)
			})
	})	  


//            __   ______                                   __           
//           |  \ /      \                                 |  \          
//       ____| $$|  $$$$$$\        _______   ______    ____| $$  ______  
//      /      $$ \$$__| $$       /       \ /      \  /      $$ /      \ 
//     |  $$$$$$$  |     $$      |  $$$$$$$|  $$$$$$\|  $$$$$$$|  $$$$$$\
//     | $$  | $$ __\$$$$$\      | $$      | $$  | $$| $$  | $$| $$    $$
//     | $$__| $$|  \__| $$      | $$_____ | $$__/ $$| $$__| $$| $$$$$$$$
//      \$$    $$ \$$    $$       \$$     \ \$$    $$ \$$    $$ \$$     \
//       \$$$$$$$  \$$$$$$         \$$$$$$$  \$$$$$$   \$$$$$$$  \$$$$$$$


// Public variables
var datePrice,
		hiLoDataOBJ,
		hiLoDataARRAY


// Set the dimensions of the canvas / graph
var margin = {top: 20, right: 20, bottom: 80, left: 50},
  width = 960 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom

// Set the ranges
const xScale = d3.scaleTime().rangeRound([0, width])
const yScale = d3.scaleLinear().rangeRound([height, 0])

//////////////////////////// change datePrice to GRAPHIC /////////////////////////////

// Define the axes
var xAxis = d3.axisBottom().scale(xScale).ticks(20).tickSize(-height)
var yAxis = d3.axisLeft().scale(yScale).ticks(10).tickSize(-width)

// Define the line
const lineGenerator = d3.line()
  .x(function(d) { return xScale(d.date) })
  .y(function(d) { return yScale(d.price) })

    
// Adds the svg canvas
var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


/////////////////////////////////////////////////////////////////////////////////

// 1. change d3.csv("data.csv", function(error, data) into the callDatePriceAPI(timeScale, TEXT)  function
// 2. Switch the rest of the code into d3 v.4 
// 3. function flow: (a) user selects timeScale and TEXT from Dropdown (b) When user hits submit, callDatePriceAPI is activated and it returns data that is to be displayed graphically and textually.

/////////////////////////////////////////////////////////////////////////////////

// Get the data

function paintChart(output) {
	datePrice = output.datePrice

		console.log(datePrice)


  // datePrice.forEach(function(d) {
  //   d.date = parseDate(d.date);
  //   d.close = +d.close;
  // }); 

  // Scale the range of the datePrice
  xScale.domain(d3.extent(datePrice, function(d) { return d.date }))
	yScale.domain(d3.extent(datePrice, function(d) { return d.price }))

  // Add the lineGenerator path.
  // svg.append("path")
  //   .attr("class", "line")
  //   .attr("d", lineGenerator(datePrice));

  svg.append("path")
  .data([datePrice])
  .attr("class", "line")
  .attr("d", lineGenerator);

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

}

		

	






// ** Update datePrice section (Called from the onclick)
// function updateData() {

	// var output = {
	//     datePrice: datePrice,
	//     hiLoDataOBJ: latestData,
	//     hiLoDataARRAY: data
 //  	}

  

   // 	datePrice.forEach(function(d) {
   //  	d.date = parseDate(d.date);
   //  	d.close = +d.close;
   //  })

  	// // Scale the range of the datePrice again 
  	// x.domain(d3.extent(datePrice, function(d) { return d.date; }));
   //  y.domain([0, d3.max(datePrice, function(d) { return d.close; })]);

   //  // Select the section we want to apply our changes to
   //  var svg = d3.select("body").transition();

   //  // Make the changes
   //  svg.select(".line")   // change the line
   //      .duration(750)
   //      .attr("d", lineGenerator(datePrice));
   //  svg.select(".x.axis") // change the x axis
   //      .duration(750)
   //      .call(xAxis);
   //  svg.select(".y.axis") // change the y axis
   //      .duration(750)
   //      .call(yAxis);


})