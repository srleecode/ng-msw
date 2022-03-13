import { Component, Inject, Renderer2 } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HeaderStoreService } from '@srleecode/ng-shared/components/header/application';

@Component({
  selector: 'ng-shared-components-header-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  providers: [HeaderStoreService],
})
export class ShellComponent {
  isLightTheme = true;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private storeService: HeaderStoreService
  ) {
    this.storeService.loadTheme();
  }

  toggleTheme(): void {
    this.isLightTheme = !this.isLightTheme;
    if (!this.isLightTheme) {
      this.renderer.addClass(this.document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(this.document.body, 'dark-theme');
    }
  }
}

@NgModule({
  declarations: [ShellComponent],
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatSlideToggleModule],
  exports: [ShellComponent],
})
export class NgSharedComponentsHeaderShellModule {}
