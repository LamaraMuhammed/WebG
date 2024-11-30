
function sanitizeMe(item) {

    const hasPunctuation = /[.,\/|'"?><``\\+@#!$%\^&\*;:{}=\_`~()]/gi;
    const hasSpace = /\s{1,}/g;
    const requiredQuant = 9;
    const requiredCharLookUp = '-';
    var punctuationless = hasPunctuation.test(item);
    var spaceLess = hasSpace.test(item);
    
    if (!punctuationless) {
        
        if (item.includes(requiredCharLookUp) && item.indexOf(requiredCharLookUp) === 3 || 
            item.includes(requiredCharLookUp) && item.indexOf(requiredCharLookUp) === 5) {
            
            if (item.length === requiredQuant && !spaceLess) {
                return {status: 'valid'}
    
            } else {
                return {status: 'invalid'}
    
            }

        } else {
            return {status: 'invalid'}

        }

    } else {
        return {status: 'invalid'}

    }

}

module.exports = {
    sanitizeMe
}