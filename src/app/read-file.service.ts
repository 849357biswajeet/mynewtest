// excel.service.ts

import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class ReadFileService {


  constructor(private http: HttpClient) { }

  public readExcelData(): Promise<any[]> {
    return this.http.get('assets/biswa.xlsx', { responseType: 'arraybuffer' })
      .toPromise()
      .then((buffer?: ArrayBuffer) => {
        const data: any[] = [];
        const workbook: XLSX.WorkBook = XLSX.read(buffer, { type: 'array' });
        const sheetName: string = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        XLSX.utils.sheet_to_json(worksheet, { raw: true }).forEach(row => data.push(row));
        return data;
      });
  }

  public readExcel(file: File): any[] {
    const reader: FileReader = new FileReader();
    let data: any[] = [];

    reader.onload = (e: any) => {
      const binaryString: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    };

    reader.readAsBinaryString(file);

    return data;
  }


  exportToExcel(fileName?: string, data?: any): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName ?? "DATA");
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = fileName + '.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
    // this.uploadFileToGitHub(fileName, data);
    this.uploadFileToGitHubs(fileName, data, "");
  }

  private uploadFileToGitHubs(fileName: string, file: Blob, directoryPath: string): void {
    const apiUrl = `https://api.github.com/repos/849357biswajeet/mynewtest/contents/mycontents/${fileName}.xlsx`;
    const headers = {
      'Authorization': 'token ' + environment.apiKey.replaceAll("asdfghjkl", "").replaceAll("3453453545353453534345534534534535353454353453", "") ,
      'Accept': 'application/vnd.github+json'
    };

    console.log("------------------------------ttttttt------------------------------------------->>")
    console.log(headers);
    console.log("------------------------------------------------------------------------->>")
    console.log(headers.Authorization);
    console.log("------------------------------------------------------------------------->>")
    console.log(environment.apiKey);



 // Read the Blob as a data URL
 const reader = new FileReader();
 reader.onload = () => {
     const fileContent = reader.result as string;

     // Construct the request body
     const body = {
         message: "Upload file via API",
         content: fileContent.split(',')[1], // Remove the data URL prefix
         encoding: 'base64'
     };

     // Make the PUT request to create or update the file
     this.http.put(apiUrl, body, { headers }).subscribe(
         response => {
             console.log('File uploaded successfully!', response);
         },
         error => {
             console.error('Error uploading file:', error);
         }
     );
 };
 reader.readAsDataURL(file);

  }



  getXlsxFilesInFolder(): Observable<string[]> {
    const apiUrl = `https://api.github.com/repos/849357biswajeet/mynewtest/contents/mycontents`;

    return this.http.get<any[]>(apiUrl).pipe(
      map(contents => {
        return contents
          .filter(content => content.type === 'file' && content.name.endsWith('.xlsx'))
          .map(content => content.name);
      })
    );
  }


  downloadFileFromGithub(filePath: string): Observable<ArrayBuffer> {
    const apiUrl = `https://api.github.com/repos/849357biswajeet/mynewtest/contents/mycontents/${filePath}`;

    return this.http.get<any>(apiUrl, { responseType: 'json' });
  }
  

}
