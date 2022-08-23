export function parseParagraphToMarkdown(blocks) {
  return `${blocks.text}\n`;
}

function markdownToText(item) {
  if (item.type === 'text') return item.value;

  let text = '';
  if (item.children && item.children.length > 0) {
    item.children.forEach((child) => {
      switch (item.type) {
        case 'strong':
          text += `<b>${markdownToText(child)}</b>`;
          break;
        case 'emphasis':
          text += `<em>${markdownToText(child)}</em>`;
          break;
        case 'underline':
          text += `<u class="cdx-underline">${markdownToText(child)}</u>`;
          break;
        default:
          break;
      }
    });
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
