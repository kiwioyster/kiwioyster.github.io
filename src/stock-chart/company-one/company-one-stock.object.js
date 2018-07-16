const CompanyOneStock = {

    populate: function (rawDbData) {
        var data = CompanyOneStock._getFormattedData(rawDbData);
        Highcharts.stockChart('companyOneChartContainer', {

            title: {
                text: 'AAPL stock price by minute'
            },

            rangeSelector: {
                buttons: [{
                    type: 'month',
                    count: 3,
                    text: '3m'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1y'
                }, {
                    type: 'year',
                    count: 10,
                    text: '10y'
                }],
                selected: 1,
                inputEnabled: false
            },

            series: [{
                name: 'AAPL',
                type: 'candlestick',
                data: data,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    },

    _getFormattedData: function (days) {
        // var date = new Date();
        // var ms = date.getTime();
        var formattedDays = days.map(d => {
            return [SECONDS_IN_A_DAY * d.day, d.open, d.high, d.low, d.close];
        })
        return formattedDays;
    }
}