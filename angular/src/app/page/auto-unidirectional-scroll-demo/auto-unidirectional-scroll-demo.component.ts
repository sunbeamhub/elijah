import { Component, effect, signal, untracked } from '@angular/core';
import {
  AutoUnidirectionalScrollDirective,
  IScrollPosition,
} from '@app/directive/auto-unidirectional-scroll.directive';

@Component({
  imports: [AutoUnidirectionalScrollDirective],
  selector: 'app-auto-scroll-demo',
  standalone: true,
  styleUrls: ['./auto-unidirectional-scroll-demo.component.css'],
  templateUrl: './auto-unidirectional-scroll-demo.component.html',
})
export class AutoUnidirectionalScrollDemoComponent {
  scrollHeight = signal(0);
  list = signal<number[]>([]);

  constructor() {
    effect((onCleanup) => {
      const timer1 = setTimeout(() => {
        const list = new Array(40).fill(0).map((_, index) => index + 1);
        this.list.set(list);
      }, 5000);

      const timer2 = setTimeout(() => {
        const list = new Array(40).fill(0).map((_, index) => index * 2);
        this.list.set(list);
      }, 10000);

      const timer3 = setTimeout(() => {
        const list = new Array(6).fill(0).map((_, index) => index + 1);
        this.list.set(list);
      }, 30000);

      onCleanup(() => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      });
    });
  }

  handleScrolling(e: IScrollPosition) {
    const list = untracked(this.list);
    const len = list.length;

    if (e.needScroll) {
      if (list[0] !== list[len / 2]) {
        this.list.update((value) => [...value, ...value]);
        if (typeof e.scrollHeight === 'number') {
          this.scrollHeight.set(e.scrollHeight);
        }
      } else {
        if (
          typeof e.clientHeight === 'number' &&
          e.clientHeight >= untracked(this.scrollHeight)
        ) {
          this.list.update((value) => value.slice(0, value.length / 2));
        }
      }
    } else {
      if (list[0] === list[len / 2]) {
        this.list.update((value) => value.slice(0, value.length / 2));
      }
    }
  }
}
