export function parseParagraphToMarkdown(blocks) {
  return `${blocks.text}\n`;
}

function markdownToText(item) {
  switch (item.type) {
    case 'text':
      return item.value;
    case 'strong':
      return `<b>${markdownToText(item.children[0])}</b>`;
    case 'emphasis':
      return `<em>${markdownToText(item.children[0])}</em>`;
    case 'underline':
      return `<u class="cdx-underline">${markdownToText(item.children[0])}</u>`;
    default:
      return '';
  }
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
