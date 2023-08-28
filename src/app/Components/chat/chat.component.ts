import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  chatContent: any[] = [
    { role: 'user', content: 'Show me the summary of the pdf' },
    {
      role: 'assistant',
      content:
        'Aliquet vestibulum tempus nec facilisi pellentesque cursus venenatis natoque dictum est pulvinar feugiat aptent cras pharetra blandit sed a et ornare sapien accumsan nisi habitant sollicitudin ante parturient volutpat dictumst leo elementum litora neque libero quis',
    },
    { role: 'user', content: 'Show me the summary of the pdf' },
    {
      role: 'assistant',
      content:
        'Aliquet vestibulum tempus nec facilisi pellentesque cursus venenatis natoque dictum est pulvinar feugiat aptent cras pharetra blandit sed a et ornare sapien accumsan nisi habitant sollicitudin ante parturient volutpat dictumst leo elementum litora neque libero quis',
    },
    { role: 'user', content: 'Show me the summary of the pdf' },
    {
      role: 'assistant',
      content:
        'Aliquet vestibulum tempus nec facilisi pellentesque cursus venenatis natoque dictum est pulvinar feugiat aptent cras pharetra blandit sed a et ornare sapien accumsan nisi habitant sollicitudin ante parturient volutpat dictumst leo elementum litora neque libero quis',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
