import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Deactive } from './deactive';

describe('Deactivate', () => {
  let component: Deactive;
  let fixture: ComponentFixture<Deactive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Deactive],
    }).compileComponents();

    fixture = TestBed.createComponent(Deactive);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
