import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiCallsService } from 'src/app/Services/api-calls.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @ViewChild('queryInput') inputItem: ElementRef;

  loading: boolean = false;
  error: String = '';

  chatContent: any[] = [];

  constructor(private apiCallService: ApiCallsService) {}

  ngOnInit(): void {}

  onEnterPress(event: KeyboardEvent) {
    if (event.code === 'Enter') this.onSubmitHandler();
  }

  onSubmitHandler() {
    if (this.inputItem.nativeElement.value === '') {
      this.error = 'Enter a query first';
    } else {
      this.loading = true;
      const query = this.inputItem.nativeElement.value;
      const response = this.apiCallService.postQuery(query);
      response.subscribe((result: { data: any; error: boolean }) => {
        this.loading = false;
        this.chatContent = [...result.data];
        this.inputItem.nativeElement.value = '';
      });
    }
  }
}
