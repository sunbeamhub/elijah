import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.mjs';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  styleUrls: ['./pdf-viewer.component.css'],
  templateUrl: './pdf-viewer.component.html',
})
export class PdfViewerComponent implements OnInit {
  @Input() url?: string;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit() {
    (async () => {
      const pdf = await pdfjsLib.getDocument(this.url!).promise;
      const pageList = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
      pageList
        .map((pageNum) => pdf.getPage(pageNum))
        .reduce(
          (prev, curr) =>
            prev
              .then(() => curr)
              .then((page) => {
                this.renderPage(page);
              }),
          Promise.resolve(),
        );
    })();
  }

  renderPage(page: pdfjsLib.PDFPageProxy) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale: 1.0 });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: context!,
      viewport: viewport,
    };

    page.render(renderContext);
    this.elementRef.nativeElement.appendChild(canvas);
  }
}
