// Utilities for constructing and returning 'Date Identifier' which is how a given
// dataset is identified across Ellen
// Using MMDDYYYY format, we default to the 1st day of a given month to set the identifier
// The full ID format is therefore as follows:
// [companyID][MM][01][YYYY]

const dayjs = require('dayjs')

function assignDateIdentifier(companyID, date) {
  return `${companyID}${date.format(process.env.VUE_APP_DATASET_DATE_FORMAT)}`
}

function constructDateIdentifier(companyID, month, year) {
  let fullDate = dayjs().set('date', 1).set('month', month).set('year', year)
  return assignDateIdentifier(companyID, fullDate)
}

const mergeById = (a1, a2) =>
  a1.map((a1Item) => ({
    ...a2.find(
      (a2Item) => a2Item.id === a1Item.default_payment_method && a2Item
    ),
    ...a1Item,
  }))

module.exports = {
  assignDateIdentifier: assignDateIdentifier,
  constructDateIdentifier: constructDateIdentifier,
  mergeById: mergeById,
}
