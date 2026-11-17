export class NoSelectablePdfTextError extends Error {
  constructor() { super('This PDF has no selectable text.'); this.name = 'NoSelectablePdfTextError'; }
}

// Parse document containers rather than treating compressed bytes as plain text.
// No filename, fallback sentence, or OCR guess is ever document content.
const MAX_DOCUMENT_TEXT = 2_000_000;

export async function extractDocxDocumentText(file: File): Promise<string> {
  const { unzipSync, strFromU8 } = await import('fflate');
  const archive = unzipSync(new Uint8Array(await file.arrayBuffer()), {
    filter: entry => entry.name === 'word/document.xml' && entry.originalSize <= MAX_DOCUMENT_TEXT * 4,
  });
  const xmlBytes = archive['word/document.xml'];
  if (!xmlBytes) throw new Error('The document has no readable Word text.');
  const xml = new DOMParser().parseFromString(strFromU8(xmlBytes), 'application/xml');
  if (xml.getElementsByTagName('parsererror').length) throw new Error('The Word document is damaged.');
  const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const paragraphs = Array.from(xml.getElementsByTagNameNS(ns, 'p')).map(paragraph => {
    let text = '';
    const visit = (node: Element) => {
      if (node.namespaceURI === ns && node.localName === 't') { text += node.textContent || ''; return; }
      if (node.namespaceURI === ns && node.localName === 'tab') text += '\t';
      if (node.namespaceURI === ns && ['br', 'cr'].includes(node.localName)) text += '\n';
      for (const child of Array.from(node.children)) visit(child);
    };
    visit(paragraph);
    return text;
  });
  const text = paragraphs.join('\n\n').trim();
  if (!text || text.length > MAX_DOCUMENT_TEXT) throw new Error('The Word document has no supported text or is too large.');
  return text;
}

export async function extractPdfDocumentText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  // A same-origin static asset works in both Next export and Vite. Next does
  // not interpret Vite's URL import convention as a URL string.
  pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker-6.5.438.min.mjs';
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), useSystemFonts: true });
  try {
    const document = await task.promise;
    const pages: string[] = [];
    let length = 0;
    for (let index = 1; index <= document.numPages; index += 1) {
      const page = await document.getPage(index);
      const content = await page.getTextContent();
      let text = '';
      for (const item of content.items) {
        if ('str' in item) text += item.str + (item.hasEOL ? '\n' : ' ');
      }
      length += text.length;
      if (length > MAX_DOCUMENT_TEXT) throw new Error('The PDF contains too much text.');
      pages.push(text.trim());
      page.cleanup();
    }
    const text = pages.join('\n\n').trim();
    if (!text) throw new NoSelectablePdfTextError();
    return text;
  } finally { await task.destroy(); }
}
