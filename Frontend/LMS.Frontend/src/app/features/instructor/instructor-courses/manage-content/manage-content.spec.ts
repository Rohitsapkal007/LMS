import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageContent } from './manage-content';

describe('ManageContent', () => {
  let component: ManageContent;
  let fixture: ComponentFixture<ManageContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageContent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
