export class Arr
{

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
// MUST log  true
//

console.log(   Arr.are_equal( [1], [1] )  )
console.log(   Arr.    equal( [1], [1] )  )
console.log(   Arr.eq   ( [1  ], [1  ] )  )
console.log( ! Arr.eq   ( [1  ], [2  ] )  )
console.log( ! Arr.eq   ( [1  ], [1,2] )  )
console.log( ! Arr.eq   ( [2  ], [1,2] )  )
console.log( ! Arr.eq   ( [1,2], [1  ] )  )
console.log( ! Arr.eq   ( [1,2], [2  ] )  )
console.log(   Arr.eq   ( [1,2], [1,2] )  )
