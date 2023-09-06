import { curry, defaultTo } from 'ramda'

const DEFAULT_REGION = process.env.REACT_APP_REGION
const orDefaultRegion = defaultTo(DEFAULT_REGION)
const createClientForRegion = curry(
  (region, ClientConstructor) =>
    new ClientConstructor({ region: orDefaultRegion(region) })
)
const createClientForDefaultRegion = createClientForRegion(null)

export {
  DEFAULT_REGION,
  createClientForDefaultRegion,
  createClientForRegion,
  orDefaultRegion,
}