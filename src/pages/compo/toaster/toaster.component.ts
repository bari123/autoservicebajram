import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent {
  @Input() message: string | undefined='Succes';
  @Input() isError: boolean | undefined=true

  showToaster = false

  constructor() {
  }

  show(isError:boolean,msg:string) {
    console.log('inside')
    this.message=msg
    this.isError=isError
    this.showToaster = true
    setTimeout(()=>{
      this.showToaster=false
    },5000)
  }

  hide(){
    this.showToaster=false
  }


}
