export function parseCheckboxToMarkdown(blocks) {
  let items = {};

  items = blocks.items.map((item) => {
    const level = item.level || 0;
    const tabsPrefix = '\t'.repeat(level);
    if (item.checked === true) {
      return `${tabsPrefix}- [x] ${item.text}`;
    }
    return `${tabsPrefix}- [ ] ${item.text}`;
  });

  return items.join('\n');
}
