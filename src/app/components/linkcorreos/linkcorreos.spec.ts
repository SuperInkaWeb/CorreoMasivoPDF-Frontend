import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Linkcorreos } from './linkcorreos';

describe('Linkcorreos', () => {
  let component: Linkcorreos;
  let fixture: ComponentFixture<Linkcorreos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Linkcorreos],
    }).compileComponents();

    fixture = TestBed.createComponent(Linkcorreos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
