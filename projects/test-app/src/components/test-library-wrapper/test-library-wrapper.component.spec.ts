import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLibraryWrapperComponent } from './test-library-wrapper.component';

describe('TestLibraryWrapperComponent', () => {
  let component: TestLibraryWrapperComponent;
  let fixture: ComponentFixture<TestLibraryWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestLibraryWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestLibraryWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
