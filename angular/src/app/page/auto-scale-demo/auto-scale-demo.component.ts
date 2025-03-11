import { Component, OnInit } from '@angular/core';
import { AutoScaleDirective } from '@app/directive/auto-scale.directive';

@Component({
  imports: [AutoScaleDirective],
  selector: 'app-auto-scale-demo',
  standalone: true,
  styleUrls: ['./auto-scale-demo.component.css'],
  templateUrl: './auto-scale-demo.component.html',
})
export class AutoScaleDemoComponent implements OnInit {
  list: number[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.list = new Array(4).fill(0).map((_, index) => index + 1);
    }, 5000);
  }
}
