import { Event      }    from "./Event.js"

// where Events live
export
class EventArena
{
  events = new Map()

  addEvent( event )
  {
    let result
    
    switch(  typeof( event )  )
    {
      case "string":
            result = this.getEvent( event )
        if( result )
        {
          //console.info( "KTS EventArena: exists " + event )
          return result
        }
        else
        {
          result = new Event( event )
          break; 
        }
      case "object":
            result = this.getEvent( event.key )
        if( result )
        {
          //console.info( "KTS EventArena: exists " + event.key )
          return result
        }
        else
        {
          result = event
          break;
        }
      default:
        throw( new Error( "KTS EventArena: invalid Event type " + typeof( event ) )  )
    }
    this.events.set( result.key, result )
    return result
  }

  getEvent = ( key ) => this.events.get( key )

  size = () => this.events.size
}
