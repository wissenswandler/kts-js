# Timelib: Event - Tests


## instances

```js echo
[... myStory.event_entity_map.keys()]
```

```js echo
new Set( myStory.events.keys())
```

```js echo
[... myStory.events.values()]
```

```js echo
[... myStory.events.values()].map( e=>e+"" ).filter( Arr.unique ).sort()
```

```js echo
dates_from_events = [ ...myStory.events.values() ].filter( e => e.date ).map( e => e.datish ).sort().filter( Arr.unique )
```

```js
Inputs.table
( 
  [... myStory.events.values()]
  ,
  {
    columns: ['topic','datish','date','certain_date_range', 'approximateDate', ] ,
    format: 
    {
      certain_date_range: c => 
        ( c[0] ?         c[0].toISOString().slice(0,10) + " < x" : "x" )
        +
        ( c[1] ? " < " + c[1].toISOString().slice(0,10) : "" )
    }
    ,
    sort: 'approximateDate', reverse: true
  }
)
```

## Imports


```js
import { myStory, Story } from "@bogo/timelib4"
```

## QA

```html
<style> div:has( > div.testresult ) {display:non} </style>
```

- - -

```js
event_test_keys = "TopicOnly ATopic_Z ATopic_Datish NewFormat_2024-03-29 OldFormat_2000_01 Historic_1990".split( ' ' )
```

```js echo
event_test_keys.map( e => new Event( e ) )
```

```js echo
event_test_keys.map( e => new Event( e ) + "" )
```

```js
event_test_keys.map( e => new Event( e ) ).sort()
```

```js
testArena = new EventArena()
```

```js
event_test_keys.forEach( e => testArena.addEvent( "Z"+e ) )
```

```js echo
viewof suite = createSuite()
```

### Integration Tests with complex Content (import myStory)

```js
suite.test( "Beyond2030 is future", () => {
expect
(
  myStory.getEvent( "Beyond2030" ).isFuture  
).toBe
(
  true
)
} )
```

```js
suite.test("AtlanticCrossing (in context) happens after 2017 (undefined)", () => {
expect
(
  myStory.events.get( "AtlanticCrossing" ).after_( "2017" )  
).toBe
(
  undefined
)
} )
```

```js
suite.test("AtlanticCrossing (in context) happens after (including) 2015-01-01", () => {
expect
(
  myStory.events.get( "AtlanticCrossing" ).after_( "2015" )  
).toBe
(
  true
)
} )
```

```js
suite.test("goal (in context) happens before 2051", () => {
expect
(
  myStory.events.get( "goal" ).before_( "2051" )  
).toBe
(
  true
)
} )
```

```js
suite.test("goal (in context) happens within '' and 2051", () => {
expect
(
  myStory.events.get( "goal" ).within( ["","2051"] )  
).toBe
(
  true
)
} )
```

```js
suite.test("goal (in context) happens within 2000 and ''", () => {
expect
(
  myStory.events.get( "goal" ).within( ["2000",""] )  
).toBe
(
  undefined
)
} )
```

```js
suite.test("goal (in context) happens within 1990 and 2000", () => {
expect
(
  myStory.events.get( "goal" ).within( ["1990","2000"] )  
).toBe
(
  undefined
)
} )
```

```js
suite.test("goal (in context) happens within 1990 and 2060", () => {
expect
(
  myStory.events.get( "goal" ).within_( ["1990","2000"] )  
).toBe
(
  true
)
} )
```

```js
suite.test("goal (in context) happens within 2060 and 2070", () => {
expect
(
  myStory.events.get( "goal" ).within( ["2060","2070"] )  
).toBe
(
  false
)
} )
```

```js
suite.test("Daysailing (in context) happens after 1980", () => {
expect
(
  myStory.events.get( "Daysailing" ).after_( "1980" )  
).toBe
(
  true
)
} )
```

```js
suite.test("Daysailing (in context) happens before 2000", () => {
expect
(
  myStory.events.get( "Daysailing" ).before_( "2000" )  
).toBe
(
  true
)
} )
```

```js
suite.test("Daysailing (in context) happens within 1990 and 2010", () => {
expect
(
  myStory.events.get( "Daysailing" ).within( ["1990","2010"] )  
).toBe
(
  true
)
} )
```

```js
suite.test( "all_entity_types", () => 
  expect
  (
    myStory.all_entity_types
  ).toEqual
  (
    ["UseCase", "Syntax_Error", "OU", "boat", "person", "dog", "skill"]
  )
)
```

```js
suite.test
( "group_entities_by_type", ()=>
 {
  myStory.get_topic_details() // initialize access to inner function 
  return expect
  (
    myStory.get_topic_details.group_entities_by_type
    (
      myStory.entity_keys
      ,
      myStory.entity_timelines 
    )
    .get("Syntax_Error")
  ).toEqual
  (
    ["ErrorEntity"]
  )
 }
)
```

```js
suite.test( "common_entities", () => 
  expect
  (
    myStory.common_entities( "AtlanticCrossing", "Daysailing" )
  ).toEqual
  (
    ["Boat", "sailing"]
  )
)
```

```js
suite.test( "compare array lengths ( all == keep_types + hide_types )", () => 
  expect
  (
    myStory.entity_keys.length
  ).toBe
  (
    myStory.keep_types( "person" ).length
    + 
    myStory.hide_types( "person" ).length
  )
)
```

```js
suite.test( "keep_types person", () => 
  expect
  (
    myStory.keep_types( "person" )
  ).toEqual
  (
    ["First_Owner", "Second_Owner"] 
  )
)
```

```js
suite.test( "number of all entities minus type person", () => 
  expect
  (
    myStory.hide_types( "person" ).length
  ).toBe
  (
    17
  )
)
```

```js
suite.test( "keep_types dog", () => 
  expect
  (
    myStory.keep_types( "dog" )
  ).toEqual
  (
    ["Dog"]
  )
)
```

```js
suite.test( "first_notice_of", () => 
  expect
  (
    myStory.first_notice_of( "Historic_Entity" )[0]
  ).toBe
  (
    "1990"
  )
)
```

### Integration Tests (require class Story, provide their own content)

```js
suite.test( "flavor 0 entries", () => expect
  (
    new Story( `
a - skill

b - skill

c - person
`
    ).get_flavour( 'notfound' )
  ).toEqual(
    ""
  )
)
```

```js
suite.test( "flavor 2 skills", () => expect
  (
    new Story( `
a - skill

b - skill

c - person
`
    ).get_flavour( 'skill' )
  ).toEqual(
    ", featuring a + b skills"
  )
)
```

```js
suite.test( "flavor 1 person", () => expect
  (
    new Story( `
a - skill

b - skill

c - person
`
    ).get_flavour( 'person' )
  ).toEqual(
    ", flavour: c"
  )
)
```

```js
suite.test( "flavor 2 people", () => expect
  (
    new Story( `
a - skill

b - skill

c - person

d - person
`
    ).get_flavour( 'person' )
  ).toEqual(
    ", featuring c + d"
  )
)
```

### Unit Tests for class Event (no dependencies outside this Notebook)

```js
Twentiethcentury = new Event( "20th Century", [new Date("1900"),new Date("2000")] )
```

```js
suite.test("something in the 20th century happens after 2001 (false)", () => {
expect
(
  Twentiethcentury.after_( "2001" )  
).toBe
(
  false
)
} )
```

```js
suite.test("something in the 20th century happens before 1950 (possible)", () => {
expect
(
  Twentiethcentury.before_( "1950" )  
).toBe
(
  undefined
)
} )
```

```js
suite.test("something in the 20th century happens after 1950 (possible)", () => {
expect
(
  Twentiethcentury.after_( "1950" )  
).toBe
(
  undefined
)
} )
```

```js
suite.test("something in the 20th century happens before 1899 (false)", () => {
expect
(
  Twentiethcentury.before_( "1899" )  
).toBe
(
  false
)
} )
```

```js
suite.test("something in the 20th century happens after 1899", () => {
expect
(
  Twentiethcentury.after_( "1899" )  
).toBe
(
  true
)
} )
```

```js
suite.test("undated happens after 2000 (undefined)", () => {
expect
(
  new Event( "undated" ).after_( "2000" )  
).toBe
(
  undefined
)
} )
```

```js
suite.test("undated happens before 2000 (undefined)", () => {
expect
(
  new Event( "undated" ).before_( "2000" )  
).toBe
(
  undefined
)
} )
```

```js
suite.test("adding Events as strings", () => {
  const arena = new EventArena()
  event_test_keys.forEach( e => arena.addEvent( e ) )
  expect(
  arena.size()
   ).toBe( event_test_keys.length );
} )
```

```js
suite.test("adding Events as objects", () => {
  const arena = new EventArena()
  event_test_keys.forEach( e => arena.addEvent( new Event(e) ) )
  expect(
  arena.size()
   ).toBe( event_test_keys.length );
} )
```

```js
suite.test("adding Event of type 'number' throws", () => { expect(
  () => {
  new EventArena.addEvent( 1 )
} ).toThrow();
} )
```

```js
suite.test("Event at 1990 within empty range", () => {
expect
(
  new Event( "a_1990" ).within( ["",""] )  
).toBe
(
  true
)
} )
```

```js
suite.test("Event at 1990 within 1900-2000", () => {
expect
(
  new Event( "a_1990" ).within( ["1900","2000"] )  
).toBe
(
  true
)
} )
```

```js
suite.test("Event at 1990 within 1990-1990 (very narrow)", () => {
expect
(
  new Event( "a_1990" ).within( ["1990","1990"] )  
).toBe
(
  true
)
} )
```

```js
suite.test("Event at 1990 within 1990-2000 (half narrow)", () => {
expect
(
  new Event( "a_1990" ).within( ["1990","2000"] )  
).toBe
(
  true
)
} )
```

```js
suite.test("Event at 1990 within 1990- (half open)", () => {
expect
(
  new Event( "a_1990" ).within( ["1990",""] )  
).toBe
(
  true
)
} )
```

```js
suite.test("Event at 2010 happens before ''", () => {
expect
(
  new Event( "a_2010" ).before_( "" )  
).toBe
(
  true
)
} )
```

```js
suite.test("Event at 1990 happens before 2000", () => {
expect
(
  new Event( "a_1990" ).before_( "2000" )  
).toBe
(
  true
)
} )
```

```js
suite.test("Event at 2010 happens before 2000 (false)", () => {
expect
(
  new Event( "a_2010" ).before_( "2000" )  
).toBe
(
  false
)
} )
```

```js
suite.test("Event at 2010 happens after 2000", () => {
expect
(
  new Event( "a_2010" ).after_( "2000" )  
).toBe
(
  true
)
} )
```

```js
suite.test("Event at 2010 happens after (INclusive) 2010", () => {
expect
(
  new Event( "a_2010" ).after_( "2010" )  
).toBe
(
  true
)
} )
```

```js
suite.test("Event at 2010 happens after (EXclusive) 2010", () => {
expect
(
  new Event( "a_2010" ).after( "2010" )  
).toBe
(
  false
)
} )
```

```js
suite.test("Event at 2010 happens before (INclusive) 2010", () => {
expect
(
  new Event( "a_2010" ).before_( "2010" )  
).toBe
(
  true
)
} )
```

```js
suite.test("Event at 2010 happens before (EXclusive) 2010", () => {
expect
(
  new Event( "a_2010" ).before( "2010" )  
).toBe
(
  false
)
} )
```
