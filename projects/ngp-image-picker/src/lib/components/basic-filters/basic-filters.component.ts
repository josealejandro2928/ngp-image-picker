import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IBasicFilterState } from '../../models/index.models';

@Component({
  selector: 'lib-basic-filters',
  templateUrl: './basic-filters.component.html',
  styleUrls: ['./basic-filters.component.scss'],
})
export class BasicFiltersComponent implements OnInit {
  @Input() color: string = '';
  @Input() labels: any;

  @Output() changeFilter = new EventEmitter<IBasicFilterState>();

  state: IBasicFilterState = {
    contrast: 1,
    blur: 0,
    brightness: 1,
    grayscale: 0,
    invert: 0,
    saturate: 1,
    sepia: 0,
  };

  @Input() set filterState(value: any) {
    if (value) {
      this.state = JSON.parse(JSON.stringify({ ...this.state, ...value }));
    } else {
      this.state = {
        contrast: 1,
        blur: 0,
        brightness: 1,
        grayscale: 0,
        invert: 0,
        saturate: 1,
        sepia: 0,
      };
    }
  }
  timeout: number | NodeJS.Timeout | undefined;

  constructor() {}

  ngOnInit(): void {}

  onChange() {
    this.debounce(() => {
      this.changeFilter.next(this.state);
    }, 150);
  }

  debounce = (callback: Function, delay: number | undefined) => {
    clearTimeout(this.timeout as any);
    this.timeout = setTimeout(() => {
      callback();
      clearTimeout(this.timeout as any);
    }, delay);
  };
}
