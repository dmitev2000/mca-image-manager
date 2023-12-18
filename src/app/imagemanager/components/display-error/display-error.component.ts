import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-error',
  templateUrl: './display-error.component.html',
  styleUrls: ['./display-error.component.scss']
})
export class DisplayErrorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() errorMessage: string;
  @Input() errorStatus: number;
  @Input() errorType: string;
  
}
