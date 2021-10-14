const categories = [
  'Shopify',
  'Apparel Manufacturing',
  'Apparel Retail',
  'Beverages Non-Alcoholic',
  'Beverages—Wineries & Distilleries',
  'Consumer Electronics',
  'Consumer Packaged Goods',
  'Footwear & Accessories',
  'Furnishings, Fixtures & Appliances',
  'Home Improvement Retail',
  'Household & Personal Products',
  'Internet Retail',
  'Luxury Goods',
  'Manufacturing Apparel & Furniture',
  'Packaged Foods',
  'Retail Apparel & Specialty',
  'Specialty Retail',
  'Textile Manufacturing',
]

// Generates object for Elastic search enabling multiple filter queries to be recogised
// in an 'OR' way
function generateSearchFilters(list) {
  let filterTerms = []
  list.forEach((element) => {
    filterTerms.push({
      match: {
        companyIndustry: element,
      },
    })
  })

  return filterTerms
}

export const ELLEN_SEARCH_CATEGORIES = generateSearchFilters(categories)
