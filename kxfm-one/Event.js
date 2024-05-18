import {  
          Logic }    from "@kxfm/one"

/*
 * Event := significant change of state, occuring at the intersection of 'space' (topic / place) and 'time' (date)
 * 
 * The date part is left very open: from non-existing to symbolic ('datish' but not a date) to chronological.
 * 
 * The date might also be not a point in time but an interval, within which the event is known to occur (certain_date_range). 
 * Typically this inverval is calculated from the context of a Story, i.e. from the closest dates of preceeding or succeeding Events.
 *
 * Event complies with Uncertainty Preserving Logic (UPL), which generally knows of three states: true, false or undefined (uncertain)
 */
export class Event
{
  constructor( key, certain_date_range = [undefined, undefined] )
  {
    /* hiding functions from being enumerable makes getters appear as undefined for D3 table input !! 
    Object.getOwnPropertyNames(this)
      .filter(p => typeof this[p] === 'function')
      .forEach
      ( f => 
        Object.defineProperty( this, f, { enumerable : false } )
      )
    */

    this.key = key
    this.certain_date_range = certain_date_range // for unit testing

    const tokens = key.split( '_' )

    this.topic = tokens[0]  // at the very least, each Event has a topic

    if(   tokens.length === 1 ) return  // if there is no datish part then we are done here
    ////////

    this.datish = tokens.slice( 1 ).join('-') // useful to keep, because it preserves the granularity of a date (e.g. only down to the month), whereas the Date class assumes precision down to (milli)seconds

    // if( tokens.length > 2 ) console.warn( `KTS Timelib warning (format < 4 ?): ${key} has more than one '_' delimiter. Splitting at the first one => ${this.topic}, ${this.datish} ` )

    const      date = new Date( this.datish )
    if( isNaN( date) ) // invalid
    {
      const      date_in_old_format = new Date( this.datish.replaceAll('_','-') )
      if( isNaN( date_in_old_format ) )
      {
        // perfectly allowed to have a datish component which is not a date at all
      }
      else
      {
        this.date = date_in_old_format
        this.datewarn = "date came in old format - this may not work in the future"
      }
    }
    else
    {
      this.date = date
    }
  }

  /* defining toString will allow Arrays or Sets of Events
   * to be sorted by date (more) automatically 
   */
  toString()
  {
    return this.approximateDate ? this.approximateDate.toISOString()+"__"+this.topic : this.key
  }
  
  /*
   * presentation helper, returns the 'date' part (without time) in ISO format (e.g. 1980-12-30), or 'undefined'
   */
  toISODatepart()
  {
    return this.date?.toISOString().slice(0,10) ?? undefined
  }
   
  // binary logic
  get isOpenToFuture    () { return this.certain_date_range[0] !== undefined && this.certain_date_range[1] === undefined }
  
  // binary logic
  get isOpenFromHistory () { return this.certain_date_range[0] === undefined && this.certain_date_range[1] !== undefined }
  
  // binary logic
  get isHalfOpen () { return this.isOpenFromHistory || this.isOpenToFuture  }
  
  // binary logic
  get isDateRangeClosed () { return this.certain_date_range[0] !== undefined && this.certain_date_range[1] !== undefined  }

  /*
   * UPL returns true / false / undefined
   */
  get isFuture ()  { return this.after_ (     Date .now()  ) }

  get isHistory () { return this.before_( new Date("1990") ) }

  // best guess for a sortable date
  get approximateDate () 
  { return this.date ? 
        this.date
        :
        this.isDateRangeClosed 
        ?
        new Date
        ( (
          this.certain_date_range[0].getTime()
          +
          this.certain_date_range[1].getTime()
          ) / 2
        )
        :
          this.isOpenFromHistory
          ?
          new Date( this.certain_date_range[1].getTime() - 1000 )
          :
          this.isOpenToFuture
          ?
          new Date( this.certain_date_range[0].getTime() + 1000 )
          :
          undefined
  }
  
  /* 
   * check UPL whether this Event occurs within the filter date_range
   * date_range is a 2-element array of "dates", where
   *  "date" must be a Date object OR a String that represents a valid Date OR empty strings
   *  an empty "date" string acts as a Null filter:
   *  (letting any date value pass, including 'undefined') 
   */
  within( date_range )
  {
    return ( //Logic.and
      this.after_ ( date_range[0] ) &&
      this.before_( date_range[1] )
    )
  }

  within_( date_range )
  {
    return (
    ! this.after ( date_range[1] )
    &&
    ! this.before( date_range[0] )
    )
  }
  
  /**
    * chronological comparisons in UPL; read "this Event occurs before / after that filter_date"
    *  "date" must be a Date object OR a String that represents a valid Date OR empty strings
    *  an empty "date" string acts as a Null filter:
    *  (letting any date value pass, including 'undefined') 
    * 
    * method variation with trailing underscore implements an inclusive filter
    */
  before ( filter_date ) {return  this._compare_to(  filter_date, (base, filter) => Logic.le( filter, base[0] ) === true ? false : Logic.lt( base[1], filter ) === true ? true : undefined  ) }
  before_( filter_date ) {return  this._compare_to(  filter_date, (base, filter) => Logic.lt( filter, base[0] ) === true ? false : Logic.le( base[1], filter ) === true ? true : undefined  ) }
  after_ ( filter_date ) {return  this._compare_to(  filter_date, (base, filter) => Logic.lt( base[1], filter ) === true ? false : Logic.le( filter, base[0] ) === true ? true : undefined  ) }
  after  ( filter_date ) {return  this._compare_to(  filter_date, (base, filter) => Logic.le( base[1], filter ) === true ? false : Logic.lt( filter, base[0] ) === true ? true : undefined  ) }

  _compare_to( filter_date, compare_fn, range_index )
  {
    if( filter_date === "" )      return true               // by convention we define an empty filter as not-filtering
    
    if
    (
      this.date === undefined 
      &&
      this.certain_date_range[0] === undefined
      &&
      this.certain_date_range[1] === undefined
    ) 
      return undefined
    
    if( typeof filter_date === 'string' ) filter_date = new Date( filter_date )

    return compare_fn
    (
      this.date
      ?
      [this.date, this.date]
      :
      this.certain_date_range
      ,
      filter_date
    )
  }

}
