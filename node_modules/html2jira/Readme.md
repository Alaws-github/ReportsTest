# html2jira

  A simple HTML to Jira markdown class.  This was created as part of an effort to put a web front end on a process that 
  will create Jira Epics on the back end.  As part of that, the web front end uses CKEditor to allow for the user to put
  in rich text information.  After failing to find anything usable on the npm registry, I decided to write my own.
  Currently it only support the following tags:
  - Paragraph `<p>`
  - Image `<img>`
  - Bold `<b> <strong>`
  - Italics `<i>`
  - Underline `<u>`
  - Lists (order and unordered) `<ul> <ol>` (nested)
  - Line Breaks `<br>`
  - Horizonal Line `<hr>`
  - Headings `<h1>, <h2>, ...`
  - Links to external sites `<a href="...">some text</a>`
  - (not yet) Simple non-nested Tables `<table><tr><th></th></tr><tr><td></td></tr><table>`

## Installation

`npm install --save html2jira`

## Example

```js
let { HTML2Jira } = require("HTML2Jira")
const html = '<h1>hello</h1><p>this is my page </p><ol><li>first item</li><li>second item</li></ol>'
let converter = new HTML2Jira()
let res = converter.toJira(html)
```

## publish updated to NPM
- npm run prepublish
- npm login
- npm version patch
- npm publish

## Contributors

- Kenn Roberson
