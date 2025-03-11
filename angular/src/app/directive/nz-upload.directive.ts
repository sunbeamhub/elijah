import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

@Directive({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NzUploadDirective,
    },
  ],
  selector: '[appNzUpload]',
  standalone: true,
})
export class NzUploadDirective implements ControlValueAccessor {
  @Output() changeNzDisabled = new EventEmitter<boolean>();
  @Output() changeNzFileList = new EventEmitter<NzUploadFile[]>();
  @Input() toNzUploadFile = (value: NzUploadFile) => value;

  constructor() {}

  @HostListener('nzChange', ['$event'])
  nzChange(value: NzUploadChangeParam) {
    this.onChange(value.fileList);
    if (value.type === 'error') {
      this.onTouched();
    }
  }

  onChange = (_value: any) => {};

  onTouched = () => {};

  writeValue(obj: NzUploadFile[]): void {
    if (Array.isArray(obj)) {
      this.changeNzFileList.emit(obj.map((item) => this.toNzUploadFile(item)));
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.changeNzDisabled.emit(isDisabled);
  }
}
