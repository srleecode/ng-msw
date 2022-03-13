import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSharedComponentsHeaderShellModule } from '@srleecode/ng-shared/components/header/shell';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, NgSharedComponentsHeaderShellModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
