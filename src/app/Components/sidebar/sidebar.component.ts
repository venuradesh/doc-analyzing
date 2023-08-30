import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiCallsService } from 'src/app/Services/api-calls.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  files: FileList;
  filesUploaded: any[] = [];
  formdata: any[] = [];
  processed: boolean = false;
  error: string = '';
  loading: boolean = false;

  @ViewChild('fileUpload') element: ElementRef;

  constructor(private apiServices: ApiCallsService) {}

  ngOnInit(): void {}

  handleFiles(event) {
    this.files = event.target.files;
    this.filesUploaded = Array.from(this.files);
    for (let i = 0; i < this.filesUploaded.length; i++) {
      this.formdata[i] = {
        data: this.filesUploaded[i],
        name: this.filesUploaded[i].name,
      };
    }
  }

  handleProcessClick() {
    this.loading = true;
    const response = this.apiServices.postFiles(this.formdata);
    response.subscribe(
      (res: { data: string; error: boolean; loaded: boolean }) => {
        this.loading = false;
        if (res.loaded === true) {
          if (res.error === false) {
            this.processed = true;
            this.error = '';
          } else {
            this.processed = false;
            this.error = res.data;
          }
        }
      }
    );
  }

  uploadFileClick() {
    this.element.nativeElement.click();
  }
}
