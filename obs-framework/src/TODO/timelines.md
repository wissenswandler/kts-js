```js
title = md`# Timelines of Boran + Friends
## Thank you for joining me on this amazing journey, dear Friends!`
```

```js
notes
```

```js
viewof date_range = create_daterange_input
( [
    new Date( new Date().setDate( new Date().getDate()-6 ) ).toISOString().slice(0,10),
    new Date(                                              ).toISOString().slice(0,10),
  ]
)
```

```js
episodes_input = htl.html`
<details>
  <summary>select episode</summary>
  ${bumper}
  <div style="margin: 12px" />
  ${viewof project_lod}
</details>
`
```

```js
vistop = 
{
  diagram;
  
  const div = html`<div> </div>`;
  const observer = new IntersectionObserver
  ( entries =>
  {
    const entry = entries.pop();
    
    if( entry.isIntersecting  ) // vistop visible
    {
      set_input_value( viewof helpers_visible, "top", '+' )
    }
    else                      // vistop has been pushed or scrolled out of view
    {
      set_input_value( viewof helpers_visible, "top", '-' )
    }
  } )

  const element = 
    div
    //document.querySelector( "#time_future_arrow" ) // bugs in Chrome and FF seem to prevent this sub-SVG element to be ovbserved: https://issues.chromium.org/issues/40627467
  
  if( element )
    observer.observe ( element ); //
  else
    return "ERROR: could not select element to be observed"
    
  invalidation.then(() => observer.disconnect());
  
  return div;
}
```

```js
diagram = 
  renderer_choice === "KTS-Dot" 
  ?
  dot2svg(  dot_string  )
  :
  animation_container
```

```js
htl.html`<div class="time_controls">
${Inputs.button
(
  "zoom out", {reduce: ()=> bump_date_range() }
)}
${Inputs.button
(
  "shift sooner", { reduce: ()=>shift_date_range(), disabled: visible_index_range[0] === 0 }
)}
</div>
<style>
  .time_controls form {float: right; width: unset; display: inline-block}
  body > div > div:has( .time_controls form ) {float: right}
</style>
`
```

```js
visbot = 
{
  const div = html`<div> </div>`;
  const observer = new IntersectionObserver
  ( entries =>
  {
    const entry = entries.pop();
    
    if( entry.isIntersecting  ) // visbot visible
    {
      set_input_value( viewof helpers_visible, "bot", '+' )
    }
    else                      // visbot has been pushed out of view
    {
      set_input_value( viewof helpers_visible, "bot", '-' )
    }
  } )
  observer.observe(div);
  invalidation.then(() => observer.disconnect());
  return div;
}
```

```js
viewof diagram_toggles
```

```js
myStory.create_type_buttons( viewof selected_entities, selected_entities, 9 )
```

```js
quick_select_buttons = Inputs.button
( 
  [
    [ "none", () => set_input_value( viewof selected_entities, [] ) ]
    ,
    [  "all", () => set_input_value( viewof selected_entities,  myStory.entity_keys ) ]
  ]
)
```

```js
viewof selected_entities = myStory.create_grouped_input()
```

```js
create_button_to_apply_visible_entities_as_new_filter( viewof selected_entities, myReducedStory )
```

```js
bookmark_current
```

```js
viewof renderer_choice = Inputs.radio( ["KTS-Dot", "Ani-Dot"], {value:"Ani-Dot", label:"Layout Engine"} )
```

```js
viewof observe_diagram_range = Inputs.radio
( 
  ["grow","shift","don't"], 
  {
    label:"EXPERIMENTAL: automatically..." , 
    value:"don't", 
    format: v=> { return {'grow':"grow",'shift':"endless scroll","don't":"don't scroll"}[v] } 
  } 
)
```

```js
curtain = md`- - -

- - -`
```

```js
ktsconsole = kts_console
```

```js
intersection_init =
{
  diagram
  switch( helpers_visible.length )
  {
    case 2:                             // both helpers visible (== small diagram)
      switch( observe_diagram_range )
      {
        case "shift": // continue growing while both helpers are visible
        case "grow":
          bump_date_range()
          yield "growing"
          break;
      }
      break;
    case 1:
      if( observe_diagram_range === "shift" )
      {
        if( helpers_visible.includes("bot") )
        {
          shift_date_range()
          yield "shifting to a sooner timerange"
        }
      }
      else
        yield "pausing"
      break;
    case 0:
      yield "pausing"
  }
}
```

```js
viewof helpers_visible = Inputs.checkbox( ["top","bot"], {label: "visible helpers"} )
```

```js
viewof project_lod
```

```js
bumper = Inputs.button(
[
  [ "previous life",()=>{set_date_range(  viewof date_range, [""          , "2020-05-08" ] ); all_entities() }
  ],
  [ "Sweden 1",  ()=> { set_date_range (  viewof date_range, ["2020-05"   , "2021-09-27" ] ); all_entities() }
  ],
  [ "Sailing 1", ()=> { set_input_value(  viewof project_lod, 'full description' );
                        set_date_range (  viewof date_range, ["2021-09-27", "2021-11-05" ] ); all_entities() } 
  ],
  [ "Sweden 2", ()=>  { set_date_range (  viewof date_range, ["2021-11-05", "2022-05"    ] ); all_entities() } 
  ],
  [ "Sailing 2", ()=> { set_date_range (  viewof date_range, ["2022-05"   , "2022-10-10" ] ); all_entities() } 
  ],
  [ "Sailing *", ()=> { set_input_value(  viewof project_lod, 'full description' );
                        set_date_range (  viewof date_range, ["",  ""] );
                        set_input_value(  viewof diagram_toggles, [only_shared_events], '+' );
                        set_input_value(  viewof selected_entities, "Boran,Volker,Dotterbart,Torbj%C3%B6rn,Blue_Nose,Miss_Blue,Vega,Grayhound,Art,Maru,Sweden_2021f_boat,Denmark_2021,Denmark_2022,Netherlands,Belgium,France_2022".split(',')  );
                      }
  ],
  [ "2023", ()=>      { set_date_range (  viewof date_range, ["2023",     "2024"] ); all_entities() }
  ],
  [ "2024", ()=>      { set_date_range (  viewof date_range, ["2024",     "2025"] ); all_entities() }
  ],
  [ "last 7 d", ()=>  { set_date_range (  viewof date_range,
    [
      new Date( new Date().setDate( new Date().getDate()-6 ) ).toISOString().slice(0,10),
      new Date(                                              ).toISOString().slice(0,10),
    ] );
                       all_entities() 
                      }
  ],
  [  "+ future", ()=> { set_date_range (  viewof date_range, [date_range[0],""] ); all_entities() } ],
  [  "ALL (!)",  ()=> { set_date_range (  viewof date_range, ["",""] ); all_entities() }  ],
]
)
```

```js
function set_date_range( date_view, range_array )
{
  set_input_value(  date_view, range_array )  
  open_details(     date_view )
  set_input_value( viewof observe_diagram_range, "don't" )

  function open_details( html_element ) { html_element.querySelector("span>details").open = true }
}
```

```js
function all_entities() { set_input_value( viewof selected_entities,  myStory.entity_keys ) }
```

```js
visco_buttons_Fe
```

```js
all_dates = [... new Set( [... myReducedStory.events.values()].filter( e=>e.date ).map( e=>e.datish.replaceAll('_','-') ).sort() )]
```

```js
visible_dates = [... new Set( [... myReducedStory.events.values()].filter( e => myReducedStory.is_event_visible(e.key) ).filter( e=>e.date ).map( e=>e.datish.replaceAll('_','-') ).sort()  )]
```

```js
visible_range = [visible_dates[0], visible_dates[visible_dates.length-1] ]
```

```js
visible_index_range = visible_range.map( d => all_dates.indexOf( d ) )
```

```js
extended_index_range = 
[
  Math.max( visible_index_range[0]-1, 0                  ), 
  Math.min( visible_index_range[1]+1, all_dates.length-1 ),
]
```

```js
shifted_index_range = 
[
  Math.max( visible_index_range[0]-1, 0 ), 
  Math.max( visible_index_range[1]-( date_range[1]==="" ? 0 : 1 ), // if the upper range limit had been open, use the newest date index
                                      5 ), // keep 5 dates in the range when we hit the lower boundary
]
```

```js
extended_date_range = extended_index_range.map( i => all_dates[i] )
```

```js
mutable shifted_date_range = shifted_index_range.map( i => all_dates[i] )
```

```js
visible_dates1 = [... new Set( [... myReducedStory.events.values()].filter( e => e.within( extended_date_range ) ).filter(e=>e.date).map( e=>e.toISODatepart() ).sort()  )]
```

```js
bump_date_range = () => 
{
  if( diagram.clientHeight < maximum_height )
  {
    const new_range = Array.from( extended_date_range )
    date_range.forEach( (e,i) => { if( e==="" ) new_range[i]="" } ) // don't overwrite an "open" end
    set_input_value( viewof date_range, new_range )
  }
}
```

```js
shift_date_range = () => 
{
  if( visible_index_range[0] === 0 )
    set_input_value( viewof observe_diagram_range, "don't" )
  else
    set_input_value( viewof date_range, shifted_date_range )
}
```

```js
maximum_height = 1200
```

```js
diagram_toggles
```

```js
dot_string = new StoryToDotRenderer( myReducedStory ).toString()
```

```html
<style>

  /*
  body > div > div:has( > form > label )
  { float: right }

  body > div > div:has( details )
  { clear:both }
  */
  
</style>
```

```js
event_inspector = myStory.getEvent( event_inspector_input )
```

```js
viewof event_inspector_input = Inputs.text( {label: "Inspect Event"} )
```

## Appendix

### textual definition of story + event details

```js
this_particular_diagram = "This particular diagram shows Boran's journey with an emphasis on events after 2019."
```

```js
myStory = new Story( `

Max Munich_1988 Munich_1992 Bertilstorp_2020_11 Kalmar_2021_02 - person

Susanne Munich_1992 Dießen_1997 kase_2020_07 Blankaholm Ijmuiden Scheveningen_2022_09_10 Berlin Treguer_2023_05_11 
Peenemünde_2023_08_04x
Lagos_2023_12_28 Lagos_2024_02_10
Cadiz_2024_03
Cadiz_2024_b
- person

Wolfgang Munich_1992 Dießen_1997 
Starnberg_2009
Lenggries_2013 Lenggries_2015 Lenggries_2020_05_02 - person

Tina Munich_1992 Dießen_1997 
Starnberg_2009
Lenggries_2013 Lenggries_2015 Lenggries_2020_05_02 - person

Mona Munich_1992 Bertilstorp_2020_11 Kalmar_2021_02 - person

Katerina Lenggries_2013 Lenggries_2015 Lenggries_2020_05_02 Bertilstorp_2020_11 Lenggries_2021_08 Lenggries_2021_10 Simrishamn_2022_03 Lenggries_2022_12 - person

Michael Heidelberg_2011 Frankfurt_2022_11 Andorra - person

Josef Lenggries_2013 Lenggries_2015 Lenggries_2020_05_02 Lenggries_2021_08 Lenggries_2022_12 - person

Frank Lenggries_2015 Lenggries_2020_05_02 Lenggries_2021_08 Simrishamn_2022_03 Lenggries_2022_12 - person

Lena Lenggries_2015 Bertilstorp_2021_04 Urshult_2021_05 Urshult_2021_06 Simrishamn_2021_12 - person

Gepebba Segelstorp Skillinge_2020_09 Segelstorp_2022_06_08 - rdfType: person, rdfDescription: Ebba, Patrick + family

Pierre kase_2020_05_19 kase_2020_07 Kaseberga_2022_05_30 - rdfType: person, rdfDescription: Pierre and the other pilots from Kaseberga

Thomas kase_2020_05_19 kase_2020_07 Bertilstorp_2020_11 Simrishamn_2022_03 - person

Kim kase_2020_05_19 Are - rdfType: person, edge: color=coral 

Wotan Stockholm Bertilstorp_2020_11 Ural - rdfType: person, rdfDescription: Julia + Mark onboard Wotan, labelPrefix: 🚚

Mohini Bertilstorp_2020_11 Bertilstorp_2021_04 Urshult_2021_05 Simrishamn_2021_11_05 Simrishamn_2021_12 Simrishamn_2022_03 Simrishamn_2022_05 - person

Christian Bertilstorp_2020_11 Bertilstorp_2021_04 Urshult_2021_05 Simrishamn_2021_11_05 Simrishamn_2021_12 Simrishamn_2022_03 Simrishamn_2022_05 - person

Obi Bertilstorp_2020_11 Bertilstorp_2021_04 Urshult_2021_05 Simrishamn_2021_11_05 Simrishamn_2021_12 Simrishamn_2022_03 Simrishamn_2022_05 - rdfType: person, edge: color=brown

Naghmeh Göteborg_2021 Göteborg_2022_06_30 - rdfType: person, edge: color=pink

Alex Bertilstorp_2021_04     Urshult_2021_05 Urshult_2021_06 - person

Viktorya Bertilstorp_2021_04 Urshult_2021_05 Urshult_2021_06 - person

Myra                    Urshult_2021_05 Urshult_2021_06 - person

Johanna Bertilstorp_2021_04  Urshult_2021_05 Öland_2021_05_04 Öland_2021_09 - person 

Alejandro                               Urshult_2021_06 Simrishamn_2021_12 - person

Volker Öland_2021_09 - boat

Dotterbart Kalmar_2021_09_21 - boat

Jon Simrishamn_2021_11_05 Simrishamn_2021_12 Simrishamn_2022_03 Simrishamn_2022_05 - person

Holger Simrishamn_2021_12 Simrishamn_2022_03 Simrishamn_2022_05 - person

Carna Simrishamn_2021_12 Simrishamn_2022_03 Bornholm Simrishamn_2022_05 - person

Kristina Simrishamn_2021_12 Simrishamn_2022_03 Simrishamn_2022_05 Ystad - person

Joanna Simrishamn_2021_11_05 Simrishamn_2021_12 Simrishamn_2022_03 Simrishamn_2022_05 Göteborg_2022_06_30 - person

Roland Simrishamn_2022_03 Simrishamn_2022_05 Kaseberga_2022_05_30 - person

Johann Simrishamn_2022_03 Simrishamn_2022_05 - person

Lies Oostende_2022_07 Hanstholm Faröer Oostende_2022_09_13 Dunkerque_2022_09_17 Camaret_2022_10_10 Iceland Lagos_2024_02_10 - rdfType: person, edge: color=orange

Maria  Hanstholm - person

George Hanstholm - person

Jesper Hanstholm - person

Jan    Hanstholm - person

Torbjörn Hanstholm - boat

Blue_Nose haho_2022_08 Thyborøn HvideSande - boat

Miss_Blue Scheveningen_2022_09_10 Cherbourg_x1 Cherbourg_x2 Camaret_2022_10_10 Biscay_2022_12 Valencia_2023_04 - boat

Vega Cherbourg_x1 Guernsey Camaret_2022_10_10 Brest Biscay_2023_04 Porto_2023_05 - boat

Fanny Camaret_2022_10_10 Camaret_2023_03 Camaret_2023_04 - person

Michel Camaret_2022_10_10 Camaret_2023_01 Camaret_2023_03 Camaret_2023_04 - person

Filemon Camaret_2022_10_10 Biscay_2022_12 Camaret_2023_01 Douarnenez_2023_03 Falmouth_2023_04 - person

Grayhound Douarnenez_2023_03 Falmouth_2023_04 - boat

LaTerrible Camaret_2023_01 Camaret_2023_03 Camaret_2023_04 - rdfType: place, rdfLabel: La Terrible, labelPrefix: ☕, rdfDescription: place and people of the wonderful café

Sylvain Camaret_2023_03 Parking_2023_05_05 - person

Kila Camaret_2023_03 Camaret_2023_04 - person

Julien Camaret_2023_05_07 - person

Sweden_2020f ${se_2020f.join(' ')} Öland_2021_09 Kalmar_2021_09_21 - rdfType: visit, labelPrefix: 🇸🇪, edge: color="yellow;0.5:deepskyblue" penwidth=1

Sweden_2021f_boat Smygehuk_2021_11_03 Simrishamn_2021_11_05 Simrishamn_2021_12 Simrishamn_2022_03 ${se_2022.join(' ')} - rdfType: visit, labelPrefix: 🇸🇪, edge: color="yellow;0.5:deepskyblue" penwidth=1

Denmark_2021 Gedser Klintholm - rdfType: visit, labelPrefix: 🇩🇰, rdfLabel: Denmark 2021

Denmark_2022 ${dk_2022} - rdfType: visit, labelPrefix: 🇩🇰, rdfLabel: Denmark 2022

Netherlands ${nl_2022.join(' ')} - rdfType: visit, labelPrefix: 🇳🇱

Belgium Oostende_2022_09_13 - rdfType: visit, labelPrefix: 🇧🇪, edge: color="red;0.33:gold;0.33:black;0.33" penwidth=1

France_2022 ${fr_2022} - rdfType: visit, labelPrefix: 🇫🇷, showExit:false, edge: color="red;0.33:silver;0.33:blue;0.33" penwidth=1

Kira  ${path_of_kira} StNic
StNic_2024_b
- rdfType: dog, edge: color="silver;0.5:gold"

Isa StNic
StNic_2024_b
- person

Flo StNic
StNic_2024_b
- person

Johannes Schruns_2023_09_08 - person

Boran ${path_of_boran} 
StNic Andorra
Lenggries_2023_06_28
Ginzling_2023_07_01 Schlegeis_2023_a Kraxentrager_2023_a Schönachtal_2023_a Salzburg_2023_07_06 Lenggries_2023_07_07
Peenemünde_2023_07_14 
Lenggries_2023_07_172024-04-07
Lenggries_2023_07_28
Peenemünde_2023_07_30
Peenemünde_2023_08_04x
Peenemünde_2023_08_26
Starnberg_2023_a
Schruns_2023_09_08
Dießen_2023_09_11 
Mialet_2023_09_29 Mialet_2023_10_02
Organya_2023_10_03 Organya_2023_10_06
Millau_2023_10_08  Millau_2023_10_11
Dießen_2023_10_12 Dießen_2023_10_19
Weilheim_2023_10_20 Weilheim_2023_11_13 
Achensee Dießen_2023_12 Annecy_2023_12_24 Organya_2023_12_26 Algodonales 
Lagos_2023_12_28 Lagos_2024_02_10 
Algericas 
Tanger_2024_02_12 
Ouarzazate_2024_02_21 OasisDeTiguirt_2024_02_22 OasisDeTiguirt_2024_02_24 Marrakech_2024_02_25 
Agadir_2024_02_27 Tanger_2024_02_29
Rabat_2024_03_02 MuseumOfWater_2024_03_04 Imintanoute
Agadir_2024_03_05
Agadir_2024_03_19 Agadir_2024_03_24
Agadir_2024_03_27 
Agadir_2024_04_01
Agadir_2024_04_02 Agadir_2024_04_03 
Agadir_2024_04_18
Agadir_2024_04_19
Tantan_2024_05
Tarfaya
Cadiz_2024_b
StNic_2024_b
Lenggries_2024_a
- rdfType: person, edge: color=forestgreen

Rachid Agadir_2024_03_24 Agadir_2024_04_18 - person

FriendlyCustomer Agadir_2024_03_24 - person

FriendlyCustomer Agadir_2024_03_24 - person

FriendlyCustomer Agadir_2024_04_18 - person

FriendlyCustomer Agadir_2024_04_18 - person

Peaceful_Paths
Agadir_2024_04_18
- project

Timelines_Tool  
Agadir_2024_03_05
Agadir_2024_03_19 Agadir_2024_03_24
Agadir_2024_03_27 
Agadir_2024_04_01
Agadir_2024_04_02 Agadir_2024_04_03
Agadir_2024_04_18
Agadir_2024_04_19
- skill

Ann
CO_a
Mialet_2023_09_29 Mialet_2023_10_02
Millau_2023_10_08  Millau_2023_10_11
CO_b
Ouarzazate_2024_02_21  OasisDeTiguirt_2024_02_22 OasisDeTiguirt_2024_02_24 Marrakech_2024_02_25 
CO_c
- person

Souky
SilviaWith3Dogs_2024_a
SoukyWithOlga_a
Agadir_2024_03_19 Agadir_2024_03_24
SoukyWithOlga_b
- dog

Olga
SoukyWithOlga_a
SoukyWithOlga_b
- person

Silvia 
SilviaWith3Dogs_2024_a
Agadir_2024_02_27 Tanger_2024_02_29 - person

Beida
SilviaWith3Dogs_2024_a
Agadir_2024_02_27 Tanger_2024_02_29 - dog

Bob
SilviaWith3Dogs_2024_a
Agadir_2024_02_27 Tanger_2024_02_29 - dog

Hansjörg KA_2024-03-28
Tanger TwoMillionKm Agadir_2024_04_01 Agadir_2024_04_02 Tantan Mauritania_2024_04_03
- person

TwoMillionKmCar KA_2024-03-28
Tanger TwoMillionKm Agadir_2024_04_01 Agadir_2024_04_02 Tantan Mauritania_2024_04_03
- car

Ali
Tanger TwoMillionKm Agadir_2024_04_01 Agadir_2024_04_02 Tantan Mauritania_2024_04_03
- person

Ayoub
Tanger TwoMillionKm Agadir_2024_04_01 Agadir_2024_04_02 Tantan Mauritania_2024_04_03
- person

Jochen
Hannover_2023x
Agadir_2024-01-02 Agadir_2024_02_27  Agadir_2024_03_05 Agadir_2024_03_19 Agadir_2024_03_24 Agadir_2024_03_27 
Zürich Hannover_2024_03_28 Georgia_2024_09x
- person

Rita
Berlin_1940
Wiesbaden_1968x
Istanbul_1969 Wiesbaden Pasing_1976 Munich_1988 Munich_1992 Dießen_1997 Lenggries_2022_12
Starnberg_2023_a Dießen_2023_09_11  Dießen_2023_10_12 Dießen_2023_10_19 Weilheim_2023_10_20 Weilheim_2023_11_13 
- rdfType: person, showExit: false

Baris
Istanbul_1950
Wiesbaden_1968x
Istanbul_1969
Omaha
BarisDies_2022_12
- rdfType: person, showExit: false

Boffi
Dießen_1997
Starnberg_2002 Starnberg_2009
- rdfType: dog, showExit: false

Vivien
Starnberg_2002
- person

KZP
Weilheim_2023_10_20 Weilheim_2023_11_13 - rdfType: activity, showExit: false, rdfDescription: Rita zur 'Kurzzeitpflege' in Weilheim

_24x7
Dießen_2023_10_12 Dießen_2023_10_19 - rdfType: activity, showExit: false, rdfLabel: 24x7, rdfDescription: Rita calls Boran for help; Boran takes care of Rita 24 hours per day / for 7 days

Art
Peenemünde_2023_07_14 Peenemünde_2023_07_30 Peenemünde_2023_08_26
- boat

Maru ${path_of_maru} - boat

#darkslateblue

- - - 

Großenbrode_2021_09_27:
- Großenbrode
- visiting Maru

Großenbrode_2021_10_30:
- Großenbrode
- leaving before winter

Bornholm:
- ${symbol_major_incident} Bornholm
- |
  trip with Carna 
  at strong wind and high waves;
  a lot of water entered the hull 
  through ventilation holes
  and front hatches

Kattegat: 
- X Kattegat
- |

  passing the narrow strait
  over night at strong wind

Segelstorp_2022_06_08: ⚓ Segelstorp

Skagerrak:
- X Skagerrak
- |
  crossing 
  from Sweden to Denmark, 
  over night, with easy wind:
  very pleasant leg
#fillcolor=3 color=6 colorscheme=gnbu9

jibe_2022_07:
- ${symbol_major_incident} jibe accident
- |
  boom hit my head 
  in an  accidental jibe  while
  preparing for harbour entry;
  painful and dangerous -> helmet
#fillcolor=orchid2 color=orchid4

Jammerbugt:
- X Jammerbugt
- |
  crossing 
  over night, against the wind,
  tired in the end
#fillcolor=lightgrey color=darkblue

Hanstholm:
- 🔧 Hanstholm
- |
  repair and
  major upgrades for Maru
  (metal and electricity)

haho_2022_08:
- Hanstholm
- |
  leaving in late August
  after stop of 7 weeks

HvideSande:
- 🔧 Hvide Sande
- |
  replacing lost bolt
  for autopilot with help from
  Matthias and carpenter
  (very nervous in the morning)

fall_incident:
- ${symbol_major_incident} falling
- |
  a wave destabilized
  me while walking on deck
  (not clipped in) -
  I fell off deck 
  but landed on engine bridge 

germanbight:
- X German Bight
- |
  crossing
  over night(s) at strong wind,
  steering high into wind during night

freakwave:
- ${symbol_major_incident} freak wave
- |
  hit the boat at full speed
  while crossing the German Bight
  (pencils fell out of soft pockets under deck)
#fillcolor=orchid2 color=orchid4 

Richel: ⚓ Richel
Waddensee: ⚓ Waddensee
Laaksum: ⚓ Laaksum
Hoorn: ⚓ Hoorn
Durgerdam: ⚓ Durgerdam
Sixhaven: Sixhaven (Amsterdam)
Ijmuiden: Ijmuiden (Amsterdam)
Scheveningen_2022_09_10: Den Haag

Scheveningen_2022_09_12:
- ⚓ Den Haag
- |

  spending last night 
  on anchor for earliest 
  possible takeoff

Boulogne_2022_09_19: ⚓ Boulogne

Cherbourg_x2: ⚓ Cherbourg

Alderney: ⚓ 🇬🇬 Alderney
Guernsey: ⚓ 🇬🇬 Guernsey

Ouessant:
- X Ouessant
- |
  passing the island
  after exiting the English Channel

failure_2022_10_09:
- ${symbol_major_incident} autopilot failing
- |
  at the 
  beginning of Biscay crossing, 
  after sunset, during rain, 
  with fog covering the shoreline
  => practicing mindfulness helps

Biscay_2022_12: X
Biscay_2023_04: X

Camaret_2023_01:
- Camaret
- | 
  returning with Kira by car 
  and spending winter at Finistere

Camaret_2023_03: Poullouguen

Lenggries_2024_a:
- clear Lenggries
- |

  clear the basement 
  and leave for good 
  (plan)

StNic_2024_b: 
- visit St. Nic
- |

  to meet Kira, Isa + Flo 
  after more than 1 year 
  (plan)

Weilheim_2023_11_13:
- ✝
- Rita dies while Boran is by her side

BarisDies_2022_12: ✝

Dießen_2023_09_11:
- Dießen
- |
  taking Rita 
  from the hospital to her home

Schruns_2023_09_08:
- Schruns
- |
  Boran testing 
  and buying Vril, as a
  wellness tool for the Alps
  (first solo paraglider since 2020)
  because it is now obvious that 
  Boran will spend time closer to Rita 

Starnberg_2023_a:
- Starnberg
- |

  Rita calling Boran 
  from the hospital,
  explaining that she feels like 
  she has "not much time left"

Peenemünde_2023_08_26:
- returning Art
- |
  due to so many
  hidden faults and leaks

Peenemünde_2023_08_04x: Susanne visiting Art
Peenemünde_2023_07_30: moving into Art
Peenemünde_2023_07_14: testing Art

Lenggries_2020_05_02: emigrating

Are: 🪂 Are
Nikkaluokta: 🪂 Nikkaluokta
Abisko: 🪂 Abisko
kase_2020_05_19: 🪂 Kaseberga
kase_2020_07: 🪂 Kaseberga

Urshult_2021_06: Potato Ninjas

Öland_2021_09:
- Spirits of Öland
- |

  Johanna arranged that 
  I could settle  there
  'forever', but Ingrid 
  kicked my out 
  after 2 months

Simrishamn_2021_11_05: 
- Simrishamn
- arriving by boat
Simrishamn_2021_12: spending winter 2021/2022
Simrishamn_2022_05:
- leaving Simrishamn
- |

  onboard Maru, 
  together with Roland

Göteborg_2022_06_30:
- Göteborg
- |
  leaving Sweden
  by boat

Lenggries_2013: 🪂 Lenggries
Lenggries_2021_08: 
- visiting Lenggries
- |
  and entering DE 
  because Corona mandates were lifted
  for the first after my emigration, 
  which I found very exciting

Lenggries_2021_10:
- Lenggries exchange
- |

  Katerina offers taking care of Kira
  while Boran crosses the Baltic Sea
  (as a total beginner) - so
  we hand over car + dog

Lenggries_2022_12:
- 🪂 Lenggries wintercamp
- |

  visiting friends + family; 
  office work to restore funds; 
  swapping Kira back to Boran;
  full moon flight

TwoMillionKm:
- 2 Million km
- |

  Hansjörg completed 2 Million km
  as the world's first EV owner
  with his Tesla Model S 85P

` )
```

### calculated strings

```js
path_of_boran =
"Istanbul_1969 Wiesbaden Pasing_1976 Munich_1988 Munich_1992 Dießen_1997 Starnberg_2002 Starnberg_2009 Heidelberg_2011 Lenggries_2013 "
  +
  Lenggries_2015f.concat(
  se_2020f,
  de_2021,
  grobro_to_simris,
  winter_2021,
  Simrishamn_to_camaret,
  [ 'Frankfurt_2022_11','Lenggries_2022_12' ],
  Camaret_2023
).join( ' ' )

```

```js
path_of_kira = 
  Lenggries_2015f.concat(
  se_2020f,
  de_2021,
  [ 'Simrishamn_2022_03', 'Lenggries_2022_12' ],
  Camaret_2023
).join(' ')
```

```js
path_of_maru =
  ['Großenbrode_2021_09_27'].concat(
  grobro_to_simris,
  winter_2021,
  Simrishamn_to_camaret
).join(' ')
```

### calculated arrays

```js
// trip of Boran + Maru
Simrishamn_to_camaret = 
  [  ].concat(
  se_2022,
  ['Skagerrak','jibe_2022_07'],
  dk_2022.split(" "),
  ['fall_incident','germanbight','freakwave'],
  nl_2022,
  ['Oostende_2022_09_13'],
  ['Dunkerque_2022_09_17','Boulogne_2022_09_19','Dieppe','Cherbourg_x2','Alderney','Guernsey','Ouessant','failure_2022_10_09','Camaret_2022_10_10'] // almost France except for GG
  )
```

### array literals

```js
// Lenggries between 2015 and 2020 (= Kiras life, part 1) 
Lenggries_2015f = [
  'Lenggries_2015','Lenggries_2020_05_02'
  ]
```

```js
se_2020f = [
'Eslöv_2020_05_08','Segelstorp','kase_2020_05_19','Are','Stockholm','Nikkaluokta','Abisko','kase_2020_07','Skillinge_2020_09','Bertilstorp_2020_11','Göteborg_2021','Haparanda','Kalmar_2021_02','Bertilstorp_2021_04','Urshult_2021_05','Öland_2021_05_04','Urshult_2021_06','Blankaholm'
]
```

```js
de_2021 = ['Lenggries_2021_08','Öland_2021_09','Kalmar_2021_09_21','Großenbrode_2021_09_27','Lenggries_2021_10']
```

```js
grobro_to_simris = ['Großenbrode_2021_10_30','Gedser','Klintholm','Smygehuk_2021_11_03','Simrishamn_2021_11_05']
```

```js
winter_2021 = [ 'Simrishamn_2021_12','Simrishamn_2022_03','Bornholm' ]
```

```js
se_2022 = ['Simrishamn_2022_05','Kaseberga_2022_05_30','Ystad','Smygehuk_2022_06_06','Kattegat','Segelstorp_2022_06_08','Glommen','Göteborg_2022_06_30']
```

```js
nl_2022 = ['Vlieland','Richel','Waddensee','Laaksum','Hoorn','Durgerdam','Sixhaven','Zaanstad','Ijmuiden','Scheveningen_2022_09_10','Scheveningen_2022_09_12']
```

```js
Camaret_2023 = [ 'Camaret_2023_01','Camaret_2023_03','Camaret_2023_04', 'Parking_2023_05_05', 'Camaret_2023_05_07', 'Treguer_2023_05_11' ]
```

### string literals

```js
dk_2022 = "Hirtshals Jammerbugt Hanstholm haho_2022_08 Thyborøn HvideSande"
```

```js
fr_2022 = "Dunkerque_2022_09_17 Boulogne_2022_09_19 Dieppe Cherbourg_x2 Camaret_2022_10_10"
```

## Initialization

```js
{
  if( renderer_choice === "KTS-Dot" )
  {
    diagram;
    init()
  }

  if( renderer_choice === "Ani-Dot" )
  {
    animate_this_inside( dot_string, animation_container, 1 )
  }

  diagram;
    if( false && !get_initial_details() && !get_initial_exec() )
      visco.explore( "Boran" )
  
  yield "KTS ready"
}
```

## Imports

```js
diagram_styles
```

```js
curtaincss = css2xhr
```

```js
import { css2xhr } from "@bogo/css-hide-after-double-hr"
```

```js
import { dot2svg, get_initial_url_param, get_initial_exec, init, visco, visco_buttons_Fe, kts_console, set_input_value, get_initial_details,  } from "@bogo/kxfm"
```

```js
import { animate_this_inside, diagram as animation_container } from "@bogo/kxfm-ani"
```

```js
central_entity = "Boran"
```

```js
import { bookmark_current, create_daterange_input, viewof diagram_toggles, only_shared_events, viewof project_lod, myReducedStory, StoryToDotRenderer, Story,  symbol_major_incident, diagram_styles, notes, create_button_to_apply_visible_entities_as_new_filter } 
with { selected_entities, date_range, myStory, this_particular_diagram, central_entity }
from "@bogo/timelib4"
```

```js
import { render_maximap_div } from "@bogo/maximap"
```

```js
bogoTimelinesSweden1EpisodeTitleOnly_320 = FileAttachment("bogo-timelines-sweden-1-episode-title-only.svg").image( {width:"320"} )
```

```js
bogoTimelinesSweden1EpisodeTitleOnly_640 = FileAttachment("bogo-timelines-sweden-1-episode-title-only.svg").image( {width:"640"} )
```
