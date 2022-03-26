import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

export interface IBasicFilterState {
  contrast: number;
  blur: number;
  brightness: number;
  grayscale: number;
  invert: number;
  saturate: number;
  sepia: number;
}

@Component({
  selector: 'lib-basic-filters',
  templateUrl: './basic-filters.component.html',
  styleUrls: ['./basic-filters.component.scss'],
})
export class BasicFiltersComponent implements OnInit {
  @Input() filterState: IBasicFilterState | any = {};
  @Input() color: string;
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

  constructor() {}

  ngOnInit(): void {
    this.state = JSON.parse(JSON.stringify({ ...this.state, ...this.filterState }));
    console.log('🚀 ~ file: basic-filters.component.ts ~ line 25 ~ BasicFiltersComponent ~ ngOnInit ~ this.state', this.state);
  }

  onChange() {
    this.changeFilter.next(this.state);
  }
}
