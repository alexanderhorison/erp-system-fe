const isValidEmail = email => {
  // Simple regex for email validation
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

module.exports = {
  isValidEmail
}
