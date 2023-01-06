import { Directive, Output, EventEmitter, HostBinding, HostListener } from "@angular/core";

@Directive({
  selector: '[vexUpload]'
})
export class UploadDirective {
  @Output() onFileDropped = new EventEmitter<any>();
  @HostBinding('style.border-color') public border = 'rgba(19, 82, 177, .5)';
  @HostBinding('style.opacity') public opacity = '1';

  constructor() { }

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = '#114013';
    this.opacity = '0.2';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = 'rgba(19, 82, 177, .5)';
    this.opacity = '1';
  }

  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = 'rgba(19, 82, 177, .5)';
    this.opacity = '1';

    let files = evt.dataTransfer.files;

    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }

}
