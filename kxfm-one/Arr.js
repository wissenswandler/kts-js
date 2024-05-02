import { and } from "./Logic.js"

export class Arr
{
  static unique = (value, index, array) => array.indexOf(value) === index // to be used as convenient filter function

  static are_equal = (...rest)        => this.equal(...rest)
  static     equal = (...rest)        => this.eq   (...rest)
  static     eq    = (array1, array2) =>
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

//
// mini unit tests
// MUST  =>  true
//
export const test = () =>
and
(
Arr.are_equal( [1], [1] )
  ,
    Arr.equal( [1], [1] )  
  ,
    Arr.eq   ( [1  ], [1  ] )  
  ,
  ! Arr.eq   ( [1  ], [2  ] )  
  ,
  ! Arr.eq   ( [1  ], [1,2] )  
  ,
  ! Arr.eq   ( [2  ], [1,2] )  
  ,
  ! Arr.eq   ( [1,2], [1  ] )  
  ,
  ! Arr.eq   ( [1,2], [2  ] )  
  ,
  Arr.eq   ( [1,2], [1,2] )  
)
