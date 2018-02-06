// fetch function

function callDatePriceAPI(timeScale, security) {
  if (timeScale == 1) {
    var http = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + security +'&interval=1min&outputsize=full&apikey=5JSEEXSISXT9VKNO'
  } else {
    var http = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + security + '&outputsize=full&apikey=5JSEEXSISXT9VKNO'
  }

  fetch(http)
  .then(function(response) {
    return response.json()
    console.log('callDatePriceAPI fired. timeScale =' + timeScale + 'security = ' + security + '. http = ' + http);
  })
  .then(function(json) {
    console.log('callDatePriceAPI json parsing SUCCEEDED!!!')

    // API IntraDay can be imperfect, and some minutes are left out, need to check that previous trading day time isn't included
    function checkIntraday(dateArray, priceArray) {
      var newDateArray = []
      var newPriceArray = []
      for (var i=0; i<dateArray.length; i++) {
        var zStr = dateArray[0]
        var zDay = zStr.charAt(8) + zStr.charAt(9)
        var iStr = dateArray[i]
        var iDay = iStr.charAt(8) + iStr.charAt(9)
        if (iDay == zDay) {
          newDateArray.push(dateArray[i])
          newPriceArray.push(priceArray[i])
        }
      }
      // var lastStr = dateArray[dateArray.length-1]
      // var lastDay = lastStr.charAt(8) + lastStr.charAt(9)
      // console.log(`last in dateArray = ${lastDay}`);
      console.log('are date and price arrays of equal length? The answer is = ' + newDateArray.length == newPriceArray.length);
      var newArrays = {
        dateArr: newDateArray,
        priceArr: newPriceArray
      }
      return newArrays
    }
    function unpack(str) {
      var month = Number(str.charAt(5) + str.charAt(6))
      var day = Number(str.charAt(8) + str.charAt(9))
      var year = Number(str.charAt(0) + str.charAt(1) + str.charAt(2) + str.charAt(3))
      var dateInfo = {
        year: year,
        month: month - 1,
        day: day,
        date: new Date(year, month-1, day, 0, 0, 0, 0)
      }
      return dateInfo
    }

    function checkDate(dateArray, priceArray, timeScale) {
      var newDateArray = []
      var newPriceArray = []
      var z = unpack(dateArray[0])
      var pastLimit = new Date(z.year, z.month, z.day-timeScale, 0, 0, 0, 0)
      for (var i=0; i<dateArray.length; i++) {
        var iDate = unpack(dateArray[i]).date
        if (pastLimit <= iDate) {
          newDateArray.push(dateArray[i])
          newPriceArray.push(priceArray[i])
        }
      }
      console.log('newDateArray.length = ' + newDateArray.length + '.  newPriceArray.length = ' + newPriceArray.length);
      var newArrays = {
        dateArr: newDateArray,
        priceArr: newPriceArray
      }
      return newArrays
    }

    var dates = timeScale == 1 ? json['Time Series (1min)'] : json['Time Series (Daily)']
    var priceArray = exposePrices(dates)
    var dateArray = Object.keys(dates)

    if (timeScale == 1) {
      var f = checkIntraday(dateArray, priceArray) // f = filtered
      var timeString = '%Y-%m-%d %H:%M:%S'
    } else {
      var f = checkDate(dateArray, priceArray, timeScale) // f = filtered
      var timeString = '%Y-%m-%d'
    }
    var dataScope = f.dateArr.length
    var dateArray = f.dateArr
    var priceArray = f.priceArr

    console.log('stock symbol = ' + json['Meta Data']["2. Symbol"])

    // console.log(`dates = ${dates}.  priceArray = ${priceArray}`);
    // Object.values(dates).map(value=>console.log("value: ", value))
    // var dataScope = timeScale == 1 ? 390 : timeScale
    // var last = dataScope - 1
    var parseTime = d3.timeParse(timeString)

    // ************ // Make sure to add d3. to d3.timeParse and to timeFormat
    // Then update the d3 v3 code in app.js to d3 v4 (look at top-trader)

    var datePrice = []
    var lowHigh = []
    var volArr = []
    function parseData(dateArray, priceArray, i) {
      const dyad = {
        date: parseTime(dateArray[i]),
        price: Number(priceArray[i][3])
      }
      // console.log("Number(priceArray[mainIndex][3]) = ", Number(priceArray[mainIndex][3]));
      datePrice.push(dyad)
      return datePrice
    }

    console.log("datePrice = ", datePrice);

    for (var i=0; i<dataScope; i++) {
      parseData(dateArray, priceArray, i)
      lowHigh.push(Number(priceArray[i][1]))
      lowHigh.push(Number(priceArray[i][2]))
      volArr.push(Number(priceArray[i][4]))
    }
    console.log('dataScope (datePrice.length) = ' + datePrice.length)
    console.log('lowHigh.length = ' + lowHigh.length)
    console.log('volArr.length = ] ' + volArr.length)

    var date = parseTime(dateArray[0])
    var formatTime = d3.timeFormat("%b %d, %Y at %I:%M:%S %p")
    var formattedDate = formatTime(date)
    var dateStr = formattedDate.toString()
    var alert = parseTime(formattedDate) < new Date ? 'market is closed' : 'up to date'
    lowHigh.sort(function(a,b) {a - b})
    var highest = lowHigh[lowHigh.length-1]
    var lowest = lowHigh[0]
    function getSum(total,num) {total + num}
    var totalVol = volArr.reduce(getSum)

    console.log(`highest = ${highest}. lowest = ${lowest}`  );

    var latestData = {
      date: dateStr,
      open: Number(priceArray[datePrice.length-1][0]),
      high: highest,
      low: lowest,
      close: Number(priceArray[0][3]),
      // volume: Number(priceArray[0][4]),
      totalVol: totalVol,
      alert: alert
    }

    var data = [
      Number(priceArray[datePrice.length-1][0]), highest, lowest, Number(priceArray[0][3]), totalVol ]

    var output = {
	    datePrice: datePrice,
	    hiLoDataOBJ: latestData,
	    hiLoDataARRAY: data
  	}

  	return output

  })
  .catch(error => {
    console.log('callDatePriceAPI json parsing failed: ', error)
    var timeString = '%Y-%m-%d'
    var formatTime = d3.timeFormat(timeString)
    var dateArray = [formatTime(new Date), formatTime(new Date)]
    var dataScope = dateArray.length
    var parseTime = d3.timeParse(timeString)
    var datePrice = []

    function parseData(dateArray, mainIndex) {

      const dyad = {
        date: parseTime(dateArray[mainIndex]),
        price: 0
      }
      datePrice.push(dyad)
      return datePrice
    }

    for (var i=0; i<dataScope; i++) {
      parseData(dateArray, i)
    }

    var dateString = (new Date).toString()

      var latestData = {
        date: dateString,
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volume: 0,
        nowDate: 'market is closed'
      }
   
     var output = {
	    datePrice: { "Meta Data":{},"Time Series (Daily)":{} },
      hiLoDataOBJ: latestData,
      hiLoDataARRAY: [0,0,0,0,0]
  	}

  	return output
 
  })
}


// recursive fn designed to expose prices

function exposePrices(obj) {
  var result = [];
  for (var prop in obj) {
    var value = obj[prop];
    if (typeof value === 'object') {
      result.push(this.exposePrices(value)) // <- recursive call
    } else {
      result.push(value);
    }
  }
  return result;
}