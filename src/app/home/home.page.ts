import { Parser } from '@angular/compiler/src/ml_parser/parser';
import { Component } from '@angular/core';
import { CalculateService, Term } from '../Services/calculate.service';
import { MatrixData, MatrixService } from '../Services/matrix.service';
import { ParserService } from '../Services/parser.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public result: string[] = [];
  public matrix: MatrixData[] = [];
  public transposedMatrix: MatrixData[] = [];
  public matrixWithSlack: Term[] = [];
  private transposed: boolean = false;
  public resultValues: string[] = [];
  private matrixService: MatrixService;
  private parserService: ParserService;
  private calculateService: CalculateService;

  constructor() { }

  async onFileSelected(event) {
    try {
      this.result = [];
      this.matrix = [];
      this.transposedMatrix = [];
      this.matrixWithSlack = [];
      this.transposed = false;
      this.resultValues = [];
      this.matrixService = new MatrixService();
      this.parserService = new ParserService();
      this.calculateService = new CalculateService();
      const file: File = event.target.files[0];
      await this.parserService.readFileAsync(file).then((value) => {
        this.result = value;
        this.submit();
      });
    } catch (error) {
      throw error;
    }
  }

  submit() {
    this.matrixService.getMatrix(this.result);
    this.matrix = this.matrixService.matrix;
    if (this.matrixService.transposedMatrix.length > 0) {
      this.transposedMatrix = this.matrixService.transposedMatrix;
    }
    this.transposed = this.matrixService.isTransposed;
    this.calculate();
  }

  calculate() {
    if (this.transposed) {
      this.calculateService.calculate(this.transposedMatrix);
    }
    else {
      this.calculateService.calculate(this.matrix);
    }
    if (this.calculateService.slackMatrix.length > 0) {
      this.matrixWithSlack = this.calculateService.slackMatrix;
    }
    this.solve();
  }

  solve() {
    this.calculateService.solve();
    if (this.calculateService.resultValues.length > 0) {
      this.resultValues = this.calculateService.resultValues;
    }
  }
}
