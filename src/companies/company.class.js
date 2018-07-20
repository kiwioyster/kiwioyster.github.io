class Company {
    constructor(companyName, ticker) {
        this.stockPricesData = [];
        this.companyName = companyName;
        this.ticker = ticker;
    }

    set stockPrice(d) {
        this.stockPricesData = d;
    }

    set newStockPrice(d) {
        this.stockPrice.append(d);
    }

    createChart(chartContainerName) {
        var data = this._getFormattedData(this.stockPricesData);
        Highcharts.stockChart(chartContainerName, {

            title: {
                text: `${this.companyName} Stock Prices`
            },

            rangeSelector: {
                buttons: [{
                    type: 'month',
                    count: 18,
                    text: '18m'
                }, {
                    type: 'year',
                    count: 5,
                    text: '5y'
                }, {
                    type: 'year',
                    count: 20,
                    text: '20y'
                }],
                selected: 1,
                inputEnabled: false
            },

            series: [{
                name: this.ticker,
                type: 'candlestick',
                data: data,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    }

    _getFormattedData(days) {
        // var date = new Date();
        // var ms = date.getTime();
        var formattedDays = days.map(d => {
            return [SECONDS_IN_A_DAY * d.day, d.open, d.high, d.low, d.close];
        })
        return formattedDays;
    }
}