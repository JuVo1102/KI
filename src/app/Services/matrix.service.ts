import { Injectable } from '@angular/core';

export interface MatrixData {
  coefficients: string[]
  result: string
}

@Injectable({
  providedIn: 'root'
})
export class MatrixService {

  public matrix: MatrixData[] = [];
  public transposedMatrix: MatrixData[] = [];
  public isMaxTask: boolean;
  public isTransposed: boolean = false;;

  constructor() { }

  getMatrix(stringarray: string[]) {
    const variableArray = this.getVariables(stringarray);

    for (let i = 1; i <= variableArray.length - 1; i++) {
      this.fillMatrixRows(variableArray[i]);
    }
    this.fillMatrixRows(variableArray[0]);
    if (this.isMaxTask == false) {
      this.transposeMatrix();
    }
  }

  getVariables(stringarray: string[]) {
    try {
      var result = []
      for (let dataString of stringarray) {
        if (dataString === stringarray[0] || dataString === stringarray[2]) {
          continue;
        }
        const variables = dataString.trim().split(/[ ;]/g).filter((x) => {
          return x.trim().length > 0;
        });
        result.push(variables);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  fillMatrixRows(variableArray: string[]) {
    let quantities: string[] = [];
    let matrixData: MatrixData = {
      coefficients: [],
      result: ""
    };
    for (let dataSnippet of variableArray) {

      if (dataSnippet == "+") {
        continue;
      }

      if (dataSnippet == "min:") {
        this.isMaxTask = false;
        continue;
      }

      if (dataSnippet == "max:") {
        this.isMaxTask = true;
        continue;
      }

      const variableRegex = new RegExp(/([0-9]){1,3}[*]([x][0-9]{1,3})/g);
      if (variableRegex.test(dataSnippet)) {
        const temp = dataSnippet.trim().split(/[*]/g).filter((x) => {
          return x.trim().length > 0;
        });
        quantities.push(temp[0]);
      }

      const resultRegext = new RegExp(/([0-9.]{1,3})/)
      if (dataSnippet.length >= 1 && dataSnippet.length <= 3 && resultRegext.test(dataSnippet)) {
        matrixData.result = dataSnippet;
      }
    }
    matrixData.coefficients = quantities;
    if (matrixData.result == "") {
      matrixData.result = "0";
    }
    this.matrix.push(matrixData);
  }

  transposeMatrix() {
    let transposedMatrix: MatrixData[] = []
    for (let coefficient in this.matrix[0].coefficients) {
      let matrixData: MatrixData = {
        coefficients: [this.matrix[0].coefficients[coefficient]],
        result: ""
      };
      transposedMatrix.push(matrixData);
    }

    for (let i = 0; i <= this.matrix.length - 1; i++) {
      if (i == 0) {
        let matrixData: MatrixData = {
          coefficients: [this.matrix[i].result],
          result: ""
        };
        transposedMatrix.push(matrixData);
      }
      if (i == this.matrix.length - 1) {
        transposedMatrix[transposedMatrix.length - 1].result = this.matrix[i].result;
      }
      if (i != 0 && i != this.matrix.length - 1) {
        transposedMatrix[transposedMatrix.length - 1].coefficients.push(this.matrix[i].result);
      }
    }

    for (let i = 1; i < this.matrix.length - 1; i++) {
      let transposedMatrixIndex = 0;
      for (let coefficient in this.matrix[i].coefficients) {
        transposedMatrix[transposedMatrixIndex].coefficients.push(this.matrix[i].coefficients[coefficient]);
        transposedMatrixIndex = transposedMatrixIndex += 1;
      }
    }
    if (this.matrix.length > transposedMatrix[0].coefficients.length) {
      let index = 0;
      for (let coefficient in this.matrix[this.matrix.length - 1].coefficients) {
        transposedMatrix[index].result = this.matrix[this.matrix.length - 1].coefficients[coefficient];
        index++;
      }
    }
    this.isTransposed = true;
    this.transposedMatrix = transposedMatrix;
  }
}
