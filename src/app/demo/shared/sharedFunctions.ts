import { FormControl } from "@angular/forms";

export function getFormData(object: any): FormData {
    const formData = new FormData();
    Object.keys(object).forEach(key => {

      if (typeof object[key] === 'object' && !(object[key] instanceof Blob)) {

        formData.append(key, JSON.stringify(object[key]));

      }
      else 
      formData.append(key, object[key]);
    }
    );
    return formData;
  }

  export function noWhitespaceValidator(control: FormControl) {
    let value = "";
    if (control.value) {
      value = control.value.toString();
    }
    const isWhitespace = value.trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }