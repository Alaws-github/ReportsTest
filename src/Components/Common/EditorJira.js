import React, { useEffect } from 'react'
import { Editor, EditorContext, WithEditorActions } from '@atlaskit/editor-core'
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer'
import '@atlaskit/css-reset'

const EditorJira = ({ document, getActions }) => {
  const EditorComponent = ({ actions }) => {
    useEffect(() => {
      getActions(actions)
    }, [])
    return (
      <>
        <Editor
          defaultValue={document}
          appearance="chromeless"
          disabled={true}
          allowRule={true}
          allowTables={true}
          allowPanel={true}
          allowDynamicTextSizing={true}
          textFormatting={true}
          media={{
            allowMediaSingle: true,
          }}
          contentTransformerProvider={(schema) =>
            new MarkdownTransformer(schema)
          }
        />
      </>
    )
  }

  return (
    <EditorContext>
      <WithEditorActions
        render={(actions) => <EditorComponent actions={actions} />}
      />
    </EditorContext>
  )
}

export default EditorJira
