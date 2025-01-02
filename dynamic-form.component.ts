import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  template: `
    <div *ngIf="form">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div formArrayName="fields">
          <div *ngFor="let field of form.controls['fields'].controls; let i = index" [formGroupName]="i">
            <div *ngIf="field.controls['type'].value === 'text'">
              <label>{{ field.controls['label'].value }}:</label>
              <input formControlName="value" />
            </div>

            <div *ngIf="field.controls['type'].value === 'dropdown'">
              <label>{{ field.controls['label'].value }}:</label>
              <select formControlName="value">
                <option *ngFor="let option of field.controls['options'].value" [value]="option">{{ option }}</option>
              </select>
            </div>

            <div *ngIf="field.controls['type'].value === 'checkbox'">
              <label>{{ field.controls['label'].value }}:</label>
              <input type="checkbox" formControlName="value" />
            </div>

            <div *ngIf="field.controls['type'].value === 'radio'">
              <label>{{ field.controls['label'].value }}:</label>
              <div *ngFor="let option of field.controls['options'].value">
                <input type="radio" formControlName="value" [value]="option" /> {{ option }}
              </div>
            </div>
          </div>
        </div>

        <button type="submit" [disabled]="form.invalid">Submit</button>
      </form>
    </div>
  `,
})
export class DynamicFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fields: this.fb.array([]),
    });

    this.loadForm();
  }

  // Example configuration for dynamic form fields
  loadForm() {
    const formFields = [
      { type: 'text', label: 'Name', value: '', required: true },
      { type: 'dropdown', label: 'Country', options: ['USA', 'Canada', 'Mexico'], value: '', required: true },
      { type: 'checkbox', label: 'Agree to terms', value: false, required: true },
      { type: 'radio', label: 'Gender', options: ['Male', 'Female'], value: '', required: true },
    ];

    const formArray = this.form.controls['fields'] as FormArray;

    formFields.forEach((field) => {
      const fieldGroup = this.fb.group({
        type: [field.type],
        label: [field.label],
        value: [field.value, field.required ? Validators.required : []],
        options: [field.options || []],
      });

      formArray.push(fieldGroup);
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    }
  }
}
