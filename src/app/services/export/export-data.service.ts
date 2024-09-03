import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { WorkBook, WorkSheet, utils, write } from 'xlsx';
@Injectable({
  providedIn: 'root',
})
export class ExportService {
  public exportExcel(jsonData: any[], fileName: string): void {
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws: WorkSheet = utils.json_to_sheet(jsonData);
    const wb: WorkBook = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer: any = write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveExcelFile(excelBuffer, fileName, fileType, fileExtension);
  }

  private saveExcelFile(
    buffer: any,
    fileName: string,
    fileType: string,
    fileExtension: string
  ): void {
    const data: Blob = new Blob([buffer], { type: fileType });
    saveAs(data, fileName + fileExtension);
  }
}
