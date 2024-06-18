import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  @Input() text: string | undefined
  @Input() btnStyle: string | undefined
  @Input() iconName: string | undefined
  @Input() disabled:boolean|undefined

  @Output() clicked = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
