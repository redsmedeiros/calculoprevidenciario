import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'on-off-switch',
  templateUrl: './on-off-switch.component.html',
})
export class OnOffSwitchComponent implements OnInit {

  @Input() title: string;

  @Input() model: boolean;
  @Output() modelChange = new EventEmitter();

  @Input() value: any;
  @Input() textON: string;
  @Input() textOFF: string;

  private textONS = 'On';
  private textOFFS = 'Off';

  public widgetId;

  constructor() {
  }


  ngOnInit() {

    if (this.textON != undefined) {
      this.textONS = this.textON
    }

    if (this.textOFF != undefined) {
      this.textOFFS = this.textOFF
    }

    this.value = this.model;
    this.widgetId = 'on-off-switch' + OnOffSwitchComponent.widgetsCounter++;
  }

  onChange() {
    this.modelChange.emit(this.value)
  }


  static widgetsCounter = 0
}
