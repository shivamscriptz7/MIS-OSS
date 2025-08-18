import { TestBed } from '@angular/core/testing';

import { RepoApiService } from './repo-api.service';

describe('RepoApiService', () => {
  let service: RepoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
