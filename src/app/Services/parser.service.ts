import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class ParserService {
  constructor() { }

  async readFileAsync(file) {
    try {
      let result: string[] = await this.processFile(file).then((response: string) => {
        const dataArray = this.prepareDisplay(response);
        return dataArray;
      });
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  processFile(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;
      reader.readAsText(file);

      const result = reader.result;

      setTimeout(() => {
        resolve(result);
      }, 1500);
    })
  }

  prepareDisplay(dataString: string): string[] {
    try {
      if (dataString) {
        var stringArray: string[] = dataString.trim().split(/[\n]/g).filter((x) => {
          return x.trim().length > 0
        });;
        return stringArray;
      }
    } catch (error) {
      throw error;
    }
  }
}


