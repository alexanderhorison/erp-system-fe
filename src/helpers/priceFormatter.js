const priceFormat = value => {
  if (!value) {
    return ''
  }
  const numberFormatter = new Intl.NumberFormat('en-US')

  return numberFormatter.format(value)
}

module.exports = {
  priceFormat
}
