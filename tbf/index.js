import { defaultFieldResolver } from 'graphql'

/**
 * Resolve generation function that allows a pre and post promise
 * wrapping chain to be fun. This allows semantic separation of
 * processes like validation and permissions prior to running the
 * primary resolve function
 */
const resolver = (pre = [], resolve = Promise.resolve, post = []) => ({
  resolve: (root, args, context, info) =>
    // run the pre resolve promise chain
    pChain(pre, prefn => prefn(root, args, context, info))
      .then(() => {
        // run the primary resolve
        return resolve(root, args, context, info)
          .then(result => {
            // As the desired graphql result has already been calculated
            // we don't want to put the post processes into the graphql
            // pipeline. Instead the post chain is ran asynchronously to the
            // server return
            pChain(post, postfn => postfn(root, args, context, info))
            return result
          })
      })
})

/**
 * convenience function for resolving fields with graphql default
 */
const fieldResolver = (pre, resolve = defaultFieldResolver, post = []) =>
  resolver(pre, resolve, post)



export {
  resolver,
  fieldResolver,
  or
}
