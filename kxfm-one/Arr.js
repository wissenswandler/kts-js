import { and } from "./Logic.js"

export
const unique = (value, index, array) => array.indexOf(value) === index // to be used as convenient filter function

export
const are_equal = (...rest)        => equal(...rest)

export
const     equal = (...rest)        => eq   (...rest)

export
const     eq    = (array1, array2) =>
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

//
// mini unit tests
// MUST  =>  true
//
export const test = () =>
and
(
are_equal( [1], [1] )
  ,
    equal( [1], [1] )  
  ,
    eq   ( [1  ], [1  ] )  
  ,
  ! eq   ( [1  ], [2  ] )  
  ,
  ! eq   ( [1  ], [1,2] )  
  ,
  ! eq   ( [2  ], [1,2] )  
  ,
  ! eq   ( [1,2], [1  ] )  
  ,
  ! eq   ( [1,2], [2  ] )  
  ,
  eq   ( [1,2], [1,2] )  
)
