import { Injectable } from '@angular/core';
import { MatrixData } from './matrix.service';

export interface Term {
  termCoefficients: string[],
  result: string,
  costFunction: Boolean
}

export interface solvedResult {
  variable: string,
  result: string
}

export interface newTerm {
  value: number[];
}

@Injectable({
  providedIn: 'root'
})
export class CalculateService {

  public slackMatrix: Term[] = [];
  public terms: string[] = [];
  public numberOfConstraints: number = 0;
  public solvedArray = [];
  public gaußTerms = [];
  public resultValues: string[] = [];

  constructor() { }

  calculate(matrix: MatrixData[]) {
    this.getVariables(matrix);
  }

  getVariables(matrix: MatrixData[]) {
    this.numberOfConstraints = matrix.length - 1;

    // Constraints
    for (let i = 0; i < matrix.length; i++) {
      let tmpCoefficientArray = new Array();
      for (let coefficient in matrix[i].coefficients) {
        tmpCoefficientArray.push(matrix[i].coefficients[coefficient]);
      }
      // tmpCoefficientArray.push(matrix[i].result);
      let term: Term = {
        termCoefficients: tmpCoefficientArray,
        result: "",
        costFunction: false
      };
      this.slackMatrix.push(term);
    }
    this.addSlackVariables(this.numberOfConstraints);
    this.addResults(matrix);
  }

  addSlackVariables(length: number) {
    let constraintCount = 0;
    for (let i = 0; i <= length; i++) {
      // Adding slackvariables to costfunction
      if (this.slackMatrix[i].costFunction == true) {
        for (let a = 0; a < length; a++) {
          this.slackMatrix[i].termCoefficients.push("0");
        }
      }
      // Adding slackvariables to constraints
      else {
        for (let a = 0; a < length; a++) {
          if (a == constraintCount) {
            this.slackMatrix[i].termCoefficients.push("1");
          }
          else {
            this.slackMatrix[i].termCoefficients.push("0");
          }
        }
        constraintCount++;
      }
    }
  }

  addResults(matrix: MatrixData[]) {
    for (let i = 0; i < this.slackMatrix.length; i++) {
      this.slackMatrix[i].result = matrix[i].result;
    }
  }

  solve() {
    let solved = false;
    const tmpMatrix: newTerm[] = this.getNewMatrix();


    while (!solved) {
      const pivotRowIndex = this.getPivotRow(tmpMatrix);
      const pivotColumnIndex = this.getPivotColumn(tmpMatrix);
      const pivotElement = tmpMatrix[pivotRowIndex].value[pivotColumnIndex];
      this.dividePivotElement(tmpMatrix, pivotRowIndex, pivotElement);
      for (let i = 0; i < tmpMatrix.length; i++) {
        if (i == pivotRowIndex) {
          continue;
        }
        const factor = tmpMatrix[i].value[pivotColumnIndex];
        for (let a = 0; a < tmpMatrix[i].value.length; a++) {
          // Subtract pivotrowelements from rowelements
          tmpMatrix[i].value[a] = tmpMatrix[i].value[a] - (factor * tmpMatrix[pivotRowIndex].value[a]);
        }
      }
      const objectiveRow = tmpMatrix[tmpMatrix.length - 1];
      solved = !objectiveRow.value.some((element: any) => element > 0);
    }
    this.result(tmpMatrix);
  }

  getPivotRow(tmpMatrix: newTerm[]): number {
    // Get Pivot Row
    let constraintResults: number[] = [];
    for (let i = 0; i < tmpMatrix.length - 1; i++) {
      const resultNumber = tmpMatrix[i].value[tmpMatrix[i].value.length - 1];
      constraintResults.push(resultNumber);
    }
    // Index of most promising value of cost function
    const indexMostPromising = this.getPivotColumn(tmpMatrix);

    let mostPromisingValues: number[] = [];
    for (let i = 0; i < constraintResults.length; i++) {
      if(tmpMatrix[i].value[indexMostPromising] < 0 || constraintResults[i] == 0) {
        mostPromisingValues.push(Infinity);
      } else {
        const dividingFactor = tmpMatrix[i].value[indexMostPromising];
        mostPromisingValues.push(constraintResults[i] / dividingFactor);
      }
    }
    // Most limiting value of most promising value
    const mostLimitingValue = Math.min(...mostPromisingValues);
    const mostLimitingValueIndex = mostPromisingValues.indexOf(mostLimitingValue);
    return mostLimitingValueIndex;
  }

  getPivotColumn(tmpMatrix: newTerm[]): number {
    // String to number
    let pivotRowValues: number[] = [];
    for (let i = 0; i < tmpMatrix[tmpMatrix.length - 1].value.length; i++) {
      pivotRowValues.push(tmpMatrix[tmpMatrix.length - 1].value[i]);
    }
    // Most Promising value
    const mostPromisingValue = Math.max(...pivotRowValues);
    const indexMostPromising = tmpMatrix[tmpMatrix.length - 1].value.indexOf(mostPromisingValue);

    return indexMostPromising;
  }

  dividePivotElement(tmpMatrix: newTerm[], pivotRow: number, pivotElement: number) {
    for (let i = 0; i < tmpMatrix[pivotRow].value.length; i++) {
      tmpMatrix[pivotRow].value[i] = tmpMatrix[pivotRow].value[i] / pivotElement;
    }
  }

  getNewMatrix(): newTerm[] {
    let matrix: newTerm[] = [];
    for (let entry in this.slackMatrix) {
      let newRow: newTerm = {
        value: []
      }
      for (let i = 0; i < this.slackMatrix[entry].termCoefficients.length; i++) {
        const entryNumber = Number(this.slackMatrix[entry].termCoefficients[i])
        newRow.value.push(entryNumber);
      }
      const resultNumber = Number(this.slackMatrix[entry].result);
      newRow.value.push(resultNumber);
      matrix.push(newRow);
    }
    return matrix;
  }

  result(matrix: newTerm[]) {
    const start = matrix[0].value.length - matrix.length;
    const end = matrix[0].value.length
    let objectiveRow: number[] = []
    for (let i = 0; i < matrix[matrix.length - 1].value.length; i++) {
      objectiveRow.push(matrix[matrix.length - 1].value[i]);
    }
    let newRow = objectiveRow.slice(start, end);
    newRow = newRow.map(
      (val: any) => {
        const num = Math.abs(val);
        return num;
      });
    for (let i = 0; i < newRow.length - 1; i++) {
      this.resultValues.push("x" + i + " = " + newRow[i]);
    }
    this.resultValues.push("Res.:" + newRow[newRow.length - 1]);
  }
}

