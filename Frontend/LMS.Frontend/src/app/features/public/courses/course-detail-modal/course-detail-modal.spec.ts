import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseDetailModal } from './course-detail-modal';

describe('CourseDetailModal', () => {
  let component: CourseDetailModal;
  let fixture: ComponentFixture<CourseDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetailModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDetailModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
