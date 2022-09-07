import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
//import CustomEditor from 'ckeditor5-custom-build'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CustomUploadImage from '../../Util/Edtior/FileUpload'
import { deltaToMarkdown } from 'quill-delta-to-markdown'
import './editor.css'

import { convertToHTML } from '../../Util/util'

const isDelta = (source) => source.includes('"ops')
const isBadDelta = (source) =>
  source.includes('</p>') && source.includes('"ops')

const adjustDefaultValue = (source) => {
  let _source = source

  if (isBadDelta(_source)) {
    _source = _source.replace('<p>', '')
    _source = _source.replace('</p>', '')
  }

  if (isDelta(_source)) {
    const { ops } = JSON.parse(_source)
    _source = deltaToMarkdown(ops)
  }

  const output = convertToHTML(_source) //markdown to HTML
  return output
}
  

const editorConfiguration = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'link',
    'bulletedList',
    'numberedList',
    'todoList',
    'blockQuote',
    '|',
    'code',
    'codeBlock',
    'undo',
    'redo',
    'removeFormat',
  ],
  extraPlugins: [CustomUploadImage],
}

const Editor = (props, ref) => {
  const { getDataFromEditor, value, height } = props

  if (value === null) {
    value = ''
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      config={editorConfiguration}
      data={adjustDefaultValue(value)}
      onReady={(editor) => {
        editor.setData(adjustDefaultValue(value) || '')
        // console.log(
        //   CustomEditor.builtinPlugins.map((plugin) => plugin.pluginName)
        // )
        // You can store the "editor" and use when it is needed.
        // console.log('Editor is ready to use!', editor)
        if (height && editor) {
          editor.editing.view.change((writer) => {
            writer.setStyle(
              'height',
              height,
              editor.editing.view.document.getRoot()
            )
          })
        }
      }}
      onChange={(event, editor) => {
        const data = editor.getData()
        getDataFromEditor(data)
      }}
      onBlur={(event, editor) => {
        // console.log('Blur.', editor)
      }}
      onFocus={(event, editor) => {
        // console.log('Focus.', editor)
      }}
    />
  )
}

export default Editor
