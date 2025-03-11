import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { ResizeDirective } from '@app/directive/resize/resize.directive';

@Component({
  imports: [CdkDrag, CdkDragHandle, ResizeDirective],
  selector: 'app-resize-demo',
  standalone: true,
  styleUrls: ['./resize-demo.component.css'],
  templateUrl: './resize-demo.component.html',
})
export class ResizeDemoComponent {
  constructor() {}
}
