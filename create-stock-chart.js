var StockChart = {

    populate: function (rawDbData) {
        console.log(StockChart._getFormattedData(rawDbData));
        var d = new Date();
        var ms = d.getTime();
        var data = StockChart._getFormattedData(rawDbData);
        Highcharts.stockChart('chartContainer', {

            title: {
                text: 'AAPL stock price by minute'
            },

            rangeSelector: {
                buttons: [{
                    type: 'hour',
                    count: 1,
                    text: '1h'
                }, {
                    type: 'day',
                    count: 1,
                    text: '1D'
                }, {
                    type: 'all',
                    count: 1,
                    text: 'All'
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
        var date = new Date();
        var ms = date.getTime();
        var formattedDays = days.map(d => {
            return [ms + 86400000 * d.day, d.open, d.high, d.low, d.close];
        })
        return formattedDays;
    }
}