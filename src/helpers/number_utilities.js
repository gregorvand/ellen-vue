function padNumber(num, len = 2) {
  return `${num}`.padStart(len, '0')
}

module.exports = { padNumber: padNumber }
