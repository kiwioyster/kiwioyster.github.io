const SimpleStockPriceGenerator = {

    _createRandomDay: (initialPrice) => {
        // This function should generate randomized price movement 24 times through out
        // the day. 50/50 on whether it moves up or down. Then this movement is 
        // formatted into the candle stick data format and returned.
        var price = initialPrice;
        var openPrice = price;
        var highestPriceToday = price;
        var lowestPriceToday = price;
        for (var h = 0; h < 24; h++) {
            var rand = Math.random();
            if (rand < 0.5) {
                price = price * (1 - 0.005 * Math.random());
            } else {
                price = price * (1 + 0.005 * Math.random());
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
            var price = SimpleStockPriceGenerator._createRandomDay(openPrice);
            openPrice = price.close * (1 - 0.01 * Math.random() + 0.01 * Math.random());;
            price.day = d;
            prices.push(price);
        }
        return prices;
    }
}