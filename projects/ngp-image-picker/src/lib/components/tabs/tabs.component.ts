import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

interface TabHeader {
  active: boolean;
  label: string;
}
@Component({
  selector: 'lib-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  labels: Array<TabHeader> = [];
  indexActivated: number = 0;
  @Input() color = '';

  @Input() set _labels(value: Array<string>) {
    if (value?.length) {
      this.labels = value.map((el) => ({ active: false, label: el }));
      this.labels[this.indexActivated].active = true;
    }
  }
  @Input() set _indexActivated(index: number) {
    this.indexActivated = index || 0;
  }

  @Output() indexActivatedChange: EventEmitter<number> = new EventEmitter<number>();

  onActivateTab(itemIndex: number) {
    this.labels = this.labels.map((el, index) => {
      el.active = itemIndex === index ? true : false;
      return el;
    });
    this.indexActivated = itemIndex;
    this.indexActivatedChange.next(itemIndex);
  }

  constructor() {}

  ngOnInit() {}
}
