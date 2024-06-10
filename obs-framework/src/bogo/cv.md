---
toc: true
---
<div class="grid grid-cols-2">
<div class="card">

# Boran Gögetap${ myReducedStory.get_flavour() }

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
           CvToHTMLRenderer
     as StoryToHTMLRenderer ,
//      StoryToHTMLRenderer ,
                            } from "../libob/index.js"
//                          } from "@kxfm/observablehq"

import{ 
        dot2svg             ,
        timelines           ,
        set_input_value     ,
        visco               ,
                            } from "@kxfm/browser"
```

```js
// TODO: fix this huge flash of unstyled, large profile photo
// by providing the style in a faster way than reactive rendering
StoryToHTMLRenderer.style
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

## 1. Content Filter

```js
const selected_entities_input = storyToHTMLRenderer.create_grouped_input
(
  htl.html`select<span class="printonly">ed</span> CV elements:` ,
  "EXIN,Axelos,ConfigManagement,AfI,BIT,bitvoodoo,kubus,mITSM,AOKS,LHMS,DZB,SymGmbH,Wissenswandler".split(',')
) 
const selected_entities = 
view( selected_entities_input )
```

<details name="entity_selection"     ><summary>by type</summary>

```js
// WARNING: "name" attribute not supported by Firefox as of 2024 - see https://caniuse.com/mdn-html_elements_details_name
// make sure that at least upon page load that only one of the details group is open
storyToHTMLRenderer.create_type_buttons( selected_entities_input, selected_entities, 9 )
```
</details>

<details name="entity_selection" open><summary>by skillset</summary>

```js
Inputs.button
(
  [
    [
      "Paragliding"   , () => set_input_value(  selected_entities_input, "DHV,Paragliding,SkyAdventures".split( ',' )  )
    ] ,
    [
      "Coaching"      , () => set_input_value(  selected_entities_input, "Coaching"                     .split( ',' )  )
    ] ,
    [
      "Visualization" , () => set_input_value(  selected_entities_input, "CDK,Java3D,_3DS,Visualization,Graphviz,ArsEdition,ING,Storz"          .split( ',' )  )
    ] ,
    [
      "Enterprise Architecture"
                      , () => set_input_value(  selected_entities_input, "TUM,EXIN,Axelos,EnterpriseArchitecture,AOKP,BMWBank,mITSM,SAP,SymGmbH".split( ',' )  )
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
      "Service Management", () => 
      {                     set_input_value ( selected_entities_input, "TUM,EXIN,Axelos,ServiceManagement,ADP,kubus,LHS,AOKS,HNU,BMWBank,SSB".split(',')  )
        visco.explore( "ServiceManagement", '#diagram' ) // highlight the Service Management track so that projects within that scope are more obvious
      }
    ] ,
  ] // end skill buttons array
)
```
</details>

<details name="entity_selection" ><summary>by CV styles</summary>

```js
Inputs.button
( [
  ["nothing", () => 
   {
     set_input_value( selected_entities_input, [] );
   }
  ] ,
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
  ] ,
  ["People & Clients", () => set_input_value( selected_entities_input, myStory.keep_types( ["person","OU"] ) )]
  ,
  ["everything", () => 
   {
     set_input_value(  selected_entities_input, myStory.entity_keys );
     set_input_value(  project_lod_input, StoryToDotRenderer.lod_options[0] );
   }
  ] ,
] )
```

</details>

```js
const date_range_input = storyToHTMLRenderer.create_daterange_input()
const date_range = view( date_range_input )
```

</div>
<div class="card">

![](/img/20220830_184948~3.jpg)

[boran@goegetap.name](mailto:boran@goegetap.name)

🇬🇧 English: fluent, professional<br/>
🇩🇪 German: native<br/>
🇫🇷 French, Italian, Spanish: basic

Sailor, Alpinist, Pilot 🎓

Knowledge Manager,<br/>
Product Owner,<br/>
Scrum Master,<br/>
ITIL V3 Expert 🎓

born ${dob[0]} (age ${age})

</div>
</div>

<div class="card">

## 2. Tabular View

```js
reducedStoryRenderer.tabular_view( ["client","skill"], ["Client / School","Skills involved"] )
```

</div>
<div class="card">

## 3. Diagram View

```js
const myStory = new Story( story_text )
const storyToHTMLRenderer = 
new   StoryToHTMLRenderer( myStory )
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

</div>

## Appendix

```js
StoryToHTMLRenderer.how_to_read `_This particular diagram's central story is Boran's curriculum vitae (CV) with an emphasis on 'professional' events_`
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

const project_lod_input = Inputs.radio
(
  StoryToDotRenderer.lod_options, 
  {
    label: "level of detail", 
    value: StoryToDotRenderer.lod_options[ get_url_param( "lod", '0' )[0] ]
  }
) 
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
}&lod=${ project_lod == StoryToDotRenderer.lod_options[0] ? 0 : 1 }">bookmark current set of details</a></p>`
```

</span>

```js
const bogo_most_recent = "" // to be overridden e.g. in job applications to include a latest "open to work" event
```

```js
const dob = myStory.first_notice_of( "Boran" )
const age = new Date
  (
    Date.now() - 
    new Date( dob.join('-') )
  ).getUTCFullYear() - 1970
```

```js
window.addEventListener('beforeprint', (event) => {
  for (const detailEl of document.querySelectorAll('details')) {
    if (detailEl.getAttribute('open') == null) {
      detailEl.setAttribute('data-was-closed', 'true')
    }
    detailEl.setAttribute('open', '')
  }
})

window.addEventListener('afterprint', (event) => {
  for (const detailEl of document.querySelectorAll('details')) {
    if (detailEl.getAttribute('data-was-closed') != null) {
      detailEl.removeAttribute('data-was-closed')
      detailEl.removeAttribute('open')
    }
  }
})
```

```js
// await FileAttachment( "./cv.yaml" ).text()
const story_text = 
`
Boran
Istanbul_1969_02 
Wiesbaden_1970
München_1976
GymnasticsCoach_1987 ComputerScience_1989 ComputerScience_1993
Magellan_1993_10 Magellan_1994_03
MagicMotion_1995 Cybertennis_1996 Lithotrack_1997 ITProjectManager_1997_12
ITProjectManager_1999_06 UIS_1999_10   
FoundInSpace_2001   
eFF_2001_09 Lithotrack_2001_12
LithotrackJ_2002
ITILServiceManager_2003  eFF_2003_03
MapIT_2004_04 MapIT_2004_12  
BPMspace_2005 
BüroGemschftSeefeld_2006 UIS_2006_03  RUP_2006_04 LithotrackJ_2006_06
ItilLectures_2007
ITILv3Expert_2007  ITSMreq_2007_02 ITSMreq_2007_05  BPMspace_2007_08  DeploymentAutomation_2007_12  
ITGovernance_2008_02  
itsmTraining_2009_01 itsmTraining_2009_04
QualityClimbingSession1_2011_05  bitCMDB_2011_07 bitCMDB_2011_09 SAPonCloud_2011_10 
SAPonCloud_2013_03 ParaglidingPilot_2013_06   
Ethikfilter_2014 CSI_2014_02 ClimbingInstructor_2014_05  QualityClimbingSession2_2014_08  
LDI_2015_04 PassengerPermit_2015_08
KTSjava_2016 CSI_2016_10
LDI_2017_02 ZAM_2017_04 ZAM_2017_06
ITSM20_2017_10 ITSM20_2017_12 
GlobalContainerPipeline_2018_01 GlobalContainerPipeline_2018_03 
BusinessServiceManagement_2018_04 
KTSbash_2018_06
ParaglidingInstructor_2018_11 
lhmsCMDB_2019_02 BusinessServiceManagement_2019_08 lhmsCMDB_2019_09 bitvCMDB_2019_10
AfICMDB_2019_11 
TandemPilot_2020_07 
AfICMDB_2020_08 
Symsuite_2020_09  
MaruEngineConversion_2021_10
CrossingBaltic_2021_11
SwedenToFrance_2022_05
SwedenToFrance_2022_10
Symsuite_2022_10  
ProjectManagement_2022_11 
KTSjs_2023_01 
ValueMaps_2023_02 ValueMaps_2023_03 Timelines_2023_04 
ProjectManagement_2023_06 
EmotionalIntelligence_2023_11
Timelines_2024_02 
${bogo_most_recent} 
- "edge":"color=forestgreen","rdfType":"person"

#
# schools
#

TUM        ComputerScience_1989 ComputerScience_1993 - "rdfLabel":"TU München","labelPrefix":"🏢","rdfType":"school"

EXIN ITILServiceManager_2003 - school

Axelos ITILv3Expert_2007 - school

DHV ParaglidingPilot_2013_06 PassengerPermit_2015_08 ParaglidingInstructor_2018_11 - "labelPrefix":"🏢","rdfType":"school"

DAV ClimbingInstructor_2014_05 - "rdfLabel":"Deutscher Alpenverein","labelPrefix":"🏢","rdfType":"school"

# Andreas QualityClimbingSession1_2011_05 QualityClimbingSession2_2014_08 - "rdfType":"person","endNode":"ADP_future"

# Peter SAPonCloud_2011_10 SAPonCloud_2013_03 - "rdfType":"person"

# Andreas SAPonCloud_2011_10 SAPonCloud_2013_03 - "rdfType":"person"

Michael SAPonCloud_2011_10 SAPonCloud_2013_03 - rdfType: person, node: URL="https://freitag.expert"

# Ulrich  SAPonCloud_2011_10 SAPonCloud_2013_03 GlobalContainerPipeline_2018_01 GlobalContainerPipeline_2018_03 ProjectManagement_2022_11 ProjectManagement_2023_06 - "rdfType":"person","endNode":"ING_future"

Michael BüroGemschftSeefeld_2006 Symsuite_2020_09 Symsuite_2022_10 - "rdfType":"person","endNode":"SymGmbH_future"

Christoph                        Symsuite_2020_09 Symsuite_2022_10 - "rdfType":"person","endNode":"SymGmbH_future"

Frank   
LDI_2015_04 LDI_2017_02  ZAM_2017_04 ZAM_2017_06  BusinessServiceManagement_2018_04 BusinessServiceManagement_2019_08 - "rdfType":"person","endNode":"AOKP_future"

# Tino  BusinessServiceManagement_2018_04 BusinessServiceManagement_2019_08 Symsuite_2020_09 Symsuite_2022_10 - "rdfType":"person","endNode":"SymGmbH_future"

# Robin BusinessServiceManagement_2018_04 BusinessServiceManagement_2019_08 Symsuite_2020_09 Symsuite_2022_10 - "rdfType":"person","endNode":"SymGmbH_future"

Katerina QualityClimbingSession2_2014_08 - "rdfType":"person"

#
# Skills: Methods (abstract / "soft skills")
#

Sailing
MaruEngineConversion_2021_10
CrossingBaltic_2021_11
SwedenToFrance_2022_05
SwedenToFrance_2022_10
- edge: style=dotted, labelPrefix: ⛵, rdfType: skill, endNode: Boran_future

Coaching 
GymnasticsCoach_1987 
QualityClimbingSession1_2011_05 
bitCMDB_2011_07
ClimbingInstructor_2014_05 
QualityClimbingSession2_2014_08 
ParaglidingInstructor_2018_11 
EmotionalIntelligence_2023_11
- "edge":"style=dotted","labelPrefix":"🔧","rdfType":"skill","endNode":"Boran_future"

ConfigManagement  
BPMspace_2005 
ITSMreq_2007_02 ITSMreq_2007_05 
BPMspace_2007_08  
bitCMDB_2011_07 bitCMDB_2011_09  
CSI_2014_02 
KTSjava_2016 
CSI_2016_10 
ITSM20_2017_10 ITSM20_2017_12 
KTSbash_2018_06
lhmsCMDB_2019_02 lhmsCMDB_2019_09     
bitvCMDB_2019_10  
AfICMDB_2019_11 AfICMDB_2020_08 
Symsuite_2020_09  Symsuite_2022_10
KTSjs_2023_01 ValueMaps_2023_02 ValueMaps_2023_03
- skill

KnowledgeManagement
SAPonCloud_2011_10 SAPonCloud_2013_03 
KTSjava_2016 
KTSbash_2018_06
Symsuite_2020_09 Symsuite_2022_10
KTSjs_2023_01
ValueMaps_2023_02 ValueMaps_2023_03 Timelines_2023_04 Timelines_2024_02 
- "rdfLabel":"Knowledge Management","rdfDescription":"including Semantic Technologies such as Graph Databases, SPARQL/OWL/RDF","labelPrefix":"🔧","rdfType":"skill","edge":"style=dotted"

EnterpriseArchitecture  
MapIT_2004_04 MapIT_2004_12  
BPMspace_2005 BPMspace_2007_08  
SAPonCloud_2011_10 SAPonCloud_2013_03  
LDI_2015_04 LDI_2017_02  
ZAM_2017_04 ZAM_2017_06  
BusinessServiceManagement_2018_04 BusinessServiceManagement_2019_08  
Symsuite_2020_09 Symsuite_2022_10 
ValueMaps_2023_02 ValueMaps_2023_03
- "edge":"style=dotted","labelPrefix":"🔧","rdfType":"skill"


ServiceManagement
ITProjectManager_1997_12
ITProjectManager_1999_06
ITILServiceManager_2003
RUP_2006_04
ItilLectures_2007
ITILv3Expert_2007
ITSMreq_2007_02 ITSMreq_2007_05 
DeploymentAutomation_2007_12
ITGovernance_2008_02
ItilLectures_2008_12
itsmTraining_2009_01 itsmTraining_2009_04
QualityClimbingSession1_2011_05
QualityClimbingSession2_2014_08
Symsuite_2020_09 Symsuite_2022_10
- "edge":"style=dotted","labelPrefix":"🔧","rdfType":"skill"

SwEngineering
ComputerScience_1989 ComputerScience_1993
MagicMotion_1995
Cybertennis_1996
Lithotrack_1997 
ITProjectManager_1997_12
ITProjectManager_1999_06
UIS_1999_10
FoundInSpace_2001
eFF_2001_09
Lithotrack_2001_12 LithotrackJ_2002
eFF_2003_03
UIS_2006_03
LithotrackJ_2006_06
DeploymentAutomation_2007_12
KTSjava_2016
GlobalContainerPipeline_2018_01 GlobalContainerPipeline_2018_03
KTSbash_2018_06
KTSjs_2023_01
ValueMaps_2023_02 ValueMaps_2023_03
Timelines_2023_04 Timelines_2024_02
- "edge":"style=dotted","labelPrefix":"🔧","rdfLabel":"Software Engineering","rdfType":"skill","endNode":"Boran_future"

Visualization
MagicMotion_1995
Cybertennis_1996
Lithotrack_1997 
FoundInSpace_2001
Lithotrack_2001_12 LithotrackJ_2002
MapIT_2004_04 MapIT_2004_12
LithotrackJ_2006_06
KTSjava_2016
GlobalContainerPipeline_2018_01 GlobalContainerPipeline_2018_03
KTSbash_2018_06
KTSjs_2023_01
ValueMaps_2023_02 ValueMaps_2023_03
Timelines_2023_04 Timelines_2024_02
- "edge":"style=dotted","labelPrefix":"🔧","rdfType":"skill","endNode":"Boran_future"

#
# Skills: Standards / Products / Languages ("hard skills")
#

ARIS
MapIT_2004_04 MapIT_2004_12
BusinessServiceManagement_2018_04 BusinessServiceManagement_2019_08
ProjectManagement_2022_11 ProjectManagement_2023_06
- "labelPrefix":"🔧","rdfType":"skill","edge":"style=dotted"

Paragliding 
ParaglidingPilot_2013_06 PassengerPermit_2015_08 ParaglidingInstructor_2018_11 TandemPilot_2020_07 
- "labelPrefix":"🪂","rdfType":"skill","edge":"style=dotted"

Cpp 
Magellan_1993_10 Magellan_1994_03 MagicMotion_1995 Cybertennis_1996 Lithotrack_1997 Lithotrack_2001_12 - "rdfLabel":"C++","labelPrefix":"🔧","rdfType":"skill","edge":"style=dotted"

_3DS 
MagicMotion_1995 - rdfLabel: 3DS, rdfDescription: "3D Studio by Autodesk, extensible via C++", edge: style=dotted, labelPrefix: 🔧, rdfType: skill

AutoCAD Magellan_1993_10 Magellan_1994_03 - "labelPrefix":"🔧","rdfType":"skill","edge":"style=dotted"

CDK 
Cybertennis_1996
Lithotrack_1997 Lithotrack_2001_12 - "rdfDescription":"Cyberspace Developer Kit by Autodesk, based on C++ and Metaware compiler","edge":"style=dotted","labelPrefix":"🔧","rdfType":"skill"

Java3D 
FoundInSpace_2001 LithotrackJ_2002 LithotrackJ_2006_06 - "labelPrefix":"☕","rdfType":"skill","edge":"style=dotted","labelPrefix":"🔧","rdfType":"skill"

JavaEE
UIS_1999_10 
eFF_2001_09  eFF_2003_03 
BPMspace_2005 
UIS_2006_03
BPMspace_2007_08 
KTSjava_2016
- "labelPrefix":"☕","rdfType":"skill","edge":"style=dotted"

Javascript 
KTSjs_2023_01 ValueMaps_2023_02 ValueMaps_2023_03 Timelines_2023_04 Timelines_2024_02
- "labelPrefix":"🔧","rdfType":"skill","edge":"style=dotted"

KTS
CSI_2014_02
LDI_2015_04 
KTSjava_2016
CSI_2016_10
LDI_2017_02
BusinessServiceManagement_2018_04
KTSbash_2018_06
BusinessServiceManagement_2019_08
Symsuite_2020_09 Symsuite_2022_10
ProjectManagement_2022_11
KTSjs_2023_01 ValueMaps_2023_02 ValueMaps_2023_03 Timelines_2023_04 
ProjectManagement_2023_06
Timelines_2024_02 
- "edge":"style=dotted","labelPrefix":"🔧","rdfType":"skill","endNode":"Wissenswandler_future","rdfDescription":"KTS = Knowledge Transformation System = a set of tools for ETL (= extract-tranform-load) of data/information so that it creates relevant knowledge for a certain audience in a particular use case;\\n\\nKTS includes different Ontologies, some of which aware of Causality, thus enabling queries like Impact Analysis or Root Cause Analysis;\\n\\nKTS applies a common visual style to the output diagrams, so that readers recognize a common visual language\\n\\nKTS frontend UIs include VisCo (= Visual Cortex) = responsive system for intuitive exploration of connections in a Knowledge Graph"

Graphviz
KTSjava_2016
GlobalContainerPipeline_2018_01 GlobalContainerPipeline_2018_03
KTSbash_2018_06
KTSjs_2023_01
ValueMaps_2023_02 ValueMaps_2023_03
Timelines_2023_04 Timelines_2024_02
- "edge":"style=dotted","labelPrefix":"🔧","rdfType":"skill"

Jira   
ZAM_2017_04 ZAM_2017_06  
GlobalContainerPipeline_2018_01 GlobalContainerPipeline_2018_03
BusinessServiceManagement_2018_04 
KTSbash_2018_06
BusinessServiceManagement_2019_08  
Symsuite_2020_09 Symsuite_2022_10 
KTSjs_2023_01 ValueMaps_2023_02 ValueMaps_2023_03
- "rdfLabel":"Jira","edge":"style=dotted","labelPrefix":"🔧","rdfType":"skill"

ServiceNow
ITSM20_2017_10 ITSM20_2017_12
ProjectManagement_2022_11 ProjectManagement_2023_06
- "edge":"style=dotted","labelPrefix":"🔧","rdfType":"skill"

ObservableHQ 
KTSjs_2023_01
Timelines_2023_04 Timelines_2024_02 - "edge":"style=dotted","labelPrefix":"🔧","rdfType":"skill"

#
# Clients, sorted by industry, then name
#

# publishing

ArsEdition MagicMotion_1995 - OU

# IT / Service Prodiver industry

AfI   AfICMDB_2019_11 AfICMDB_2020_08   
- "rdfLabel":"Amt für Informatik (Afi), CH","labelPrefix":"🏢","rdfType":"OU","rdfDescription":"Amt für Informatik des Kanton Thurgau (Schweiz)"

ADP  
DeploymentAutomation_2007_12 QualityClimbingSession1_2011_05 QualityClimbingSession2_2014_08 - "rdfLabel":"Amadeus Data Processing GmbH","labelPrefix":"🏢","rdfType":"OU"

BIT 
bitCMDB_2011_07 bitCMDB_2011_09 - "rdfLabel":"Bundesamt für Informatik (CH)","labelPrefix":"🏢","rdfType":"OU","rdfDescription":"Bundesamt für Informatik und Telekommunikation"

bitvoodoo bitvCMDB_2019_10 - "rdfLabel":"bitvoodoo AG","labelPrefix":"🏢","rdfType":"OU"

kubus   
Fusion_2008
itsmTraining_2009_01 itsmTraining_2009_04
CSI_2014_02  CSI_2016_10  
- "rdfLabel":"kubus IT GbR","labelPrefix":"🏢","rdfType":"OU"

LHS RUP_2006_04 - "rdfLabel":"Lufthansa Systems AG","labelPrefix":"🏢","rdfType":"OU"

Logitech Magellan_1993_10 Magellan_1994_03 - OU

mITSM BPMspace_2005 BPMspace_2007_08  - "rdfLabel":"mITSM GmbH","labelPrefix":"🏢","rdfType":"OU"

SAP SAPonCloud_2011_10 SAPonCloud_2013_03 - "rdfLabel":"SAP AG","labelPrefix":"🏢","rdfType":"OU"

# Health and Public Services

AOKP  
Fusion_2008
LDI_2015_04 LDI_2017_02  ZAM_2017_04 ZAM_2017_06  BusinessServiceManagement_2018_04 BusinessServiceManagement_2019_08 - "rdfLabel":"AOK PLUS","labelPrefix":"🏢","rdfType":"OU"

AOKS 
ITSMreq_2007_02 ITSMreq_2007_05 
Fusion_2008 - "rdfLabel":"AOK Sachsen","labelPrefix":"🏢","rdfType":"OU","showExit":false

AOKT
Fusion_2008
- "rdfLabel":"AOK Thüringen","labelPrefix":"🏢","rdfType":"OU","showExit":false

Storz Lithotrack_1997 Lithotrack_2001_12 LithotrackJ_2002 LithotrackJ_2006_06 - "rdfLabel":"Storz Medical AG","labelPrefix":"🏢","rdfType":"OU"

HNU ItilLectures_2007 ItilLectures_2008_12 - "rdfLabel":"Hochschule Neu-Ulm","labelPrefix":"🏢","rdfType":"OU"

LHMS lhmsCMDB_2019_02 lhmsCMDB_2019_09 - "rdfLabel":"LHM Services GmbH","labelPrefix":"🏢","rdfType":"OU"

# Banking / Financial Services

BMWBank 
ITProjectManager_1997_12 ITProjectManager_1999_06 UIS_1999_10 MapIT_2004_04 MapIT_2004_12 UIS_2006_03 - "rdfLabel":"BMW Bank GmbH","labelPrefix":"🏢","rdfType":"OU"

DCB   
eFF_2001_09 eFF_2003_03 - "rdfLabel":"DaimlerChrysler Bank","labelPrefix":"🏢","rdfType":"OU" 

DZB   
ITSM20_2017_10 ITSM20_2017_12 - "rdfLabel":"DZ Bank AG","labelPrefix":"🏢","rdfType":"OU" 

ING 
GlobalContainerPipeline_2018_01 GlobalContainerPipeline_2018_03 
ProjectManagement_2022_11 ProjectManagement_2023_06 
- "rdfLabel":"ING-DiBa AG","labelPrefix":"🏢","rdfType":"OU"

SSB  ITGovernance_2008_02  - "labelPrefix":"🏢","rdfType":"OU","rdfLabel":"State Street Bank GmbH"

# Sports / Outdoor

SkyAdventures TandemPilot_2020_07 - OU

Völkl Cybertennis_1996 ISPO_1996b - OU


# other / Service providers

SymGmbH Symsuite_2020_09 Symsuite_2022_10 - rdfLabel: Sym GmbH, rdfType: OU

# self

CoSo FoundInSpace_2001 - rdfType: OU, rdfLabel: Continental Software GmbH

Wissenswandler KTSjava_2016 KTSbash_2018_06 KTSjs_2023_01 ValueMaps_2023_02 ValueMaps_2023_03 Timelines_2023_04 Timelines_2024_02 - OU

- - -

Istanbul_1969_02: 🕯born in Istanbul
Wiesbaden_1970:   moved to Wiesbaden
München_1976:     moved to München
GymnasticsCoach_1987:
- 🎓 Gymnastics Coach
- |

  license to teach Gymnastics 
  (Fachübungsleiter Geräteturnen
  issued by BLSV, DE)


Magellan_1993_10:
- Magellan suite for AutoCAD
- |

  working with Logitech (USA) to create a toolset
  for intuitive designing and viewing of 3D models
  within the AutoCAD software application

  Boran serves as 3D Consultant + Solution Architect

Magellan_1994_03: finish

MagicMotion_1995:
- 📀 Magic Motion
- |
  
  CD-Rom Content and Software production

  inventing animated stereovision (1st in history) 
  based on the algorithm for "Magic Eye" still images,
  we create suitable 3D models in 3D Studio (3DS),
  implement a post-processing filter for 3DS, 
  render "Magic Motion" videos, and
  implemented a custom UI for viewing such videos

  published under ISBN 9783760711461

  Boran serves as Solution Architect
  and Software Developer


Cybertennis_1996:
- 📦 Cybertennis
- |
  immersive VR development

  designing an immersive tennis court featuring
  a real tennis racket with force feedback
  plus a 3D-tracked head-mounted display (HMD)
  as one part of the UI, and a virtual opponent
  in a 3D scene which is rendered in real-time
  and viewed in the HMD.

  Boran serves as Solution Architect 
  and Software Developer
 

Lithotrack_1997:
- 📦 Lithotrack
- |

  developing a 3D navigation system to visualize 
  and guide non-invasive medical surgery; 

  certified for clinical use by 
  FDA (US Food and Drug Administration)
  and LGA (German Landesgewerbeanstalt) 

  Boran manages project on supplier’s side
  and contributes as Solution Architect

Lithotrack_2001_12: finish

LithotrackJ_2002:
- 📦 Lithotrack-J
- |
  migrating Lithotrack
  from 'PC' to 'Pocket-PC' hardware platform, and
  from C++ based CDK to Java based 3D toolkit
  to enable a much leaner form factor

LithotrackJ_2006_06: finish



EmotionalIntelligence_2023_11:
- Emotional Intelligence Workshop
- |
  delivering a method 
  (Angstregulierung) and performing exercises 
  to manage anxiety in potentially stressful situations

  see https://observablehq.com/@bogo/angstbewaeltigung

  Boran contributes as Coach
`
```
