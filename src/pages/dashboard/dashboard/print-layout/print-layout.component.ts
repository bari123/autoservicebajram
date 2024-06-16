import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.css']
})
export class PrintLayoutComponent implements OnInit {

  @Input('data') data:any

  constructor() { }

  ngOnInit(): void {
  }

  protected readonly Math = Math;
  protected readonly Date = Date;
}
