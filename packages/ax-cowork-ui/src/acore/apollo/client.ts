import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

// Apollo Client wired to the BE gateway's SSO upstream. The gateway forwards `/app/sso/graphql`
// to ax-sso-services /graphql, attaching `ax-axios-key` + a freshly minted Bearer token on the
// way out. The browser only needs to send its session cookie (`credentials: 'include'`) so the
// gateway middleware can read it and mint the upstream token.
const GRAPHQL_URI = (import.meta.env.VITE_GRAPHQL_URL as string | undefined) ?? '/app/sso/graphql'

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_URI,
    // Send the BE session cookie so the gateway can mint an upstream-scoped token.
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
  // Network-first by default — profile data is per-session and we want fresh values when
  // the account modal re-opens after a state-changing action (signin, role grant, etc.).
  defaultOptions: {
    query: { fetchPolicy: 'network-only' },
    watchQuery: { fetchPolicy: 'network-only' },
  },
})
