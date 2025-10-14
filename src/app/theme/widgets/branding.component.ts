import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <a class="branding" href="/">
      <img src="images/logo-dark2.png" class="branding-logo" alt="logo" />
      @if (showName) {
        <span class="branding-name">
           <span class="in-part">In</span><span class="trainor-part">Trainor</span>
        </span>

      }
    </a>
  `,
  styles: `
    .branding {
      display: flex;
      align-items: center;
      margin: 0 0.1rem;
      text-decoration: none;
      white-space: nowrap;
      color: inherit;
      border-radius: 50rem;
    }

    .branding-logo {
      width: 3rem;
      height:3rem;
      border-radius: 0.5rem;
    }
.branding-name {
  margin: 0 0.5rem;
  font-size: 1rem;
  font-weight: 500;
}

.in-part {
  color: black;
}

.trainor-part {
  color: #eb550b;
}

  `,
  standalone: true,
})
export class BrandingComponent {
  @Input() showName = true;
}
