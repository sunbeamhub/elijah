import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
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
  referenceHeight = input<number | null>(null);
  referenceWidth = input<number | null>(null);
  scaleEffect = input<'both' | 'magnify' | 'shrink'>('both');
  private target = this.elementRef.nativeElement;
  private targetWrapper?: HTMLDivElement;

  ngAfterViewInit() {
    this.updateScale();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateScale();
  }

  private updateScale() {
    const refHeight = this.referenceHeight();
    const refWidth = this.referenceWidth();

    // 至少需要一个参数
    if (!refHeight && !refWidth) {
      return;
    }

    // document、ResizeObserver依赖浏览器环境
    if (!this.isBrowser) {
      return;
    }

    const resize$ = new ResizeObserver(() => {
      // 防止触发多次，也只需要触发一次
      resize$.disconnect();

      // 保证getBoundingClientRect计算准确
      if (this.targetWrapper) {
        this.targetWrapper.parentNode?.insertBefore(
          this.target,
          this.targetWrapper,
        );
        this.targetWrapper.remove();
        this.targetWrapper = undefined;
      }
      ['height', 'transform', 'transformOrigin', 'width'].forEach((item) => {
        this.renderer2.removeStyle(this.target, item);
      });

      const rect = this.target.getBoundingClientRect();
      const sx = refWidth ? rect.width / refWidth : 1;
      const sy = refHeight ? rect.height / refHeight : 1;

      const effect = this.scaleEffect();
      const shouldApply =
        effect === 'both' ||
        (effect === 'magnify' && (sx > 1 || sy > 1)) ||
        (effect === 'shrink' && (sx < 1 || sy < 1));

      if (
        shouldApply &&
        (sx !== this.lastScaleX() || sy !== this.lastScaleY())
      ) {
        this.lastScaleX.set(sx);
        this.lastScaleY.set(sy);

        if (refHeight) {
          this.renderer2.setStyle(this.target, 'height', refHeight + 'px');
        }
        this.renderer2.setStyle(this.target, 'transform', `scale(${sx},${sy})`);
        this.renderer2.setStyle(this.target, 'transformOrigin', 'top left');
        if (refWidth) {
          this.renderer2.setStyle(this.target, 'width', refWidth + 'px');
        }

        // 解决宿主元素缩放后仍然占用空间的问题
        this.targetWrapper = document.createElement('div');
        this.target.parentNode?.insertBefore(this.targetWrapper, this.target);
        this.targetWrapper.appendChild(this.target);

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
