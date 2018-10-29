var StockComponent = {
    chart: '',

    btnClick: (company) => {
        StockComponent.chart = company;
        switch (company) {
            case 'ONE':
                companyOne.createChart('chartContainer');
                break;
            case 'TWM':
                companyTwo.createChart('chartContainer');
                break;
            case 'TRIF':
                companyThree.createChart('chartContainer');
                break;
        }
    },

    toggleLogAxis: () => {
        switch (StockComponent.chart) {
            case 'ONE':
                companyOne.createLogChart('chartContainer');
                break;
            case 'TWM':
                companyTwo.createLogChart('chartContainer');
                break;
            case 'TRIF':
                companyThree.createLogChart('chartContainer');
                break;
        }
    }
};