import { remark } from 'remark';

import { parseHeaderToMarkdown, parseMarkdownToHeader } from './BlockTypeParsers/HeaderTypeParser';
import {
  parseMarkdownToParagraph,
  parseParagraphToMarkdown,
} from './BlockTypeParsers/ParagraphTypeParser';
import { parseListToMarkdown, parseMarkdownToList } from './BlockTypeParsers/ListTypeParser';
import {
  parseDelimiterToMarkdown,
  parseMarkdownToDelimiter,
} from './BlockTypeParsers/DelimiterTypeParser';
import { parseCodeToMarkdown, parseMarkdownToCode } from './BlockTypeParsers/CodeTypeParser';
import { parseMarkdownToQuote, parseQuoteToMarkdown } from './BlockTypeParsers/QuoteTypeParser';
import { parseImageToMarkdown } from './BlockTypeParsers/ImageTypeParser';
import { parseCheckboxToMarkdown } from './BlockTypeParsers/CheckboxTypeParser';

export default class Utils {
  markdownToJson(data) {
    const editorData = [];
    const parsedMarkdown = remark.parse(data);

    // Iterating over the pared remarkjs syntax tree and executing the json parsers
    parsedMarkdown.children.forEach((item) => {
      switch (item.type) {
        case 'heading':
          return editorData.push(parseMarkdownToHeader(item));
        case 'paragraph':
          return editorData.push(...parseMarkdownToParagraph(item));
        case 'list':
          return editorData.push(parseMarkdownToList(item));
        case 'thematicBreak':
          return editorData.push(parseMarkdownToDelimiter());
        case 'code':
          return editorData.push(parseMarkdownToCode(item));
        case 'blockquote':
          return editorData.push(parseMarkdownToQuote(item));
        default:
          break;
      }
    });

    // Filter through array and remove empty objects
    return {
      blocks: editorData.filter((value) => Object.keys(value).length !== 0),
    };
  }

  jsonToMarkdown(data) {
    const initialData = {};
    initialData.content = data.blocks;

    const parsedData = initialData.content.map((item) => {
      // iterate through editor data and parse the single blocks to markdown syntax
      switch (item.type) {
        case 'header':
          return parseHeaderToMarkdown(item.data);
        case 'paragraph':
          return parseParagraphToMarkdown(item.data);
        case 'list':
          return parseListToMarkdown(item.data);
        case 'delimiter':
          return parseDelimiterToMarkdown(item);
        case 'image':
          return parseImageToMarkdown(item.data);
        case 'quote':
          return parseQuoteToMarkdown(item.data);
        case 'checkbox':
          return parseCheckboxToMarkdown(item.data);
        case 'code':
          return parseCodeToMarkdown(item.data);
        case 'checklist':
          return parseCheckboxToMarkdown(item.data);
        default:
          break;
      }
    });

    return parsedData.join('\n');
  }
}
