import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  // @ts-ignore
  @Input('appTooltip') tooltipText: string;

  // @ts-ignore
  private tooltipElement: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.showTooltip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hideTooltip();
  }

  private showTooltip() {
    if (!this.tooltipElement) {
      this.tooltipElement = this.renderer.createElement('div');
      this.tooltipElement.textContent = this.tooltipText;
      this.tooltipElement.className = 'tooltip';
      this.renderer.appendChild(document.body, this.tooltipElement);

      // Get button position
      const buttonRect = this.el.nativeElement.getBoundingClientRect();

      // Calculate tooltip position above the button
      const tooltipTop = buttonRect.top + this.tooltipElement.offsetHeight -80; // Adjust for spacing
      const tooltipLeft = buttonRect.left + (buttonRect.width - this.tooltipElement.offsetWidth) / 4;

      this.tooltipElement.style.top = `${tooltipTop}px`;
      this.tooltipElement.style.left = `${tooltipLeft}px`;
    }
  }

  private hideTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      // @ts-ignore
      this.tooltipElement = null;
    }
  }
}
