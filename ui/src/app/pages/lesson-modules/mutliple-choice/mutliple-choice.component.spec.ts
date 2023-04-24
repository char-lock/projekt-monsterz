import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutlipleChoiceComponent } from './mutliple-choice.component';

describe('MutlipleChoiceComponent', () => {
  let component: MutlipleChoiceComponent;
  let fixture: ComponentFixture<MutlipleChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MutlipleChoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MutlipleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
