  /*
   * preserve logic by returning true: if at least one operand is true
   * false: only if all operands are false
   * and undefined: otherwise (combinations of false und undefined, preserving uncertainty)
   *
   * note: works with any number of operands
   */
function or(...operands) // can handle any number of operands
{ return operands.length === 0 ? undefined :
  operands.reduce
    ( (acc,op)  =>
      acc == true || op == true // truthy values accepted
      ? 
      true // if either operand is true (5 cases)
      :
        acc === false && op === false // not falsy values because they include 'undefined'
        ?
        false // only if both operands are false (1 case)
        :
        undefined // 3 remaining cases involving 'undefined, false'
    )
}

  /*
   * preserve logic by returning true: only if all operands are true
   * false: if at least one operand is false
   * and undefined: otherwise (combinations of true and undefined, preserving uncertainty)
   *
   * note: works with any number of operands
   */
function and(...operands) // can handle any number of operands
{ return operands.length === 0 ? undefined :
    operands.reduce
    ( (acc,op)  =>
      acc == true && op == true // truthy values accepted
      ? 
      true // only if both operands are true (1 case)
      :
        acc === false || op === false // not falsy values because they include 'undefined'
        ?
        false // if either operand is false (5 cases)
        :
        undefined // 3 remaining cases involving 'undefined, true'
    )
}

function lt( ...operands ) // can handle any number of operands
{
  // wrapping an impl around the recursive implementation prevents Observable from mistaking recursion with circular definition
  function impl( ...operands )
  {
    return operands.length < 2 ? true :  // for the sake of recursion
    operands[0] === undefined || operands[1] === undefined
    ?
    undefined
    :
      operands[0] >= operands[1]
      ?
      false
      :
          impl( ...operands.slice(1)  )  // this comparison stage is true, now check for the remaining chain with tail recursion
  }
  return  impl( ...operands           )
}

function le(...operands) // can handle any number of operands
{
  // wrapping an impl around the recursive implementation prevents Observable from mistaking recursion with circular definition
  function impl( ...operands )
  {
    return operands.length < 2 ? true :  // every number or string is "less than or equal" to itself 
    operands[0] === undefined || operands[1] === undefined
    ?
    undefined
    :
      operands[0] > operands[1]
      ?
      false
      :
          impl( ...operands.slice(1)  )  // this comparison stage is true, now check for the remaining chain with tail recursion
  }
  return  impl( ...operands           )
}

function not(operand) // unary operation
{ return operand === undefined
    ?
    undefined
    :
    ! operand
}

export { and, or, lt, le }

//
// mini unit tests
// MUST  =>  true
//
export const test = () =>
and
(
  or(false    , undefined) === undefined
  ,
  or(true     , undefined) === true
  ,
  or(undefined, undefined) === undefined
)
