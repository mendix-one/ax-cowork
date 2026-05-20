import * as utils from '../utils/utils'
import constants from '../constants'
import ExtensionManager from '../ext/extension_manager'

import services from '../core/common/services'
import config from '../core/common/config'
import ajax from '../core/common/ajax'
import date from '../core/common/date'
import { remoteEvents } from '../core/remote/remote_events'

import DnD from '../core/common/dnd'
import templates from '../core/common/templates'
import eventable from '../utils/eventable'

import StateService from '../core/common/state'

import Promise from '../utils/promise'
import env from '../utils/env'
import datastoreHooks from '../core/datastore/datastore_hooks'
import DataProcessor from '../core/dataprocessor'

import plugins from '../core/plugins'

import grid_column_api from '../core/grid_column_api'
import tasks from '../core/tasks'
import parsing from '../core/loading/parsing'
import work_time from '../core/worktime/work_time'
import data from '../core/data'

import void_script_second from '../publish_helpers/void_script_second'

import data_task_types from '../core/data_task_types'
import cached_functions from '../core/cached_functions'

import gantt_core from '../core/gantt_core'
import destructor from '../core/destructor'
import void_script_third from '../publish_helpers/void_script_third'

import i18nFactory from '../locale'

function DHXGantt() {
  this.constants = constants
  this.version = VERSION
  this.license = LICENSE
  this.templates = {}
  this.ext = {}
  this.keys = {
    edit_save: this.constants.KEY_CODES.ENTER,
    edit_cancel: this.constants.KEY_CODES.ESC,
  }
}

export default function (supportedExtensions) {
  // use a named constructor to make gantt instance discoverable in heap snapshots
  var gantt = new DHXGantt()

  var extensionManager = new ExtensionManager(supportedExtensions)
  var activePlugins = {}
  gantt.plugins = function (config) {
    for (var i in config) {
      if (config[i] && !activePlugins[i]) {
        var plugin = extensionManager.getExtension(i)
        if (plugin) {
          plugin(gantt)
          activePlugins[i] = true
        }
      }
    }
    return activePlugins
  }

  gantt.$services = services()
  gantt.config = config()
  gantt.ajax = ajax(gantt)
  gantt.date = date(gantt)
  gantt.RemoteEvents = remoteEvents

  var dnd = DnD(gantt)
  gantt.$services.setService('dnd', function () {
    return dnd
  })

  var templatesLoader = templates(gantt)
  gantt.$services.setService('templateLoader', function () {
    return templatesLoader
  })

  eventable(gantt)

  var stateService = new StateService()

  stateService.registerProvider('global', function () {
    var res = {
      min_date: gantt._min_date,
      max_date: gantt._max_date,
      selected_task: null,
    }

    // do not throw error if getState called from non-initialized gantt
    if (gantt.$data && gantt.$data.tasksStore) {
      res.selected_task = gantt.$data.tasksStore.getSelectedId()
    }
    return res
  })
  gantt.getState = stateService.getState
  gantt.$services.setService('state', function () {
    return stateService
  })

  utils.mixin(gantt, utils)

  gantt.Promise = Promise
  gantt.env = env

  datastoreHooks(gantt)

  gantt.dataProcessor = DataProcessor.DEPRECATED_api
  gantt.createDataProcessor = DataProcessor.createDataProcessor

  plugins(gantt)

  grid_column_api(gantt)
  tasks(gantt)
  parsing(gantt)
  work_time(gantt)
  data(gantt)

  void_script_second(gantt)

  data_task_types(gantt)
  cached_functions(gantt)

  gantt_core(gantt)
  destructor(gantt)
  void_script_third(gantt)

  var i18n = i18nFactory()
  gantt.i18n = {
    addLocale: i18n.addLocale,
    setLocale: function (locale) {
      if (typeof locale === 'string') {
        var localeObject = i18n.getLocale(locale)
        if (!localeObject) {
          localeObject = i18n.getLocale('en')
        }

        gantt.locale = localeObject
      } else if (locale) {
        if (!gantt.locale) {
          gantt.locale = locale
        } else {
          for (var i in locale) {
            if (locale[i] && typeof locale[i] === 'object') {
              if (!gantt.locale[i]) {
                gantt.locale[i] = {}
              }

              gantt.mixin(gantt.locale[i], locale[i], true)
            } else {
              gantt.locale[i] = locale[i]
            }
          }
        }
      }
      const labels = gantt.locale.labels
      labels.gantt_save_btn = labels.gantt_save_btn || labels.icon_save
      labels.gantt_cancel_btn = labels.gantt_cancel_btn || labels.icon_cancel
      labels.gantt_delete_btn = labels.gantt_delete_btn || labels.icon_delete
    },
    getLocale: i18n.getLocale,
  }
  gantt.i18n.setLocale('en')
  return gantt
}
