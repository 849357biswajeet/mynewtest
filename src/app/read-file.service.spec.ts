import { TestBed } from '@angular/core/testing';

import { ReadFileService } from './read-file.service';

describe('ReadFileService', () => {
  let service: ReadFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
