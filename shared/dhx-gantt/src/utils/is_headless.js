import env from './env'

export default function (gantt) {
  return env.isNode || !gantt.$root
}
