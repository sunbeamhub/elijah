import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';

@Directive({
  selector: '[appAutoUnidirectionalScroll]',
  standalone: true,
})
export class AutoUnidirectionalScrollDirective
  implements AfterViewInit, OnDestroy
{
  private intervalId?: number;
  private isBrowser: boolean;
  @Input('scrollDirection') scrollDirection?: 'x' | 'y';
  @Input('scrollInterval') scrollInterval = 10;

  @HostBinding('style.overflowX') get styleOverflowX() {
    return this.scrollDirection === 'x'
      ? 'auto'
      : this.scrollDirection === 'y'
        ? 'hidden'
        : 'visible';
  }

  @HostBinding('style.overflowY') get styleOverflowY() {
    return this.scrollDirection === 'y'
      ? 'auto'
      : this.scrollDirection === 'x'
        ? 'hidden'
        : 'visible';
  }

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    this.startAutoScroll();
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.stopAutoScroll();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.startAutoScroll();
  }

  private startAutoScroll() {
    if (!this.isBrowser) {
      return;
    }

    this.stopAutoScroll();

    if ('x' === this.scrollDirection) {
      this.intervalId = window.setInterval(() => {
        const { scrollLeft, scrollWidth, clientWidth } =
          this.elementRef.nativeElement;
        if (scrollLeft + clientWidth >= scrollWidth) {
          this.elementRef.nativeElement.scrollLeft = 0;
        } else {
          this.elementRef.nativeElement.scrollLeft += 1;
        }
      }, this.scrollInterval);
    }

    if ('y' === this.scrollDirection) {
      this.intervalId = window.setInterval(() => {
        const { scrollTop, scrollHeight, clientHeight } =
          this.elementRef.nativeElement;
        if (scrollTop + clientHeight >= scrollHeight) {
          this.elementRef.nativeElement.scrollTop = 0;
        } else {
          this.elementRef.nativeElement.scrollTop += 1;
        }
      }, this.scrollInterval);
    }
  }

  private stopAutoScroll() {
    if (!this.isBrowser) {
      return;
    }

    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
    }
  }
}
