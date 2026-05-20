import * as DataProcessor from './data_processor'
export default {
  DEPRECATED_api: function (server) {
    return new DataProcessor.DataProcessor(server)
  },
  createDataProcessor: DataProcessor.createDataProcessor,
}
