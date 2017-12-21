import { Component, OnInit } from '@angular/core';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      $('#top-navbar-1').on('shown.bs.collapse', function(){
        $.backstretch("resize");
      });
      $('#top-navbar-1').on('hidden.bs.collapse', function(){
        $.backstretch("resize");
      });
  }
}
