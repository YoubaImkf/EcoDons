import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverEffect]' 
})
export class HoverEffectDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}


  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.05)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 10px 20px rgba(0, 0, 0, 0.2)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.3s, box-shadow 0.3s');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'none');
  }
}
