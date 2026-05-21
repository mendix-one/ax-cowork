interface IFormatterTransfer {
  toMinutes: (value: number) => number
  fromMinutes: (value: number) => number
}

export default class DurationFormatter implements IDurationFormatter {
  static create = (settings: IDurationFormatterConfig = null): IDurationFormatter => {
    return new DurationFormatter(settings)
  }
  protected transferUnits: { [unit: string]: IFormatterTransfer }
  protected _config: IDurationFormatterConfig
  constructor(settings: IDurationFormatterConfig = null) {
    this._config = this._defaultSettings(settings)
    this.transferUnits = {
      minute: {
        toMinutes: (value: number) => {
          return value
        },
        fromMinutes: (value: number) => {
          return value
        },
      },
      hour: {
        toMinutes: (value: number) => {
          return value * this._config.minutesPerHour
        },
        fromMinutes: (value: number) => {
          return value / this._config.minutesPerHour
        },
      },
      day: {
        toMinutes: (value: number) => {
          return value * this._config.minutesPerHour * this._config.hoursPerDay
        },
        fromMinutes: (value: number) => {
          return value / (this._config.minutesPerHour * this._config.hoursPerDay)
        },
      },
      week: {
        toMinutes: (value: number) => {
          return value * this._config.minutesPerHour * this._config.hoursPerWeek
        },
        fromMinutes: (value: number) => {
          return value / (this._config.minutesPerHour * this._config.hoursPerWeek)
        },
      },
      month: {
        toMinutes: (value: number) => {
          return value * this._config.minutesPerHour * this._config.hoursPerDay * this._config.daysPerMonth
        },
        fromMinutes: (value: number) => {
          return value / (this._config.minutesPerHour * this._config.hoursPerDay * this._config.daysPerMonth)
        },
      },
      year: {
        toMinutes: (value: number) => {
          return value * this._config.minutesPerHour * this._config.hoursPerDay * this._config.daysPerYear
        },
        fromMinutes: (value: number) => {
          return value / (this._config.minutesPerHour * this._config.hoursPerDay * this._config.daysPerYear)
        },
      },
    }
  }

  canParse = (value: string): boolean => {
    let units = ''
    // create all possible unit names
    const labels = this._config.labels
    for (const labelName in labels) {
      const label = labels[labelName]
      units += `${label.full}|${label.plural}|${label.short}|`
    }
    const reg = new RegExp(`^([+-]? *[0-9.]{1,}\\s*(${units})\\s*)*$`) // model looks like: 4h 20 minute
    return reg.test((value || '').trim())
  }

  format = (value: number): string => {
    const durationUnit = this._config.store
    const formatUnits = this._config.format
    const useShortLabels = this._config.short

    let totalMinutes = this.transferUnits[durationUnit].toMinutes(value)

    let units = formatUnits
    if (units && units === 'auto') {
      units = this._selectFormatForValue(totalMinutes)
    }
    if (!units) {
      units = 'day'
    }

    if (formatUnits === 'auto' && !value) {
      return ''
    }
    units = Array.isArray(units) ? units : [units]
    let result = ''
    const last = units.length - 1
    for (let i = 0; i < units.length; i++) {
      const unit = units[i]
      const countedValue = this._getValueFromMinutes(totalMinutes, unit, i === last)
      totalMinutes -= this._getValueInMinutes(countedValue, unit)

      result += `${this._getLabelForConvert(countedValue, unit, useShortLabels)}${i === last ? '' : ' '}`
    }
    return result
  }

  parse = (value: string): number => {
    if (this.canParse(value)) {
      value = (value || '').trim()
      let part = ''
      let isPartReady = false
      let needToParse = false
      let result = 0
      const last = value.length - 1
      const isNumber = /^[+\-0-9. ]$/ // numbers and .;

      for (let i = 0; i < value.length; i++) {
        const symbol = value[i]
        if (isNumber.test(symbol)) {
          // found the next number. can parse the part of value
          needToParse = isPartReady
        } else {
          // the number is over. letters in turn. find the next number to get whole unit name
          isPartReady = true
        }

        // parse the part of number or the resulting part, if the last element
        if (needToParse || last === i) {
          // add the last symbol to the part if the last element
          if (!needToParse) {
            part += symbol
          }

          // parse the part to minutes
          result += this._getNumericValue(part)
          isPartReady = needToParse = false
          part = ''
        }
        part += symbol
      }
      if (result) {
        const durationUnit = this._config.store
        return Math.round(this.transferUnits[durationUnit].fromMinutes(Math.ceil(result)))
      }
    }
    return null
  }

  protected _defaultSettings(settings: IDurationFormatterConfig = null) {
    const preparedSettings: IDurationFormatterConfig = {
      enter: 'day',
      store: 'hour',
      format: 'auto',
      short: false,
      minutesPerHour: 60,
      hoursPerDay: 8,
      hoursPerWeek: 40,
      daysPerMonth: 30,
      daysPerYear: 365,
      labels: {
        minute: {
          full: 'minute',
          plural: 'minutes',
          short: 'min',
        },
        hour: {
          full: 'hour',
          plural: 'hours',
          short: 'h',
        },
        day: {
          full: 'day',
          plural: 'days',
          short: 'd',
        },
        week: {
          full: 'week',
          plural: 'weeks',
          short: 'wk',
        },
        month: {
          full: 'month',
          plural: 'months',
          short: 'mon',
        },
        year: {
          full: 'year',
          plural: 'years',
          short: 'y',
        },
      },
    }
    if (settings) {
      for (const i in settings) {
        if (settings[i] !== undefined && i !== 'labels') {
          preparedSettings[i] = settings[i]
        }
      }
      if (settings.labels) {
        for (const i in settings.labels) {
          preparedSettings.labels[i] = settings.labels[i]
        }
      }
    }

    return preparedSettings
  }

  protected _selectFormatForValue(value: number): string {
    const units = ['year', 'month', 'day', 'hour', 'minute']
    const values = []
    for (let i = 0; i < units.length; i++) {
      values[i] = Math.abs(this.transferUnits[units[i]].fromMinutes(value))
    }

    for (let i = 0; i < values.length; i++) {
      const valueInUnit = values[i]
      if (valueInUnit < 1 && i < values.length - 1) {
        continue
      } else {
        return units[i]
      }
    }

    return 'day'
  }

  protected _getNumericValue(value: string): number {
    const numericValue = parseFloat(value.replace(/ /g, '')) || 0
    const lettersValue = value.match(/\p{L}/gu) ? value.match(/\p{L}/gu).join('') : ''
    const unitName = this._getUnitName(lettersValue) // leave only letters

    if (!numericValue || !unitName) {
      return 0
    }

    return this._getValueInMinutes(numericValue, unitName)
  }

  protected _getValueInMinutes = (value: number, unit: string) => {
    if (this.transferUnits[unit] && this.transferUnits[unit].toMinutes) {
      return this.transferUnits[unit].toMinutes(value)
    }
    return 0
  }

  protected _getLabelForConvert = (value: number, unit: string, short: boolean): string => {
    const labels = this._config.labels
    const label = labels[unit]
    if (short) {
      return `${value}${label.short}`
    }
    const plural = value !== 1 && value !== -1
    return `${value} ${plural ? label.plural : label.full}`
  }

  protected _getValueFromMinutes = (value: number, unit: string, last: boolean): number => {
    if (this.transferUnits[unit] && this.transferUnits[unit].fromMinutes) {
      const result = this.transferUnits[unit].fromMinutes(value)

      if (last) {
        return parseFloat(result.toFixed(2))
      }
      return parseInt(result.toString(), 10)
    }
    return null
  }

  protected _isUnitName = (unit: any, value: string): boolean => {
    value = value.toLowerCase()
    return unit.full.toLowerCase() === value || unit.plural.toLowerCase() === value || unit.short.toLowerCase() === value
  }

  protected _getUnitName = (value: string): string => {
    const labels = this._config.labels
    let labelName: string
    let isUnit = false
    for (labelName in labels) {
      if (this._isUnitName(labels[labelName], value)) {
        isUnit = true
        break
      }
    }
    if (isUnit) {
      return labelName
    }
    return this._config.enter
  }
}
