import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasqueryComponent } from './tasquery.component';

describe('TasqueryComponent', () => {
  let component: TasqueryComponent;
  let fixture: ComponentFixture<TasqueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasqueryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
