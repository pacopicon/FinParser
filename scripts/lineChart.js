$(document).ready(function(){


// $(document).ready(function(){
  $("button").click(function(){
      $(this).hide(2000);
  });
// });

// Public Variables

  security =  'MMM',
  timeScales = {'1D':1, '1W':8, '1M':32, '3M':94, '6M':187, '1Y':366, '2Y':731},
  timeScale = 1,
  TEXT = ['MMM','3M Company', 'Industrials'],
  NUMERIC = [new Date, 0, 0, 0, 0, 0, 0],
  data = [0,0,0,0,0],
  GRAPHIC = { "Meta Data":{},"Time Series (Daily)":{} }

// form select code:

// function renderOptions(options) {
//     var selection = []
//     if (Array.isArray(options)) { // Does var options refer to array of Securities info objects or to Object of timeScale / modifier  key-values?
//       selection = function(opt, i) jQuery set HTML Func { '<option key={i} value={[opt['Symbol'], opt.Name, opt.Sector]}>{opt.Name}</option>' }
//     } else {
//       var options = Object.keys(options) // options begins as object here.  need to make it into array
//       selection = function(opt, i) jQuery set HTML Func {'<option key={i} value={opt}>{opt}</option>'}
//     }
//     return options.map(selection)
//   }




  $.each(securities, function(index) {
  		// console.log(securities[index].Name)   
     	$('#securitySelection')
         .append($("<option></option>")
                    .attr("value", securities[index].Symbol)
                    .text(securities[index].Name));  
	});

	$.each(timeScales, function(key, value) {
  	   
     $('#timeSelection')
         .append($("<option></option>")
                    .attr("value", value)
                    .text(key)); 
	});

	var orderOfOps = 'neitherHasGone'

	function printSecSel() {
		$('#selectedSecurityValue').text($('#securitySelection > option:selected').val())

		sec = $('option:selected').val()
		time =  $('#timeSelection > option:selected').val()

		console.log('time = ' + time + ', sec = ' + sec)

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

		sec = $('option:selected').val()
		 time =  $('#timeSelection > option:selected').val()

		console.log('time = ' + time + ', sec = ' + sec)



		if (orderOfOps === 'printTimeSelWentFirst' || orderOfOps === 'neitherHasGone') {
			orderOfOps = 'printTimeSelWentFirst'
			printSecSel()
		} else {
			orderOfOps = 'neitherHasGone'
		}
	}


	
	$('#securitySelection').click(function() {
		printSecSel()
	})
	

	$('#timeSelection').click(function() {
		printTimeSel()
	})	
	

	


  

 function handleSymbolSelection(event, timeScale) {
    var string = event.target.value
    var securityArray = string.split(',')
    console.log('handleSymbolSelection ("symbol") securityArray[0] = ' + securityArray[0]);
    this.setState({
      TEXT: securityArray,
      timeScale: timeScale
    }, function onceStateIsUpdated() {
      this.callDatePriceAPI()
    })
  }

  function handleTimeScaleSelection(event) {
    const { TEXT, timeScales } = this.state
    var modifier = timeScales[event.target.value]
    console.log("handleTimeScaleSelection modifier = ", modifier);
    console.log("typeof modifier = ", typeof modifier);
    // this.changeChartParams(security, modifier)
    this.setState({
      TEXT: TEXT,
      timeScale: modifier
    }, function onceStateIsUpdated() {
      this.callDatePriceAPI()
    })
  }

// d3 line chart code:


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
// d3.csv("data.csv", function(error, data) {
//   data.forEach(function(d) {
//     d.date = parseDate(d.date);
//     d.close = +d.close;
//   }); 

//   // Scale the range of the data
//   xScale.domain(d3.extent(datePrice, function(d) { return d.date }))
// 	yScale.domain(d3.extent(datePrice, function(d) { return d.price }))

//   // Add the valueline path.
//   svg.append("path")
//     .attr("class", "line")
//     .attr("d", valueline(data));

//   // Add the X Axis
//   svg.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis);

//   // Add the Y Axis
//   svg.append("g")
//     .attr("class", "y axis")
//     .call(yAxis);

// });

// ** Update data section (Called from the onclick)
function updateData() {

	console.log(api)

  // Get the data again
  d3.csv("data-alt.csv", function(error, data) {
   	data.forEach(function(d) {
    	d.date = parseDate(d.date);
    	d.close = +d.close;
    });

  	// Scale the range of the data again 
  	x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    // Make the changes
    svg.select(".line")   // change the line
        .duration(750)
        .attr("d", valueline(data));
    svg.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
    svg.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);

  });
}

});