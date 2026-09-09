import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Panelcontrol } from './panelcontrol';

describe('Panelcontrol', () => {
  let component: Panelcontrol;
  let fixture: ComponentFixture<Panelcontrol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Panelcontrol],
    }).compileComponents();

    fixture = TestBed.createComponent(Panelcontrol);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
