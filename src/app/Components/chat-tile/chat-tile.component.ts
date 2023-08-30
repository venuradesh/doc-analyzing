import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-tile',
  templateUrl: './chat-tile.component.html',
  styleUrls: ['./chat-tile.component.css'],
})
export class ChatTileComponent implements OnInit {
  @Input() chatContent: { role: string; content: string };
  chatUser: string;

  constructor() {}

  ngOnInit(): void {
    this.chatUser = this.chatContent.role;
  }
}
