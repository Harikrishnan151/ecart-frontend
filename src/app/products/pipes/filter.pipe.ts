import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(allProducts:any[],serchTerm:string,propsName:string): any[] {
    const result:any[]=[];
    if(!allProducts||serchTerm==''||propsName==''){
      return allProducts
    }
    allProducts.forEach((item:any)=>{
      if(item[propsName].trim().toLowerCase().includes(serchTerm.trim().toLowerCase())){
        result.push(item)
      }
      
    })
    return result;
  }

}
