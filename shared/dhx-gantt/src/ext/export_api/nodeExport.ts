import export_api from './index'

// This module only runs in a Node.js context (the `dhtmlxgantt.node` build),
// where `require` and `Buffer` are globals. @types/node is not a dependency, so
// declare the minimal surface used here to keep declaration emit clean.
declare const require: (id: string) => any
declare const Buffer: { concat(list: any[]): any }

export default function (gantt: any) {
  gantt.ext.export_api = export_api(gantt)

  const nodeExportFunctions = {
    _getTransport(url: string): { module: { request: any }; defaultPort: number } {
      const protocol = url.split('://')[0]
      let module
      let defaultPort
      switch (protocol) {
        case 'https':
          // eslint-disable-next-line @typescript-eslint/no-require-imports -- node export path intentionally uses CommonJS require to lazy-load node built-ins.
          module = require('https')
          defaultPort = 443
          break
        case 'http':
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          module = require('http')
          defaultPort = 80
          break
        default:
          throw new Error(`Unsupported protocol: ${protocol}, url: ${url}`)
      }
      return {
        module,
        defaultPort,
      }
    },

    _pdfExportRouter(config, type) {
      gantt.ext.export_api._prepareConfigPDF(config, type)
      config.version = gantt.version
      gantt.ext.export_api._sendToExport(config, type)
    },

    exportToExcel(config) {
      config = config || {}

      config = gantt.mixin(config, {
        name: 'gantt.xlsx',
        title: 'Tasks',
        data: null,
        columns: gantt.ext.export_api._serializeGrid({ rawDates: true }),
        version: gantt.version,
      })

      gantt.ext.export_api._sendToExport(config, 'excel')
    },

    importFromExcel(config) {
      gantt.ext.export_api._processFormData(config, 'excel')
    },

    importFromMSProject(config) {
      gantt.ext.export_api._processFormData(config)
    },

    _processFormData(config, type) {
      // tslint:disable-next-line no-implicit-dependencies
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const formDataInstance = require('form-data')

      const url = config.server || gantt.ext.export_api._apiUrl
      const network = gantt.ext.export_api._getTransport(url)

      const { hostname, port, path } = gantt.ext.export_api._parseURL(url, network)

      const options = {
        hostname,
        port,
        path,
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      }

      const formData = new formDataInstance()
      if (type === 'excel') {
        formData.append('file', config.data)
        formData.append('type', 'excel-parse')
        formData.append(
          'data',
          JSON.stringify({
            sheet: config.sheet || 0,
          }),
        )
      } else {
        const settings = {
          durationUnit: config.durationUnit || undefined,
          projectProperties: config.projectProperties || undefined,
          taskProperties: config.taskProperties || undefined,
        }

        formData.append('file', config.data)
        formData.append('type', config.type || 'msproject-parse')
        formData.append('data', JSON.stringify(settings), options)
      }

      options.headers['Content-Type'] = formData.getHeaders()['content-type']

      const req = network.module.request(options, function (res) {
        let resData = ''
        res.on('data', function (d) {
          resData += d
        })
        res.on('end', function (d) {
          config.callback(resData.toString())
        })
      })

      req.on('error', function (error) {
        console.error(error)
      })
      formData.pipe(req)
    },

    _sendPostRequest(url, pack, cb) {
      const network = gantt.ext.export_api._getTransport(url)

      const { hostname, port, path } = gantt.ext.export_api._parseURL(url, network)

      const options = {
        hostname,
        port,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': JSON.stringify(pack).length,
        },
      }

      const req = network.module.request(options, function (res) {
        const resData = []
        res.on('data', function (d) {
          resData.push(d)
        })
        res.on('end', function (d) {
          cb(Buffer.concat(resData))
        })
      })

      req.on('error', function (error) {
        console.error(error)
      })

      req.write(JSON.stringify(pack))
      req.end()
    },

    _parseURL(url, network) {
      const parts1 = url.split('://')[1]
      const parts2 = parts1.split('/')[0].split(':')
      const parts3 = parts1.split('/')

      const hostname = parts2[0]
      const port = parts2[1] || network.defaultPort
      const path = '/' + parts3.slice(1).join('/')

      return { hostname, port, path }
    },

    _sendToExport(data, type) {
      const convert = gantt.date.date_to_str(gantt.config.date_format || gantt.config.xml_date)
      if (data.config) {
        data.config = gantt.copy(gantt.ext.export_api._serializableGanttConfig(data.config))
        gantt.ext.export_api._markColumns(data, type)

        if (data.config.start_date && data.config.end_date) {
          if (data.config.start_date instanceof Date) {
            data.config.start_date = convert(data.config.start_date)
          }
          if (data.config.end_date instanceof Date) {
            data.config.end_date = convert(data.config.end_date)
          }
        }
      }

      const url = data.server || gantt.ext.export_api._apiUrl
      const pack = {
        type,
        store: 0,
        data: JSON.stringify(data),
      }
      const callbackFunction =
        data.callback ||
        function (response) {
          console.log(response)
        }

      return gantt.ext.export_api._sendPostRequest(url, pack, callbackFunction)
    },
  }

  gantt.mixin(gantt.ext.export_api, nodeExportFunctions, true)

  gantt.exportToExcel = gantt.ext.export_api.exportToExcel
  gantt.importFromExcel = gantt.ext.export_api.importFromExcel
  gantt.importFromMSProject = gantt.ext.export_api.importFromMSProject
}
