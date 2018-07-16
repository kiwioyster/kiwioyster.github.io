const GaussianBasedGenerator = {

    _createRandomDay: (initialPrice, volatility) => {
        var price = initialPrice;
        var openPrice = price;
        var highestPriceToday = price;
        var lowestPriceToday = price;
        var hourlyVol = volatility / Math.sqrt(12 * 365);
        for (var h = 0; h < 12; h++) {
            price = price * GaussianBasedGenerator._gaussian(1.00002, hourlyVol)();
            price > highestPriceToday ? highestPriceToday = price : null;
            price < lowestPriceToday ? lowestPriceToday = price : null;
        }
        var closePrice = price;
        return {
            day: null,
            open: openPrice,
            high: highestPriceToday,
            low: lowestPriceToday,
            close: closePrice,
            vol: null,
            highestClose: 0,
        };
    },

    _getNewVolatility: (volArray, priceArray, highestClose) => {
        var newVol;
        const prices = [...priceArray];
        const vol = [...volArray];

        prices.splice(0, 0, priceArray[0]);
        prices.splice(0, 0, priceArray[0]);
        prices.splice(0, 0, priceArray[0]);
        vol.splice(0, 0, volArray[0]);

        const lastPrice = prices.length - 1;
        const lastVol = vol.length - 1;
        const modifier = (prices[lastPrice].close - prices[lastPrice].close / 1.1) / (highestClose - prices[lastPrice].close / 1.1);

        priceChange = prices[lastPrice].close / prices[lastPrice - 1].close - 1;
        prevPriceChange = prices[lastPrice - 1].close / prices[lastPrice - 2].close - 1;
        prevPrevPriceChange = prices[lastPrice - 2].close / prices[lastPrice - 3].close - 1;

        if (priceChange >= 0) {
            const delta = (1 - 1 / (Math.pow(300 * priceChange + Math.abs(30 * prevPriceChange), 1.5) + 1)) * ((vol[lastVol] - 0.5 * vol[lastVol - 1] - 0.04));
            newVol = GaussianBasedGenerator._gaussian(vol[lastVol] - modifier * delta, 0.002)();
        } else {
            const mean = -1.25 * priceChange - 0.35 * prevPriceChange - 0.2 * prevPrevPriceChange;
            newVol = vol[lastVol] + GaussianBasedGenerator._gaussian(mean, 0.002)();
        }
        if (newVol > 1.5) {
            newVol = 1;
        }
        return newVol;
    },

    generatePrices: (initialPrice, days, dayOffset = 0) => {
        var prices = [];
        var volatility = [0.1];
        var highestClose = 0;
        var openPrice = initialPrice;
        for (var d = dayOffset; d < days + dayOffset; d++) {
            const vol = volatility[d - dayOffset];

            const price = GaussianBasedGenerator._createRandomDay(openPrice, vol);
            price.day = d;
            price.vol = vol;
            price.highestClose = highestClose;
            prices.push(price);
            if (price.close > highestClose) {
                highestClose = price.close;
            }

            const newVol = GaussianBasedGenerator._getNewVolatility(volatility, prices, highestClose);
            volatility.push(newVol);
            openPrice = price.close * GaussianBasedGenerator._gaussian(1, newVol / Math.sqrt(6 * 365))();

        }
        return prices;
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