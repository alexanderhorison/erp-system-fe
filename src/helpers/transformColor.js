const transformColor = color => {
  let returnColor
  switch (color) {
    case 'PENDING':
      returnColor = 'info'
      break

    default:
      returnColor = 'success'
      break
  }
  return returnColor
}

module.exports = {
  transformColor
}
