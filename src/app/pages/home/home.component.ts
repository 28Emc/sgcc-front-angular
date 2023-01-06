import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'vex-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  subList: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.subList = new Subscription();
  }

  ngOnDestroy(): void {
    this.subList.unsubscribe();
  }
}
