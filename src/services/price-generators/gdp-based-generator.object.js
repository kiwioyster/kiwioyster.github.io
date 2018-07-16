const GdpBasedGenerator = {

    _createRandomDay: (initialPrice, gdp) => {
        // This function should generate randomized price movement 24 times through out
        // the day. Movement is skewed towards the forward GDP value. Then this movement is 
        // formatted into the candle stick data format and returned.
        var price = initialPrice;
        var openPrice = price;
        var highestPriceToday = price;
        var lowestPriceToday = price;
        for (var h = 0; h < 24; h++) {
            var rand = Math.random();
            if (rand < 0.499) {
                price = price * (1 - 0.003 * Math.random() + gdp / 24);
            } else {
                price = price * (1 + 0.003 * Math.random() + gdp / 24);
            }
            price > highestPriceToday ? highestPriceToday = price : null;
            price < lowestPriceToday ? lowestPriceToday = price : null;
        }
        var closePrice = price;
        return {
            day: null,
            open: openPrice,
            high: highestPriceToday,
            low: lowestPriceToday,
            close: closePrice
        };
    },

    generatePrices: (initialPrice, days, dayOffset = 0) => {
        var prices = [];
        var openPrice = initialPrice;
        for (var d = dayOffset; d < days + dayOffset; d++) {
            var dailyGdpGrowth = GdpBasedGenerator._getForwardGdpGrowth(d);
            var price = GdpBasedGenerator._createRandomDay(openPrice, dailyGdpGrowth);
            openPrice = price.close * (1 - 0.008 * Math.random() + 0.008 * Math.random());;
            price.day = d;
            prices.push(price);
        }
        return prices;
    },

    _getForwardGdpGrowth: (day) => {
        var date = new Date(day * SECONDS_IN_A_DAY);
        var nextQuarterDate = GdpBasedGenerator._getNextQuarterDate(date);
        var gdp = QUARTERLY_GDP_ARRAY.get(formatDate(nextQuarterDate));
        return (gdp.GDPGROWTH / 365 / 100);
    },

    _getNextQuarterDate: (d) => {
        var month = d.getMonth();
        var nextQuarter = Math.floor(month / 3) * 3 + 3;
        var yearIncrement = 0;
        if (nextQuarter === 12) {
            nextQuarter = 0;
            yearIncrement = 1;
        }

        return new Date(d.getFullYear() + yearIncrement, nextQuarter, 1);
    },

    _gaussian: (mean, stdev) => {
        var y2;
        var use_last = false;
        return function () {
            var y1;
            if (use_last) {
                y1 = y2;
                use_last = false;
            } else {
                var x1, x2, w;
                do {
                    x1 = 2.0 * Math.random() - 1.0;
                    x2 = 2.0 * Math.random() - 1.0;
                    w = x1 * x1 + x2 * x2;
                } while (w >= 1.0);
                w = Math.sqrt((-2.0 * Math.log(w)) / w);
                y1 = x1 * w;
                y2 = x2 * w;
                use_last = true;
            }

            var retval = mean + stdev * y1;
            if (retval > 0)
                return retval;
            return -retval;
        }
    },
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}