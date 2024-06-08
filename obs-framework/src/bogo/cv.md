---
toc: true
---
<div style="float: right">
<img src="/img/20220830_184948~3.jpg" style="width: 203px"/>
<p>

[boran@goegetap.name](mailto:boran@goegetap.name)

</p>
<p>
🇬🇧 English: fluent, professional
<br/>
🇩🇪 German: native
<br/>
🇫🇷 French, Italian, Spanish: basic
</p>
<p>
Sailor,<br/>
Alpinist,<br/>
Pilot 🎓
</p>
<p>
Knowledge Manager,<br/>
Product Owner,<br/>
Scrum Master,<br/>
ITIL V3 Expert 🎓
</p>
<p>born ${dob[0]} (age ${age})</p>
</div>

# Boran's CV${ myReducedStory.get_flavour() }

```js
import {  
        get_url_param,
        Story               ,
        StoryToDotRenderer  ,
        show_future_faded   ,
        only_shared_events  ,
        ReducedStory        ,
        SharedEventFilter   ,
        DaterangeFilter     ,
                            } from "../lib/index.js"
//                          } from "@kxfm/one"

import { 
        StoryToHTMLRenderer ,
        cv                  ,
                            } from "../libob/index.js"
//                          } from "@kxfm/observablehq"

import{ 
        dot2svg             ,
        timelines           ,
        set_input_value     ,
                            } from "@kxfm/browser"
```

```js
const n_topics = myReducedStory.n_topics 
const total_topics =  myStory.n_topics
```

<span class="screenonly">

**data-driven, interactive curriculum vitae**${ n_topics < total_topics ? `: filtered down to ${n_topics} out of ${total_topics} entries` : ""}

</span>
<span class="printonly">

**${ n_topics<total_topics ? 'customized ':""}curriculum vitae** 

(see data-driven, interactive version at https://observablehq.com/@bogo/cv for more details)

</span>

## 1. Content Selection (check the boxes or click buttons)

```js
const selected_entities_input = storyToHTMLRenderer.create_grouped_input
(
  htl.html`select<span class="printonly">ed</span> CV elements:` ,
  "EXIN,Axelos,ConfigManagement,AfI,BIT,bitvoodoo,kubus,mITSM,AOKS,LHMS,DZB,SymGmbH,Wissenswandler".split(',')
) 
const selected_entities = 
view( selected_entities_input )
```

```js
storyToHTMLRenderer.create_type_buttons( selected_entities_input, selected_entities, 9 )
```

```js
selected_entities_input.none_all_buttons()
```

```js
const nestedForm = view
(
Inputs.form
(
  [
    style_buttons ,

Inputs.button
(
  [
    [
      "Paragliding", 
      () => set_input_value
      (
        selected_entities_input, 
          "DHV,Paragliding,SkyAdventures".split(',') 
      )
    ] ,
    [
      "Coaching", 
      () => set_input_value
      (
        selected_entities_input, 
          "Coaching".split(',')
      )
    ] ,
    [
      "Visualization", 
      () => 
      {
      set_input_value
      (
        selected_entities_input,
          "CDK,Java3D,_3DS,Visualization,Graphviz,ArsEdition,ING,Storz".split(',')
      )
      }
    ] ,
    [
      "EAM", // Enterprise Architecture Management 
      () => 
      {
        set_input_value
      (
        selected_entities_input,
          "TUM,EXIN,Axelos,EnterpriseArchitecture,AOKP,BMWBank,mITSM,SAP,SymGmbH".split(',')
      )
      }
    ] ,
    [
      "Config Management", // Configuration Management
      () => set_input_value
      (
        selected_entities_input, 
          "EXIN,Axelos,ConfigManagement,AfI,AOKS,BIT,bitvoodoo,DZB,kubus,LHMS,mITSM,SymGmbH,Wissenswandler".split(',')
      )
    ] ,
    [
      "Service Management", 
      () => 
      {
      set_input_value
      (
        selected_entities_input, 
          "TUM,EXIN,Axelos,ServiceManagement,ADP,kubus,LHS,AOKS,HNU,BMWBank,SSB".split(',')
      )
      visco.explore("ServiceManagement") // highlight the Service Management track so that projects within that scope are more obvious
      }
    ] ,
  ] // end skill buttons array
)
  ]
  ,
  { template: inputs => htl.html `
    <div>
      <details><summary>styles</summary>${inputs[0]}</details>
      <details open><summary>skill-based profiles</summary>${inputs[1]}</details>
    </div>`
  } 
)
)
```

```js
const date_range_input = storyToHTMLRenderer.create_daterange_input()
const date_range = view( date_range_input )
```

## 2. Tabular View

```js
reducedStoryRenderer.tabular_view( ["client","skill"], ["Client / School","Skills involved"] )
```

## 3. Diagram View

```js
const myStory = new Story( story_text )
const storyToHTMLRenderer = 
new   StoryToHTMLRenderer( myStory )
      storyToHTMLRenderer.dictionary = 
  {
    "label":"Project / Product / Topic" ,
    "OU": "Client"                      ,
  }
```

```js
const myReducedStory = new ReducedStory
(
  myStory, selected_entities 
)
.addFilter(  new DaterangeFilter  ( date_range                          )  )
.addFilter(  new SharedEventFilter( diagram_toggles, only_shared_events )  )

const reducedStoryRenderer = new StoryToHTMLRenderer( myReducedStory )
```

```js
dot2svg
(
  new StoryToDotRenderer( myReducedStory, diagram_toggles, project_lod ) ,
  { domId:'diagram' , fit:'auto' , width } 
)
```

<div id="ktsConsole">KTS loading...</div>

- - -

## Appendix

```js
cv.how_to_read `_This particular diagram's central story is Boran's curriculum vitae (CV) with an emphasis on 'professional' events_`
```

<span class="screenonly">

## authoring tools

```js
const diagram_toggles = view( Inputs.checkbox
(
  [ only_shared_events, StoryToDotRenderer.highlight_all_timelines_of_event ], 
  {
    value: get_url_param( "only_shared_events", false )[0]==='true' ? [only_shared_events] : []
  } 
) )

const project_lod_input = Inputs.radio( StoryToDotRenderer.lod_options, {label: "level of detail", value: StoryToDotRenderer.lod_options[0] }) 
const project_lod       = view( project_lod_input )
```

```js
reducedStoryRenderer.create_button_to_apply_visible_entities_as_new_filter( selected_entities_input )
```

```js
htl.html`<p><a class="screenonly" href="?details=${
selected_entities.join(',')
}&date_range=${
date_range.join(',')
}&only_shared_events=${
diagram_toggles.includes( only_shared_events )
}">bookmark current set of details</a></p>`
```

</span>

```js
const bogo_most_recent = "" // to be overridden e.g. in job applications to include a latest "open to work" event
```

```js
const story_text = await FileAttachment( "./cv.yaml" ).text()
```

```js
const style_buttons = Inputs.button
( [
  ["nothing", () => 
   {
     set_input_value( selected_entities_input, [] );
   }
  ]
  ,
  [ "all skills", () => set_input_value(  selected_entities_input, myStory.keep_types( [ "skill" ] )  )   ]
  ,
  ["all clients", () => set_input_value(  selected_entities_input, myStory.keep_types( [ "OU"    ] )  )   ]
  ,
  ["linear CV (Boran's timeline)", () => set_input_value(  selected_entities_input, ["Boran"] ) ]
  ,
  ["Social CV (all people's timelines)", () => 
    {
      set_input_value(  selected_entities_input, myStory.keep_types( ["person"] )  );
      set_input_value(  project_lod_input, StoryToDotRenderer.lod_options[0]       );
    }  
  ]
  ,
  ["People & Clients", () => set_input_value( selected_entities_input, myStory.keep_types( ["person","OU"] ) )]
  ,
  ["everything", () => 
   {
     set_input_value(  selected_entities_input, myStory.entity_keys );
     set_input_value(  project_lod_input, StoryToDotRenderer.lod_options[0] );
   }
  ]
]
)
```

```js
const dob = myStory.first_notice_of( "Boran" )
const age = new Date
  (
    Date.now() - 
    new Date( dob.join('-') )
  ).getUTCFullYear() - 1970
```
