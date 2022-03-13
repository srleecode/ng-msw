import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { MockResponse } from '@srleecode/ng-shared/ng-msw/domain/testing';
import { forkJoin, catchError, EMPTY, tap, mergeMap } from 'rxjs';

@Component({
  selector: 'test',
  templateUrl: './test.component.html',
})
export class TestComponent {
  list: string[] = [];

  constructor(private httpClient: HttpClient) {}

  endPointOne(): void {
    this.httpClient.get<MockResponse>('endpoint-one').subscribe((rsp) => this.list.push(rsp.data));
  }

  endPointTwo(): void {
    this.httpClient.get<MockResponse>('endpoint-two').subscribe((rsp) => this.list.push(rsp.data));
  }

  endPointThree(): void {
    this.httpClient.post<MockResponse>('endpoint-three', {}).subscribe((rsp) => this.list.push(rsp.data));
  }

  endPointFour(): void {
    forkJoin([
      this.httpClient.post<MockResponse>('endpoint-four', {}),
      this.httpClient.put<MockResponse>('endpoint-four', {}),
    ]).subscribe((rsp) => (this.list = this.list.concat(rsp.map((r) => r.data))));
  }

  endPointFive(): void {
    this.httpClient
      .get<MockResponse>('endpoint-five')
      .pipe(
        catchError(() => {
          this.list.push('caught error');
          return EMPTY;
        })
      )
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .subscribe(() => {});
  }

  endPointSix(): void {
    this.httpClient
      .get<MockResponse>('endpoint-six')
      .pipe(
        tap((rsp) => this.list.push(rsp.data)),
        mergeMap(() => this.httpClient.get<MockResponse>('endpoint-six'))
      )
      .subscribe((rsp) => this.list.push(rsp.data));
  }

  endPointSeven(): void {
    this.httpClient.get<MockResponse>('endpoint-seven').subscribe((rsp) => this.list.push(rsp.data));
  }

  endPointEight(): void {
    this.httpClient.get<MockResponse>('endpoint-eight/test').subscribe((rsp) => this.list.push(rsp.data));
  }
}

@NgModule({
  declarations: [TestComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [TestComponent],
})
export class TestModule {}
