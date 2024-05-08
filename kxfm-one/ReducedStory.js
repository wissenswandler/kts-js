import { Story } from './Story.js'

export
class ReducedStory extends Story
{
  constructor( story, selected_entities, eventfilters = [] )
  {
    super( story, selected_entities )

    this.fullstory = story

    this.event_filters = eventfilters

    // now narrow the fields 
    this.entity_timelines = Object.fromEntries( this.entities_map.entries() ) // recreate the reduced timelines object
    this.calculate_entity_keys()
    this.harvest_story()  // depends on entity_keys, produces topics and events maps
    this.calculate_derived_fields( selected_entities )
  }
}
