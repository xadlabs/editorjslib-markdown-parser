import MarkdownImporter from "./MarkdownImporter";
import MarkdownParser from "./MarkdownParser";

export default class MarkdownHelper {
  constructor(editor) {
    this.importer = new MarkdownImporter({ data: {}, api: editor });
    this.expoter = new MarkdownParser({ data: {}, api: editor });
  }

  importFromMarkdown() {
    this.importer.importDirectly();
  }

  exportToMarkdown() {
    this.expoter.render();
  }
}
