export default class DateComparator {
  protected _gantt: any

  constructor(gantt) {
    this._gantt = gantt
  }

  public isEqual(dateA: Date, dateB: Date, task: ITask): boolean {
    return !this._gantt._hasDuration(dateA, dateB, task)
  }

  public isFirstSmaller(small: Date, big: Date, task: ITask): boolean {
    if (small.valueOf() < big.valueOf() && !this.isEqual(small, big, task)) {
      return true
    }
    return false
  }

  public isSmallerOrDefault(smallDate: Date, bigDate: Date, task: ITask): boolean {
    return !!(!smallDate || this.isFirstSmaller(smallDate, bigDate, task))
  }

  public isGreaterOrDefault(smallDate: Date, bigDate: Date, task: ITask): boolean {
    return !!(!smallDate || this.isFirstSmaller(bigDate, smallDate, task))
  }
}
