/**
 * @license Copyright (c) 2014-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat'
import Autolink from '@ckeditor/ckeditor5-link/src/autolink'
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave.js'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder.js'
import CKFinderUploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter.js'
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices'
import Code from '@ckeditor/ckeditor5-basic-styles/src/code'
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock.js'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js'
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js'
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily.js'
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight.js'
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js'
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload'
import Indent from '@ckeditor/ckeditor5-indent/src/indent'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import Link from '@ckeditor/ckeditor5-link/src/link'
import List from '@ckeditor/ckeditor5-list/src/list'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed'
import MediaEmbedToolbar from '@ckeditor/ckeditor5-media-embed/src/mediaembedtoolbar'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat.js'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation'
import TodoList from '@ckeditor/ckeditor5-list/src/todolist'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount.js'

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
  AutoImage,
  Autoformat,
  Autolink,
  Autosave,
  BlockQuote,
  Bold,
  CKFinder,
  CKFinderUploadAdapter,
  CloudServices,
  Code,
  CodeBlock,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageInsert,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Italic,
  Link,
  List,
  MediaEmbed,
  MediaEmbedToolbar,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  Table,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  WordCount,
]

export default Editor
