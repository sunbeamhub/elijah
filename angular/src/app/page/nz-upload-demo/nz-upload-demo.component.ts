import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzUploadDirective } from '@app/directive/nz-upload.directive';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  animations: [],
  imports: [
    NzButtonModule,
    NzFormModule,
    NzIconModule,
    NzUploadDirective,
    NzUploadModule,
    ReactiveFormsModule,
  ],
  selector: 'app-nz-upload-demo',
  standalone: true,
  styleUrls: ['./nz-upload-demo.component.css'],
  templateUrl: './nz-upload-demo.component.html',
})
export class NzUploadDemoComponent {
  form = this.formBuilder.group({ file: [null, [Validators.required]] });

  constructor(private formBuilder: FormBuilder) {}

  submitForm() {
    if (this.form.valid) {
      console.log('submit', this.form.value);
    } else {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
