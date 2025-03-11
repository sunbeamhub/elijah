import { Routes } from '@angular/router';
import { ApiDemoComponent } from '@app/page/api-demo/api-demo.component';
import { AutoScaleDemoComponent } from '@app/page/auto-scale-demo/auto-scale-demo.component';
import { AutoUnidirectionalScrollDemoComponent } from '@app/page/auto-unidirectional-scroll-demo/auto-unidirectional-scroll-demo.component';
import { HighlyCompatibleCssDemoComponent } from '@app/page/highly-compatible-css-demo/highly-compatible-css-demo.component';
import { NzUploadDemoComponent } from '@app/page/nz-upload-demo/nz-upload-demo.component';
import { PdfViewerDemoComponent } from '@app/page/pdf-viewer-demo/pdf-viewer-demo.component';
import { ResizeDemoComponent } from '@app/page/resize-demo/resize-demo.component';

export const routes: Routes = [
  {
    component: ApiDemoComponent,
    path: 'api-demo',
  },
  {
    component: AutoScaleDemoComponent,
    path: 'auto-scale-demo',
  },
  {
    component: AutoUnidirectionalScrollDemoComponent,
    path: 'auto-unidirectional-scroll-demo',
  },
  {
    component: HighlyCompatibleCssDemoComponent,
    path: 'highly-compatible-css-demo',
  },
  {
    component: NzUploadDemoComponent,
    path: 'nz-upload-demo',
  },
  {
    component: PdfViewerDemoComponent,
    path: 'pdf-viewer-demo',
  },
  { component: ResizeDemoComponent, path: 'resize-demo' },
];
