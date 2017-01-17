
/**
  Converts the graphql ASTs to a dynamo friendly projection
*/
export const dynamoProjection = (fieldASTs) => {
  console.log(fieldASTs.selectionSet.selections)
  return fieldASTs.selectionSet.selections
}