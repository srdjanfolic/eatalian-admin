export function getFormData(object: any): FormData {
    const formData = new FormData();
    Object.keys(object).forEach(key => {

      if (typeof object[key] === 'object' && !(object[key] instanceof Blob)) {
        console.log(key);
        formData.append(key, JSON.stringify(object[key]));

      }
      else 
      formData.append(key, object[key]);
    }
    );
    return formData;
  }