import { Component, OnInit } from '@angular/core';
import { AutoUnidirectionalScrollDirective } from '@app/directive/auto-unidirectional-scroll.directive';

@Component({
  imports: [AutoUnidirectionalScrollDirective],
  selector: 'app-auto-scroll-demo',
  standalone: true,
  styleUrls: ['./auto-unidirectional-scroll-demo.component.css'],
  templateUrl: './auto-unidirectional-scroll-demo.component.html',
})
export class AutoUnidirectionalScrollDemoComponent implements OnInit {
  list: number[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.list = new Array(40).fill(0).map((_, index) => index + 1);
    }, 5000);

    setTimeout(() => {
      this.list = new Array(40).fill(0).map((_, index) => index + 1);
    }, 10000);

    setTimeout(() => {
      this.list = new Array(2).fill(0).map((_, index) => index + 1);
    }, 20000);
  }
}
