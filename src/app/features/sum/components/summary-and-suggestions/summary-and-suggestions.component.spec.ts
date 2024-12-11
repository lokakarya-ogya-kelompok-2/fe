import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryAndSuggestionsComponent } from './summary-and-suggestions.component';

describe('SummaryAndSuggestionsComponent', () => {
  let component: SummaryAndSuggestionsComponent;
  let fixture: ComponentFixture<SummaryAndSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryAndSuggestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryAndSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
