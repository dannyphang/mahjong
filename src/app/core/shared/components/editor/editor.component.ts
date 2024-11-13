import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {
  @Input() editorModel: string = '';
  @Input() readOnly: boolean = false;
  @Input() editorFormControl: FormControl = new FormControl(this.editorModel);

  countTextLength(text: any) {
    console.log(text.textValue.length)
  }
}
