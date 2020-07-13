import { Component, HostListener } from '@angular/core';
import * as D3 from 'd3v4';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @HostListener('document:mousemove', ['$event'])

  tabActive = "tab1";
  title = 'my-app';

  activeTabChanged(tab: string) {
    this.tabActive = tab;
    this.drawredline();
  }

  public drawredline() {

  }

public static highchartsmouseover = false;
onMouseMove(e) {

  if(AppComponent.highchartsmouseover) {
    document.getElementById("infoi").style.display = 'block';
    document.getElementById("infoi").style.left = e.clientX - 5 + 'px';
    var body = document.body,
    html = document.documentElement;

    var height = Math.max( body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

    height -= 300;

    document.getElementById("infoi").style.height = height + 'px';
  }
  else {
    document.getElementById("infoi").style.display = 'none';
  }
}

public appMouseMoveFn() {
  this.onMouseMove(null);
}

}
