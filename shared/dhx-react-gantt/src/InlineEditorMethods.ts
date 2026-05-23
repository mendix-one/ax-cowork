export interface InlineEditorMethods {
  getValue: () => any
  setValue?: (value: any) => void
  isValid?: () => boolean
  focus?: () => void
  isChanged?: (originalValue: any) => boolean
  save?: () => void // used if map_to:"auto"
}
