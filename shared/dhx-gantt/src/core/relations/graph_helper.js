import * as helpers from '../../utils/helpers'

export default function () {
  return {
    getVertices: function (relations) {
      var ids = {}
      var rel
      for (var i = 0, len = relations.length; i < len; i++) {
        rel = relations[i]
        ids[rel.target] = rel.target
        ids[rel.source] = rel.source
      }

      var vertices = []
      var id
      for (var i in ids) {
        id = ids[i]
        vertices.push(id)
      }

      return vertices
    },
    topologicalSort: function (edges) {
      var vertices = this.getVertices(edges)
      var hash = {}

      for (var i = 0, len = vertices.length; i < len; i++) {
        hash[vertices[i]] = { id: vertices[i], $source: [], $target: [], $incoming: 0 }
      }

      for (var i = 0, len = edges.length; i < len; i++) {
        var successor = hash[edges[i].target]
        successor.$target.push(i)
        successor.$incoming = successor.$target.length
        hash[edges[i].source].$source.push(i)
      }

      // topological sort, Kahn's algorithm
      var S = vertices.filter(function (v) {
        return !hash[v].$incoming
      })

      var L = []

      while (S.length) {
        var n = S.pop()

        L.push(n)

        var node = hash[n]

        for (var i = 0; i < node.$source.length; i++) {
          var m = hash[edges[node.$source[i]].target]
          m.$incoming--
          if (!m.$incoming) {
            S.push(m.id)
          }
        }
      }

      return L
    },
    groupAdjacentEdges: function (edges) {
      var res = {}
      var edge
      for (var i = 0, len = edges.length; i < len; i++) {
        edge = edges[i]
        if (!res[edge.source]) {
          res[edge.source] = []
        }
        res[edge.source].push(edge)
      }
      return res
    },
    tarjanStronglyConnectedComponents: function (vertices, edges) {
      //https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm
      // iterative implementation
      var verticesHash = {}
      var stack = []
      var edgesFromTasks = this.groupAdjacentEdges(edges)
      var recurse = false
      var connectedComponents = []

      for (var i = 0; i < vertices.length; i++) {
        var root = getVertex(vertices[i])
        if (root.visited) continue
        var workStack = [root]
        var index = 0
        while (workStack.length) {
          var v = workStack.pop()

          if (!v.visited) {
            v.index = index
            v.lowLink = index
            index++
            stack.push(v)
            v.onStack = true
            v.visited = true
          }
          recurse = false
          var edges = edgesFromTasks[v.id] || []
          for (var e = 0; e < edges.length; e++) {
            var w = getVertex(edges[e].target)
            w.edge = edges[e]
            if (w.index === undefined) {
              workStack.push(v)
              workStack.push(w)
              recurse = true
              break
            } else if (w.onStack) {
              v.lowLink = Math.min(v.lowLink, w.index)
            }
          }
          if (recurse) continue

          if (v.index == v.lowLink) {
            var com = { tasks: [], links: [], linkKeys: [] }
            while (true) {
              w = stack.pop()
              w.onStack = false
              com.tasks.push(w.id)
              if (w.edge) {
                com.links.push(w.edge.id)
                com.linkKeys.push(w.edge.hashSum)
              }
              if (w == v) {
                break
              }
            }

            connectedComponents.push(com)
          }
          if (workStack.length) {
            w = v
            v = workStack[workStack.length - 1]
            v.lowLink = Math.min(v.lowLink, w.lowLink)
          }
        }
      }

      return connectedComponents

      function getVertex(id) {
        if (!verticesHash[id]) {
          verticesHash[id] = { id: id, onStack: false, index: undefined, lowLink: undefined, edge: undefined }
        }

        return verticesHash[id]
      }
    },

    findLoops: function (relations) {
      var cycles = []

      helpers.forEach(relations, function (rel) {
        if (rel.target == rel.source) cycles.push({ tasks: [rel.source], links: [rel.id] })
      })

      var vertices = this.getVertices(relations)

      var connectedComponents = this.tarjanStronglyConnectedComponents(vertices, relations)
      helpers.forEach(connectedComponents, function (component) {
        if (component.tasks.length > 1) {
          cycles.push(component) //{ tasks: [task ids], links: [links ids]}
        }
      })

      return cycles
      //{task:id, link:link.type, lag: link.lag || 0, source: link.source}
    },
  }
}
