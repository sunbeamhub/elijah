import { Component, OnInit } from '@angular/core';
import { PdfViewerComponent } from '@app/components/pdf-viewer/pdf-viewer.component';

@Component({
  imports: [PdfViewerComponent],
  selector: 'app-pdf-viewer-demo',
  standalone: true,
  styleUrls: ['./pdf-viewer-demo.component.css'],
  templateUrl: './pdf-viewer-demo.component.html',
})
export class PdfViewerDemoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
