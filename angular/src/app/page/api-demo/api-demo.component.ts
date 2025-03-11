import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-api-demo',
  standalone: true,
  templateUrl: './api-demo.component.html',
})
export class ApiDemoComponent implements OnInit {
  data!: string;

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    (async () => {
      const data = await firstValueFrom(
        this.httpClient.get('/api/hello-world', { responseType: 'text' }),
      );
      this.data = data;
    })();
  }
}
