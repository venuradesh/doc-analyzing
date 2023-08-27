import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { ChatTileComponent } from './Components/chat-tile/chat-tile.component';
import { ChatComponent } from './Components/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ChatTileComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
