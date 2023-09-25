import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageLayoutComponent } from '@shared/components';

describe('PageLayoutComponent', () => {
  let component: PageLayoutComponent;
  let fixture: ComponentFixture<PageLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageLayoutComponent],
    });
    fixture = TestBed.createComponent(PageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
