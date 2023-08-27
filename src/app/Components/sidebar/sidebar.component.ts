import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  files: FileList[];
  filesUploaded: any[] = [];

  @ViewChild('fileUpload') element: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  handleFiles(event) {
    this.files = event.target.files;
    this.filesUploaded = Array.from(this.files);

    console.log(this.filesUploaded);
  }

  uploadFileClick() {
    this.element.nativeElement.click();
  }
}
