// Deixa as iniciais das palavras em maiúsculo
function capitalizeFirstLetter(str) {
    return str.toLowerCase().replace(/(^|\s)\S/g, (match) => match.toUpperCase());
}

module.exports = capitalizeFirstLetter;