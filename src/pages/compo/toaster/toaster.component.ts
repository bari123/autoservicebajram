import {Component, Input, OnInit} from '@angular/core';
import {ToasterService} from "./toaster.service";

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {
  constructor(private toasterService: ToasterService) {
  }

  message: string = '';
  IsError: boolean = false;

  showToaster = false

  ngOnInit() {
    this.toasterService.toastState.subscribe((toast) => {
      this.IsError = toast.error;
      this.message = toast.message;
      this.show(this.IsError,this.message);
    });
  }

  show(isError: boolean, msg: string) {
    this.message = msg
    this.IsError = isError
    this.showToaster = true
    setTimeout(() => {
      this.showToaster = false
    }, 5000)
  }


}
