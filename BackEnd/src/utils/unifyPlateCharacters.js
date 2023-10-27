// Remove caracteres especiais e qualquer caractere de espaço
function unifyPlateCharacters(str) {
    return str.replace(/[\s-"“.._]/g, '');
}

module.exports = unifyPlateCharacters;