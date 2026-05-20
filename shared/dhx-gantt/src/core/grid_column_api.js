import Grid from './ui/grid/grid'
import gridColumnApiGPL from './grid_column_api.gpl'

export default function (gantt) {
  gridColumnApiGPL(gantt)
  Grid.prototype.getGridColumns = function () {
    var config = this.$getConfig()
    var columns = config.columns,
      visibleColumns = []

    for (var i = 0; i < columns.length; i++) {
      if (!columns[i].hide) visibleColumns.push(columns[i])
    }

    return visibleColumns
  }
}
