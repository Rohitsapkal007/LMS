import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseApproval } from './course-approval';

describe('CourseApproval', () => {
  let component: CourseApproval;
  let fixture: ComponentFixture<CourseApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseApproval],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseApproval);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
