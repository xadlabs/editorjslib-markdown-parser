import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';

export function parseParagraphToMarkdown(paragraph) {
  const output = unified()
    .use(rehypeParse) // Parse HTML to a syntax tree
    .use(rehypeRemark) // Turn HTML syntax tree to markdown syntax tree
    .use(remarkStringify) // Serialize HTML syntax tree
    .processSync(paragraph.text);

  return `${String(output)}\n`;
}

function markdownToText(item) {
  if (item.type === 'text') return item.value;

  function processChildren(children) {
    let text = '';
    children.forEach((child) => {
      text += markdownToText(child);
    });

    return text;
  }

  let text = '';
  if (item.children && item.children.length > 0) {
    switch (item.type) {
      case 'strong':
        text += `<b>${processChildren(item.children)}</b>`;
        break;
      case 'emphasis':
        text += `<i>${processChildren(item.children)}</i>`;
        break;
      case 'underline':
        text += `<u class="cdx-underline">${processChildren(item.children)}</u>`;
        break;
      default:
        break;
    }
  }

  return text;
}

export function parseMarkdownToParagraph(paragraphBlock) {
  const paragraphs = [];
  let currentParagraph = null;

  paragraphBlock.children.forEach((item) => {
    console.log(item);
    switch (item.type) {
      case 'text':
      case 'strong':
      case 'emphasis':
      case 'underline':
        if (currentParagraph) {
          paragraphs.push(currentParagraph);
          currentParagraph = null;
        }

        if (!currentParagraph) {
          currentParagraph = {
            type: 'paragraph',
            data: {
              text: '',
            },
          };
        }

        currentParagraph.data.text += markdownToText(item);
        break;
      case 'image':
        if (currentParagraph) {
          paragraphs.push(currentParagraph);
          currentParagraph = null;
        }

        currentParagraph = {
          type: 'image',
          data: {
            caption: item.title || item.alt,
            file: { url: item.url },
          },
        };
        break;
      default:
        break;
    }
  });

  if (currentParagraph) {
    paragraphs.push(currentParagraph);
    currentParagraph = null;
  }

  return paragraphs;
}
