import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <div class="flex items-center gap-2.5 {{ className }}">
      <svg
        width="32"
        height="32"
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8 flex-shrink-0"
      >
        <path
          d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z"
          [attr.fill]="isLight ? '#FFFFFF' : '#192837'"
        />
      </svg>
      <span
        class="font-heading font-extrabold text-xl tracking-tight"
        [class.text-white]="isLight"
        [class.text-[#192837]]="!isLight"
      >
        Vyapar<span class="text-[#7342E2]">Sathi</span>
        <span class="text-xs px-2 py-0.5 rounded-full bg-[#7342E2]/20 text-[#7342E2] font-semibold uppercase tracking-wider">AI</span>
      </span>
    </div>
  `,
})
export class LogoComponent {
  @Input() className = '';
  @Input() isLight = false;
}
