export const utils = {

    validateSIMCode: function(val) {
        if (val.startsWith('07') || val.startsWith('08') || val.startsWith('09')) {
            return '+0'
        } else if (val.startsWith('7') || val.startsWith('8') || val.startsWith('9')) {
            return '-0'
        } 
    },

    validateLength: function(val) {
        if (this.validateSIMCode(val) === '+0' && val.length === 11) {
            return val;
        } else if (this.validateSIMCode(val) === '-0' && val.length === 10) {
            return val;
        } else if (this.validateSIMCode(val) === '-0' && val.length === 11) {
            return 0;
        } 
    },

    sanitizeMe: function(item) {
        var punctuationless = item.match(/[.,\/|'"?><``\\@#!$%\^&\*;:{}=\-_`~()]/gi);
        if (punctuationless) return { exeption: punctuationless.toString() }
    }

}








