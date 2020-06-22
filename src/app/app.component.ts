import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tabActive = "tab1";
  title = 'my-app';

  activeTabChanged(tab: string) {
    this.tabActive = tab;
  }
}
