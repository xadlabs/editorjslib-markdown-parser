export function parseParagraphToMarkdown(blocks) {
  return `${blocks.text}\n`;
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
        text += `<em>${processChildren(item.children)}</em>`;
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

export function parseMarkdownToParagraph(blocks) {
  const paragraphs = [];
  let currentParagraph = null;

  blocks.children.forEach((item) => {
    switch (item.type) {
      case 'text':
      case 'strong':
      case 'emphasis':
      case 'underline':
        if (currentParagraph && currentParagraph.type === 'image') {
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
        if (currentParagraph.type === 'paragraph') {
          paragraphs.push(currentParagraph);
          currentParagraph = null;
        }

        if (!currentParagraph) {
          currentParagraph = {
            type: 'image',
            data: {
              caption: item.title,
              stretched: false,
              url: item.url,
              withBackground: false,
              withBorder: false,
            },
          };
        }
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
