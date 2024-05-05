import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../../../app/global.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.css']
})
export class ClientInfoComponent implements OnInit {

  client: any

  constructor(private service: GlobalService, private route: ActivatedRoute) {
  }


  async ngOnInit() {
    this.client = await this.service.getClientById(this.route.snapshot.paramMap.get('id'))
  }

}
