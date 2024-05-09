import { EventFilter } from './EventFilter.js'

export
class DaterangeFilter extends EventFilter
{
  constructor( date_range )
  {
    super()

    this.date_range = date_range
  }
  filter( event, story )
  {
    return story.getEvent( event ).within( this.date_range ) // NOTE: when the function "filter" is passed as an argument, then "this" may be undefined and is certainly not bound to "this" class context. Only when called as a method on class DaterangeFilter, then "this" is bound and works as expected
  }
}

