export function capitalizeWords (str) {
    return str.replace(/\b\w/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
}

export function replaceSpecialChars (str) {
    const specialChars = {
        'á': 'a',
        'é': 'e',
        'í': 'i',
        'ó': 'o',
        'ú': 'u',
        'ñ': 'n',
        // add more special characters and their replacements here
    };

    return str.replace(/[^\w\s]/gi, function (char) {
        return specialChars[char] || char;
    });
}