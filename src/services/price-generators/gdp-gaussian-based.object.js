class GdpGaussianGenerator {
    constructor(initialPrice, days, dayOffset = 0) {
        this.price = this._generatePrices(initialPrice, days, dayOffset);
    }

    _createRandomDay(initialPrice, volatility, gdp) {
        var price = initialPrice;
        var openPrice = price;
        var highestPriceToday = price;
        var lowestPriceToday = price;
        var hourlyVol = volatility / Math.sqrt(18 * 365);
        for (var h = 0; h < 12; h++) {
            price = price * this._gaussian(1 + gdp / 3, hourlyVol)();
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
    }

    _getNewVolatility(volArray, priceArray, highestClose) {
        var newVol;
        const prices = [...priceArray];
        const vol = [...volArray];

        prices.splice(0, 0, priceArray[0]);
        prices.splice(0, 0, priceArray[0]);
        prices.splice(0, 0, priceArray[0]);
        vol.splice(0, 0, volArray[0]);

        const lastPrice = prices.length - 1;
        const lastVol = vol.length - 1;
        const modifier = (prices[lastPrice].close - prices[lastPrice].close / 1.07) / (highestClose - prices[lastPrice].close / 1.07);

        var priceChange = prices[lastPrice].close / prices[lastPrice - 1].close - 1;
        var prevPriceChange = prices[lastPrice - 1].close / prices[lastPrice - 2].close - 1;
        var prevPrevPriceChange = prices[lastPrice - 2].close / prices[lastPrice - 3].close - 1;

        if (priceChange >= 0) {
            const delta = (1 - 1 / (Math.pow(700 * priceChange + Math.abs(60 * prevPriceChange), 1.5) + 1)) * ((vol[lastVol] - 0.5 * vol[lastVol - 1] - 0.04));
            newVol = this._gaussian(vol[lastVol] - modifier * delta, 0.002)();
        } else {
            const mean = -1.3 * priceChange - 0.35 * prevPriceChange - 0.2 * prevPrevPriceChange;
            newVol = vol[lastVol] + this._gaussian(mean, 0.002)();
        }
        if (newVol > 1.2) {
            newVol = 0.8;
        }
        return newVol;
    }

    _generatePrices(initialPrice, days, dayOffset) {
        var prices = [];
        var volatility = [0.1];
        var highestClose = 0;
        var openPrice = initialPrice;
        for (var d = dayOffset; d < days + dayOffset; d++) {
            const vol = volatility[d - dayOffset];
            const dailyGdpGrowth = this._getForwardGdpGrowth(d);

            const price = this._createRandomDay(openPrice, vol, dailyGdpGrowth);
            price.day = d;
            price.vol = vol;
            price.highestClose = highestClose;
            prices.push(price);
            if (price.close > highestClose) {
                highestClose = price.close;
            }

            const newVol = this._getNewVolatility(volatility, prices, highestClose);
            volatility.push(newVol);
            openPrice = price.close * this._gaussian(1, newVol / Math.sqrt(6 * 365))();

        }
        return prices;
    }

    _getForwardGdpGrowth(day) {
        var date = new Date(day * SECONDS_IN_A_DAY);
        var nextQuarterDate = this._getNextQuarterDate(date);
        var gdp = QUARTERLY_GDP_ARRAY.get(this._formatDate(nextQuarterDate));
        if (gdp) {
            return (gdp.GDPGROWTH / 365 / 100);
        } else {
            return 0.00005;
        }
    }

    _getNextQuarterDate(d) {
        var month = d.getMonth();
        var nextQuarter = Math.floor(month / 3) * 3 + 3;
        var yearIncrement = 0;
        if (nextQuarter === 12) {
            nextQuarter = 0;
            yearIncrement = 1;
        }

        return new Date(d.getFullYear() + yearIncrement, nextQuarter, 1);
    }

    _gaussian(mean, stdev) {
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
    }

    _formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
}