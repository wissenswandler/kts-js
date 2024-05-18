import { EventFilter } from './EventFilter.js'

export
class SharedEventFilter extends EventFilter
{
  constructor( diagram_toggles, only_shared_events )
  {
    super();
    this.diagram_toggles    = diagram_toggles 
    this.only_shared_events = only_shared_events
  }

  filter = ( event, story ) =>
    !this.diagram_toggles.includes( this.only_shared_events )
    ||
    story.event_entity_map.get( event )
    &&
    story.event_entity_map.get( event ).size > 1
  
  static filter = ( event, story ) =>
    !diagram_toggles.includes( only_shared_events )
    ||
    story.event_entity_map.get( event )
    &&
    story.event_entity_map.get( event ).size > 1
}
