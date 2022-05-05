import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupMarcacao'
})
export class GroupMarcacaoPipe implements PipeTransform {

  transform(collection: any, property: string)  {

    if( !collection ) {
      return null;
    }

    const groupedCollection = collection.reduce((previous, current)=> {
      if(!previous[current[property]]) {
          previous[current[property]] = [current];
      } else {
          previous[current[property]].push(current);
      }
      return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    let array = Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
    array.sort( (a, b ):number =>{
      if( a.key > b.key )
        return 1
      if( a.key < b.key )
        return -1
      return 0; 
    } )
    // console.log(array);
    return array;
  }

}
