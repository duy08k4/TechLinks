const base64URL = (input) => {
    return btoa(input).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

module.exports = { base64URL }
