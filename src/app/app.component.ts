import { Component, OnInit } from '@angular/core';
import { ReadFileService } from './read-file.service';
import { MatSnackBar } from '@angular/material/snack-bar';

class ExcelModel{
  itemNumber: string | undefined;
  itemName: string | undefined;
  mrp: string | undefined;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  mainPage = true;
  backBtn = false;

  companyName: string | undefined;
  quotationNumber: string | undefined;
  date: string | undefined;


  excelModel : ExcelModel[] | undefined; 
  items: any[] = [];

  constructor(private excelService: ReadFileService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadExcelData();
  }

  loadExcelData(){
    this.excelService.readExcelData().then(data => {
      this.excelModel = data;
      console.log(this.excelModel.length)
    });
  }

  // onFileChange(event: any) {
  //   const file: File = event.target.files[0];
  //   let xx = this.excelService.readExcel(file);
  //   console.log(xx);
  // }

  selectOption(selectedItem: any, serialNumber: any) {
    let dataItemFound = this.excelModel?.find(data=>{
       return data.itemNumber === selectedItem.target.value;
    });

    console.log("dataItemFound")
    console.log(dataItemFound)

    this.items.forEach(data=>{
      if(data.serialNumber === serialNumber){
        data.itemNumber = dataItemFound?.itemNumber;
        data.itemName = dataItemFound?.itemName;
        data.quantity = 1;
        data.mrp = dataItemFound?.mrp;
        data.discount = 0;
        data.rate = dataItemFound?.mrp;
        data.value = dataItemFound?.mrp;
      }
    });

    // { serialNumber: 1, itemNumber: 'ABC123', itemName: 'Item 1', quantity: 5, mrp: 100, discount: 10, rate: 90, value: 450, remark: '' },
  
  }

  applyDiscount(discount: any, serialNumber: any){
    this.items.forEach(data=>{
      if(data.serialNumber === serialNumber){
        data.discount = discount.target.value;
        data.rate = data.mrp -  (data.mrp * discount.target.value)/100.00;
        data.value = data.rate * data.quantity ;
      }
    });
  }

  applyQuantity(quantity: any, serialNumber: any){
    this.items.forEach(data=>{
      if(data.serialNumber === serialNumber){
        data.quantity = quantity.target.value;
        data.value = data.rate * data.quantity * 1.0 ;
      }
    });
  }

  
  
  addItem() {
    this.items.push({
      serialNumber: this.items.length + 1,
      itemNumber: '',
      itemName: '',
      quantity: 0,
      mrp: 0,
      discount: 0,
      rate: 0,
      value: 0,
      remark: ''
    });
  }

  deleteItem(item: any) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  exportToExcel(){
    console.log("done")
    this.excelService.exportToExcel(this.companyName+"_" + this.quotationNumber + "_" + this.date, this.items);
  }



  showPreviousList(){
    this.mainPage = false;
    this.backBtn = !this.mainPage;
    this.getFilesName();
  }

  showMainPage(){
    this.backBtn = false;
    this.mainPage = !this.backBtn;
  }

  files = [];

  getFilesName(){
    this.excelService.getXlsxFilesInFolder().subscribe({
      next:(data: any)=>{
        console.log("data=================================>")
        console.log(data)
        this.files = data;
        this.files.sort();
      }
      ,error:(e)=>{
        console.log(e)
      }
    })
  }

  downLoadOneFileFromGithub(fileNameUrl: string){
    this.excelService.downloadFileFromGithub(fileNameUrl).subscribe({
      next: (data: any)=>{
        console.log(data.download_url)
        window.open(data.download_url, '_blank');
      },
      error: (e)=>{
        console.log(e);
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  openSnackBars(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000, // Duration in milliseconds
    });
  }

}
