const environtmentColor = () => {
  return process.env.NEXT_PUBLIC_ENVIRONTMENT == 'development' ? '#1976D2' : '#6F4E37'
}

module.exports = { environtmentColor }
