export function parseImageToMarkdown(blocks) {
  return `![${blocks.caption}](${blocks.url || blocks.file.url} "${blocks.caption}")`.concat('\n');
}
