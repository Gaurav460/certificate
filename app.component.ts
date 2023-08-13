import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test';
  @ViewChild('svgElement', { static: true })
  svgElement!: ElementRef;
  private dragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;
 
// for dragging the svg

  startDrag(event: MouseEvent): void {
    this.dragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.dragOffsetX = this.svgElement.nativeElement.currentTranslate.x;
    this.dragOffsetY = this.svgElement.nativeElement.currentTranslate.y;
  }

  handleDrag(event: MouseEvent): void {
    if (!this.dragging) {
      return;
    }

    event.preventDefault();

    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;

    this.svgElement.nativeElement.setAttribute('transform', `translate(${this.dragOffsetX + deltaX}, ${this.dragOffsetY + deltaY})`);
  }

  endDrag(): void {
    this.dragging = false;
  }
  onWheel(event: WheelEvent) {
    event.preventDefault();

    const svgElement = event.currentTarget as HTMLElement;
    const currentScale = this.getScale(svgElement);

    const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1; // Adjust the zoom factor as desired

    const newScale = currentScale * scaleFactor;
    this.setTransform(svgElement, newScale);
  }

  private getScale(element: HTMLElement): number {
    const transform = window.getComputedStyle(element).transform;
    const matrix = transform.match(/^matrix\((.+)\)$/);
    if (matrix) {
      const values = matrix[1].split(', ');
      return parseFloat(values[0]);
    }
    return 1;
  }
  private setTransform(element: HTMLElement, scale: number) {
    element.style.transform = `scale(${scale})`;
  }
}
