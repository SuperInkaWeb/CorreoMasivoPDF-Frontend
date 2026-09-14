import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboarduser } from './dashboarduser';

describe('Dashboarduser', () => {
  let component: Dashboarduser;
  let fixture: ComponentFixture<Dashboarduser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboarduser],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboarduser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
