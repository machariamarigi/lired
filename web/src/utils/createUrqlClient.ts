import { dedupExchange, Exchange, fetchExchange, stringifyVariables } from "urql"
import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { tap, pipe } from 'wonka';
import Router from 'next/router';
import { LoginMutation, MeQuery, MeDocument, RegisterMutation, LogoutMutation } from "../generated/graphql"
import { betterUpdateQuery } from './betterUpdateQuery';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if(error?.message.includes("not authenticated")) {
        Router.replace('/login')
      }
    })
  )
}

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info
    const allFields = cache.inspectFields(entityKey)
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName)

    const size = fieldInfos.length
    if (size === 0) {
      return undefined
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`

    const isItInCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    )
    info.partial = !isItInCache

    let hasMore = true
    const results: string[] = []

    fieldInfos.forEach( fieldInfo => {
      const key = cache.resolveFieldByKey(entityKey, fieldInfo.fieldKey) as string
      const data = cache.resolve(key, "posts") as string[]
      const _hasMore = cache.resolve(key, "hasMore")

      if (!_hasMore) {
        hasMore = _hasMore as boolean
      }

      results.push(...data)
    })

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results
    }
  }
}

export const createUrqlClient = (ssrExchange: any) => ({
    url: process.env.NEXT_PUBLIC_GRAPHQL_SERVER as string,
    exchanges: [
      dedupExchange,
      cacheExchange({
        resolvers: {
          keys: {
            PaginatedPosts: () => null
          },
          Query: {
            posts: cursorPagination()
          }
        },
        updates: {
          Mutation: {
            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query
                  } else {
                    return {
                      me: result.login.user
                    }
                  }
                }
              )
            },
            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query
                  } else {
                    return {
                      me: result.register.user
                    }
                  }
                }
              )
            },
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              )
            },
            createPost: (_result, args, cache, info) => {
              const allFields = cache.inspectFields('Query')
              const fieldInfos = allFields.filter(
                info => info.fieldName === 'posts'
              )

              fieldInfos.forEach((fi) => {
                cache.invalidate('Query', 'posts', fi.arguments || {})
              })
              
            }
          }
        }
      }),
      errorExchange,
      ssrExchange,
      fetchExchange
    ],
    fetchOptions: {
      credentials: 'include' as const
    }
})
