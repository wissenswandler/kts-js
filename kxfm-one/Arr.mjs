export class Arr
{
  static are_equal = (array1, array2) =>
  (
    array1 === undefined
    ||
    array2 === undefined
  )
  ?
  false
  :   
   array1.length
   === 
   array2.length
   && 
   array1.every(  element => array2.includes( element )  )

}
