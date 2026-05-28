import { TestBed } from '@angular/core/testing';

import { Nft } from './nft';

describe('Nft', () => {
  let service: Nft;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Nft);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
