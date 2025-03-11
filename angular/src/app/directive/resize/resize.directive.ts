import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';

enum DIRECTION {
  BOTTOM = 'bottom',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
}

function findRootResizableElement(element: HTMLElement, selector: string) {
  let current: HTMLElement | null = element;

  while (current) {
    if (current.matches(selector)) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

@Directive({ selector: '[appResize]', standalone: true })
export class ResizeDirective implements AfterViewInit, OnDestroy, OnInit {
  @Input() appResizeRootElement?: string;
  private isBrowser: boolean;
  private minimumSize = 20;
  private mouseMoveListener = () => {};
  private mouseMoveSubject = new Subject();
  private originalHeight = 0;
  private originalMouseX = 0;
  private originalMouseY = 0;
  private originalWidth = 0;
  private originalX = 0;
  private originalY = 0;
  @Output() resizeChange = new EventEmitter<ClientRect | DOMRect>();
  private subscriptionList: Subscription[] = [];
  private target: HTMLElement | null = null;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: any,
    private renderer2: Renderer2,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) {
      return;
    }

    if (this.appResizeRootElement) {
      this.target = findRootResizableElement(
        this.elementRef.nativeElement,
        this.appResizeRootElement,
      );
    } else {
      this.target = this.elementRef.nativeElement;
    }

    if (!this.target) {
      return;
    }

    const position = getComputedStyle(this.target).position;
    if (position !== 'fixed') {
      this.renderer2.setStyle(this.target, 'position', 'fixed');
    }

    Object.values(DIRECTION).forEach((item) => {
      const div = this.renderer2.createElement('div');
      this.renderer2.addClass(div, 'resize__' + item);
      this.renderer2.appendChild(this.target, div);
      this.renderer2.listen(div, 'mousedown', (e) => {
        this.onMousedown(e, item);
      });
    });
  }

  ngOnDestroy() {
    this.subscriptionList.forEach((item) => {
      if (item) {
        item.unsubscribe();
      }
    });
  }

  ngOnInit() {
    this.subscriptionList[this.subscriptionList.length] =
      this.mouseMoveSubject.subscribe(() => {
        if (!this.target) {
          return;
        }

        this.resizeChange.emit(this.target.getBoundingClientRect());
      });
  }

  onMousedown(e: MouseEvent, direction: DIRECTION) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.target || !this.isBrowser) {
      return;
    }

    // 应用其它区域监听app-pointer-events事件，保证自身响应鼠标事件（pointer-events css不为none）
    dispatchEvent(new CustomEvent('app-pointer-events', { detail: true }));

    this.originalHeight = parseFloat(
      getComputedStyle(this.target, null)
        .getPropertyValue('height')
        .replace('px', ''),
    );
    this.originalMouseX = e.pageX;
    this.originalMouseY = e.pageY;
    this.originalWidth = parseFloat(
      getComputedStyle(this.target, null)
        .getPropertyValue('width')
        .replace('px', ''),
    );
    this.originalX = parseFloat(
      getComputedStyle(this.target, null)
        .getPropertyValue('left')
        .replace('px', ''),
    );
    this.originalY = parseFloat(
      getComputedStyle(this.target, null)
        .getPropertyValue('top')
        .replace('px', ''),
    );

    this.mouseMoveListener = this.renderer2.listen(window, 'mousemove', (e) => {
      this.onMousemove(e, direction);
    });

    this.renderer2.listen(window, 'mouseup', this.onMouseup.bind(this));
  }

  onMousemove(e: MouseEvent, direction: DIRECTION) {
    e.preventDefault();
    e.stopPropagation();

    let height;
    let left;
    let top;
    let width;

    switch (direction) {
      case DIRECTION.BOTTOM:
        height = this.originalHeight + e.pageY - this.originalMouseY;
        if (height > this.minimumSize) {
          this.renderer2.setStyle(this.target, 'height', height + 'px');
          this.renderer2.setStyle(this.target, 'top', this.originalY + 'px');
        }
        this.renderer2.setStyle(
          this.target,
          'width',
          this.originalWidth + 'px',
        );
        break;
      case DIRECTION.BOTTOM_LEFT:
        height = this.originalHeight + e.pageY - this.originalMouseY;
        left = this.originalX + e.pageX - this.originalMouseX;
        width = this.originalWidth - (e.pageX - this.originalMouseX);
        if (height > this.minimumSize) {
          this.renderer2.setStyle(this.target, 'height', height + 'px');
          this.renderer2.setStyle(this.target, 'top', this.originalY + 'px');
        }
        if (width > this.minimumSize) {
          this.renderer2.setStyle(this.target, 'left', left + 'px');
          this.renderer2.setStyle(this.target, 'width', width + 'px');
        }
        break;
      case DIRECTION.BOTTOM_RIGHT:
        height = this.originalHeight + e.pageY - this.originalMouseY;
        width = this.originalWidth + e.pageX - this.originalMouseX;
        if (height > this.minimumSize) {
          this.renderer2.setStyle(this.target, 'height', height + 'px');
          this.renderer2.setStyle(this.target, 'top', this.originalY + 'px');
        }
        if (width > this.minimumSize) {
          this.renderer2.setStyle(this.target, 'left', this.originalX + 'px');
          this.renderer2.setStyle(this.target, 'width', width + 'px');
        }
        break;
      case DIRECTION.LEFT:
        left = this.originalX + e.pageX - this.originalMouseX;
        width = this.originalWidth - (e.pageX - this.originalMouseX);
        this.renderer2.setStyle(
          this.target,
          'height',
          this.originalHeight + 'px',
        );
        if (width > this.minimumSize) {
          this.renderer2.setStyle(this.target, 'left', left + 'px');
          this.renderer2.setStyle(this.target, 'width', width + 'px');
        }
        break;
      case DIRECTION.RIGHT:
        width = this.originalWidth + e.pageX - this.originalMouseX;
        this.renderer2.setStyle(
          this.target,
          'height',
          this.originalHeight + 'px',
        );
        if (width > this.minimumSize) {
          this.renderer2.setStyle(this.target, 'left', this.originalX + 'px');
          this.renderer2.setStyle(this.target, 'width', width + 'px');
        }
        break;
      case DIRECTION.TOP:
        height = this.originalHeight - (e.pageY - this.originalMouseY);
        top = this.originalY + e.pageY - this.originalMouseY;
        if (height > this.minimumSize) {
          this.renderer2.setStyle(this.target, 'height', height + 'px');
          this.renderer2.setStyle(this.target, 'top', top + 'px');
        }
        this.renderer2.setStyle(
          this.target,
          'width',
          this.originalWidth + 'px',
        );
        break;
      case DIRECTION.TOP_LEFT:
        height = this.originalHeight - (e.pageY - this.originalMouseY);
        left = this.originalX + e.pageX - this.originalMouseX;
        top = this.originalY + e.pageY - this.originalMouseY;
        width = this.originalWidth - (e.pageX - this.originalMouseX);
        if (height > this.minimumSize) {
          this.renderer2.setStyle(this.target, 'height', height + 'px');
          this.renderer2.setStyle(this.target, 'top', top + 'px');
        }
        if (width > this.minimumSize) {
          this.renderer2.setStyle(this.target, 'left', left + 'px');
          this.renderer2.setStyle(this.target, 'width', width + 'px');
        }
        break;
      case DIRECTION.TOP_RIGHT:
        height = this.originalHeight - (e.pageY - this.originalMouseY);
        top = this.originalY + e.pageY - this.originalMouseY;
        width = this.originalWidth + e.pageX - this.originalMouseX;
        if (height > this.minimumSize) {
          this.renderer2.setStyle(this.target, 'height', height + 'px');
          this.renderer2.setStyle(this.target, 'top', top + 'px');
        }
        if (width > this.minimumSize) {
          this.renderer2.setStyle(this.target, 'left', this.originalX + 'px');
          this.renderer2.setStyle(this.target, 'width', width + 'px');
        }
        break;
    }

    this.mouseMoveSubject.next(null);
  }

  onMouseup(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (this.mouseMoveListener) {
      this.mouseMoveListener();
    }

    // 应用其它区域监听app-pointer-events事件，恢复原有逻辑
    window.dispatchEvent(
      new CustomEvent('app-pointer-events', { detail: false }),
    );
  }
}
