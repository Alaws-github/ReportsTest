/* eslint-disable class-methods-use-this */
const parser = require('html-dom-parser');

class HTML2Jira {
  toJira(html) {
    this.html = html;
    this.dom = parser(html);
    this.results = '';

    this.dom.forEach((element) => {
      this.parse(element, 0, '');
    });
    return this.results;
  }

  parse(element, depth, carryOver) {
    switch (element.type) {
      case 'tag':
        this.parseTag(element, depth, carryOver);
        break;
      case 'text':
        this.parseText(element, depth, carryOver);
        break;
      default:
        //   console.log(element);
    }
  }

  parseText(element, depth, carryOver) {
    // console.log(element)
    this.results += carryOver + element.data;
    // console.log(element)
  }

  parseTag(element, depth, carryOverParm) {
    let carryOver = carryOverParm;
    let tag = '';
    let wrapped = false;
    let newDepth = depth;
    const tagId = element.name.toLowerCase();
    let skipChildren = false;
    let skipLineBreak = false;
    // let newCarryOver = ''
    switch (tagId) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        tag = `${tagId}. `;
        break;
      case 'p':
        tag = '';
        break;
      case 'i':
        tag = '_';
        wrapped = true;
        break;
      case 'u':
        tag = '+';
        wrapped = true;
        break;
      case 'img':
        tag = this.processImage(element);
        skipLineBreak = true;
        skipChildren = true;
        break;
      case 'b':
      case 'strong':
        tag = '*';
        wrapped = true;
        break;
      case 'ol':
        tag = this.needNewLine(element);
        carryOver = `${this.pad(depth, '#')} `;
        break;
      case 'ul':
        tag = this.needNewLine(element);
        carryOver = `${this.pad(depth, '*')} `;
        break;
      case 'li':
        newDepth = depth - 1;
        break;
      case 'br':
        tag = '\n';
        break;
      case 'hr':
        tag = '----\n';
        break;
      case 'a':
        tag = this.processAnchor(element);
        skipChildren = true;
        skipLineBreak = true;
        break;
        // case 'table':
        //   tag = this.processTable(element);
        //   skipChildren = true;
        //   skipLineBreak = true;
        //   break;
      default:
        // ignore tag
    }
    this.results += tag;
    const preCRs = this.results.split('\n').length;
    if (!skipChildren) {
      element.children.forEach((child) => {
        this.parse(child, newDepth + 1, carryOver);
      });
    }
    const postCRs = this.results.split('\n').length;
    if (wrapped) {
      this.results += tag;
    } else if (preCRs === postCRs) {
      if (!skipLineBreak) {
        this.results += '\n';
      }
    }
    if (depth === 0) {
      if ((tagId === 'ol') || (tagId === 'ul')) {
        this.results += '\n';
      }
    }
  }

  // processTable(element) {
  //   return '';
  // }

  processImage(element) {
    let src = '';
    let attribs = '';
    const keys = Object.keys(element.attribs);
    keys.forEach((k) => {
      let d = element.attribs[k];
      const space = (attribs.length > 0 ? ', ' : '');
      switch (k.toLowerCase()) {
        case 'src':
          src = d;
          break;
        default:
          if (k === 'alt') {
            d = `"${d}"`;
          }
          attribs += `${space}${k}=${d}`;
          break;
      }
    });
    const vbar = attribs.length === 0 ? '' : '|';
    return `!${src}${vbar}${attribs}!`;
  }

  processAnchor(element) {
    const {
      href
    } = element.attribs;
    let label = '';
    element.children.forEach((child) => {
      label += this.extractText(child);
    });
    if (label.trim().length === 0) {
      label = href;
    }
    return `[${label}|${href}]`;
  }

  extractText(element) {
    let rc = '';
    if (element.type === 'text') {
      rc = element.data;
    }
    return rc;
  }

  needNewLine(element) {
    let rc = '';
    const {
      parent
    } = element;
    if (parent && (parent.type === 'tag') && (parent.name.toLowerCase() === 'li')) {
      let firstList = null;
      parent.children.forEach((child) => {
        if ((firstList === null) && (child.type === 'tag')) {
          if ((child.name.toLowerCase() === 'ol') || (child.name.toLowerCase() === 'ul')) {
            firstList = child;
          }
        }
      });
      if (firstList === element) {
        rc = '\n';
      }
    }
    return rc;
  }

  pad(depth, spaces) {
    let rc = '';
    for (let i = 0; i < depth + 1; i += 1) {
      rc += spaces;
    }
    return rc;
  }
}

module.exports = {
  HTML2Jira
};
