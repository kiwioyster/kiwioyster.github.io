const SECONDS_IN_A_DAY = 86400000;
const QUARTERLY_GDP_ARRAY = {
    _value: [],
    getAll: () => {
        return QUARTERLY_GDP_ARRAY._value;
    },
    set: (newArray) => {
        QUARTERLY_GDP_ARRAY._value = newArray;
    },
    append: (val) => {
        QUARTERLY_GDP_ARRAY._value.push(val);
    },
    get: (date) => {
        return QUARTERLY_GDP_ARRAY._value.find(d => {
            return d.DATE === date
        })
    }
};