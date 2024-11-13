import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[onlyNumber]',
  standalone: true,
})
export class OnlyNumberDirective {
  numberPattern: string = '^[0-9]*$';
  numberRegEx: RegExp = new RegExp(this.numberPattern);

  @Input() onlyNumber: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const ctrlOrMetaKey = event.ctrlKey || event.metaKey;
    const key = event.key;
    if (this.onlyNumber) {
      if (
        // Allow: Ctrl+A
        (key === 'a' && ctrlOrMetaKey) ||
        // Allow: Ctrl+C
        (key === 'c' && ctrlOrMetaKey) ||
        // Allow: Ctrl+V
        (key === 'v' && ctrlOrMetaKey) ||
        // Allow: Ctrl+X
        (key === 'x' && ctrlOrMetaKey) ||
        // Allow: Backspace, Delete, Tab, Escape, Enter, Home, End, ArrowLeft, ArrowRight
        key === 'Backspace' ||
        key === 'Delete' ||
        key === 'Tab' ||
        key === 'Escape' ||
        key === 'Enter' ||
        key === 'Home' ||
        key === 'End' ||
        key === 'ArrowLeft' ||
        key === 'ArrowRight'
      ) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if (!this.validateValue(key)) {
        event.preventDefault();
      }
    }
  }

  @HostListener('paste', ['$event']) onPaste(e: any) {
    if (this.onlyNumber) {
      const value = e.clipboardData.getData('text/plain');
      if (!this.validateValue(value)) {
        e.preventDefault();
      }
    }
  }

  validateValue(value: string): boolean {
    return this.numberRegEx.test(value);
  }
}
