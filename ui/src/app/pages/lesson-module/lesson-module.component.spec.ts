import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonModuleComponent } from './lesson-module.component';

describe('LessonModuleComponent', () => {
  let component: LessonModuleComponent;
  let fixture: ComponentFixture<LessonModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
