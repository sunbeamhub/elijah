import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  PLATFORM_ID,
  Renderer2,
  signal,
} from '@angular/core';

@Directive({
  selector: '[appAutoScale]',
  standalone: true,
})
export class AutoScaleDirective implements AfterViewInit {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private renderer2 = inject(Renderer2);

  private isBrowser = isPlatformBrowser(this.platformId);
  private lastScaleX = signal(1);
  private lastScaleY = signal(1);
  @Input() referenceHeight!: number;
  @Input() referenceWidth!: number;
  private target = this.elementRef.nativeElement;
  private targetWrapper!: HTMLDivElement;

  ngAfterViewInit() {
    this.updateScale();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateScale();
  }

  private updateScale() {
    if (!this.referenceHeight || !this.referenceWidth) {
      return;
    }

    // document、ResizeObserver依赖浏览器环境
    if (!this.isBrowser) {
      return;
    }

    if (!this.targetWrapper) {
      this.targetWrapper = document.createElement('div');
      this.target.parentNode?.insertBefore(this.targetWrapper, this.target);
      this.targetWrapper.appendChild(this.target);
    }

    const resize$ = new ResizeObserver(() => {
      // 防止触发多次，也只需要触发一次
      resize$.disconnect();

      // 保证getBoundingClientRect计算准确
      ['height', 'overflow', 'width'].forEach((item) => {
        this.renderer2.removeStyle(this.targetWrapper, item);
      });
      ['height', 'transform', 'transformOrigin', 'width'].forEach((item) => {
        this.renderer2.removeStyle(this.target, item);
      });

      const rect = this.target.getBoundingClientRect();
      const sx = rect.width / this.referenceWidth;
      const sy = rect.height / this.referenceHeight;
      if (sx !== this.lastScaleX() || sy !== this.lastScaleY()) {
        this.lastScaleX.set(sx);
        this.lastScaleY.set(sy);

        this.renderer2.setStyle(
          this.target,
          'height',
          this.referenceHeight + 'px',
        );
        this.renderer2.setStyle(this.target, 'transform', `scale(${sx},${sy})`);
        this.renderer2.setStyle(this.target, 'transformOrigin', 'top left');
        this.renderer2.setStyle(
          this.target,
          'width',
          this.referenceWidth + 'px',
        );

        // 解决宿主元素缩放后仍然占用空间的问题
        this.renderer2.setStyle(
          this.targetWrapper,
          'height',
          rect.height + 'px',
        );
        this.renderer2.setStyle(this.targetWrapper, 'overflow', 'hidden');
        this.renderer2.setStyle(this.targetWrapper, 'width', rect.width + 'px');
      }
    });
    resize$.observe(this.target);
  }
}
