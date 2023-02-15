import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import labelEn from './i18n/en.json';
import { NgpImagePickerComponent } from './ngp-image-picker.component';

describe('NgpImagePickerComponent', () => {
  let component: NgpImagePickerComponent;
  let fixture: ComponentFixture<NgpImagePickerComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ markForCheck: () => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [NgpImagePickerComponent],
      providers: [{ provide: ChangeDetectorRef, useFactory: changeDetectorRefStub }],
    });
    fixture = TestBed.createComponent(NgpImagePickerComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`loadImage has default value`, () => {
    expect(component.loadImage).toEqual(false);
  });

  it(`showEditPanel has default value`, () => {
    expect(component.showEditPanel).toEqual(false);
  });

  it(`imageName has default value`, () => {
    expect(component.imageName).toEqual(`download`);
  });

  it(`labels has default value`, () => {
    expect(component.labels).toEqual(labelEn);
  });

  it(`arrayCopiedImages has default value`, () => {
    expect(component.arrayCopiedImages).toEqual([]);
  });

  it(`color has default value`, () => {
    expect(component.color).toEqual(`#1e88e5`);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'appendLinkIconsToHead').and.callThrough();
      component.ngOnInit();
      expect(component.appendLinkIconsToHead).toHaveBeenCalled();
    });
  });
});
