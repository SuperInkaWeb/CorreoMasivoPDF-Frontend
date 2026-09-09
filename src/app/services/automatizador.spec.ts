import { TestBed } from '@angular/core/testing';

import { Automatizador } from './automatizador';

describe('Automatizador', () => {
  let service: Automatizador;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Automatizador);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
