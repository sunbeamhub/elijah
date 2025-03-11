import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

@Directive({
  selector: '[appAutoScale]',
  standalone: true,
})
export class AutoScaleDirective implements AfterViewInit, OnDestroy {
  private isBrowser: boolean;
  private lastScaleX!: number;
  private lastScaleY!: number;
  private mutationObserver!: MutationObserver;
  private resizeSubscription!: Subscription;

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: any,
    private renderer2: Renderer2,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.isBrowser) {
        this.updateScale();

        this.mutationObserver = new MutationObserver(
          debounce(() => {
            this.updateScale();
          }, 100),
        );

        this.mutationObserver.observe(this.elementRef.nativeElement, {
          childList: true,
          attributes: true,
          subtree: true,
        });

        this.resizeSubscription = fromEvent(window, 'resize')
          .pipe(debounceTime(100))
          .subscribe(() => {
            this.updateScale();
          });
      }
    });
  }

  ngOnDestroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  private updateScale() {
    const sx = this.calcSx();
    const sy = this.calcSy();

    if (sx !== this.lastScaleX || sy !== this.lastScaleY) {
      this.lastScaleX = sx;
      this.lastScaleY = sy;

      if (sx === 1 && sy === 1) {
        this.renderer2.removeStyle(this.elementRef.nativeElement, 'transform');
        this.renderer2.removeStyle(
          this.elementRef.nativeElement,
          'transformOrigin',
        );
        this.renderer2.removeStyle(this.elementRef.nativeElement, 'width');
        this.renderer2.removeStyle(this.elementRef.nativeElement, 'height');
      } else {
        this.renderer2.setStyle(
          this.elementRef.nativeElement,
          'transform',
          `scale(${sx},${sy})`,
        );
        this.renderer2.setStyle(
          this.elementRef.nativeElement,
          'transformOrigin',
          'top left',
        );
        this.renderer2.setStyle(
          this.elementRef.nativeElement,
          'width',
          window.innerWidth + 'px',
        );
        this.renderer2.setStyle(
          this.elementRef.nativeElement,
          'height',
          window.innerHeight + 'px',
        );
      }
    }
  }

  private calcSx(): number {
    const hostWidth = this.elementRef.nativeElement.scrollWidth;
    const viewportWidth = window.innerWidth;

    return hostWidth > viewportWidth ? viewportWidth / hostWidth : 1;
  }

  private calcSy(): number {
    const hostHeight = this.elementRef.nativeElement.scrollHeight;
    const viewportHeight = window.innerHeight;

    return hostHeight > viewportHeight ? viewportHeight / hostHeight : 1;
  }
}
