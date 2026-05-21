export class LoopsFinder {
  private _linksBuilder: any
  private _graphHelper: any
  private _gantt: any
  constructor(gantt: any, graphHelper: any, linksBuilder: any) {
    this._linksBuilder = linksBuilder
    this._graphHelper = graphHelper
    this._gantt = gantt
  }
  isCircularLink = (link: ILink): boolean => {
    return !!this.getLoopContainingLink(link)
  }

  getLoopContainingLink = (link: ILink): any => {
    const graphHelper = this._graphHelper
    const linksBuilder = this._linksBuilder
    const gantt = this._gantt

    let allRelations = linksBuilder.getLinkedTasks()
    if (!gantt.isLinkExists(link.id)) {
      allRelations = allRelations.concat(gantt._formatLink(link))
    }

    const cycles = graphHelper.findLoops(allRelations)

    const found = false
    for (let i = 0; i < cycles.length && !found; i++) {
      const links = cycles[i].links
      for (let j = 0; j < links.length; j++) {
        // tslint:disable-next-line triple-equals
        if (links[j] == link.id) {
          return cycles[i]
        }
      }
    }
    return null
  }

  findCycles = () => {
    const graphHelper = this._graphHelper
    const linksBuilder = this._linksBuilder

    const allRelations = linksBuilder.getLinkedTasks()
    return graphHelper.findLoops(allRelations)
  }
}
