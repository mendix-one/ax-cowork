import { makeAutoObservable } from 'mobx'

export type LeftTool = 'project' | 'commit' | 'todo'
export type RightTool = 'ai' | 'database' | 'docs'

export class MainStore {
  projectName = 'ax-cowork'
  branch = 'main'
  filePath = 'front-end/src/pages/main/views/MainPage.tsx'
  metaInfo = 'TS 5.7.3 · UTF-8 · LF · Ln 1, Col 1'
  notificationCount = 3

  leftTool: LeftTool | null = 'project'
  rightTool: RightTool | null = 'ai'

  constructor() {
    makeAutoObservable(this)
  }

  selectLeftTool = (tool: LeftTool) => {
    this.leftTool = this.leftTool === tool ? null : tool
  }

  selectRightTool = (tool: RightTool) => {
    this.rightTool = this.rightTool === tool ? null : tool
  }
}
