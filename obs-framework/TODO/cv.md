```js
title = html`
<div style="float: right">
<img src="${await FileAttachment(
  //"20160604_114926.jpg"
  "20220830_184948~3.jpg"
).url()}" style="width: 203px"/>
<p>${md`[boran@goegetap.name](mailto:boran@goegetap.name)`}</p>
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
${md`# Boran's CV${get_flavour()}`}
`
```

```js
subtitle = htl.html`
<span class="screenonly">${
  md`**data-driven, interactive curriculum vitae**${ n_topics < total_topics ? `: filtered down to ${n_topics} out of ${total_topics} entries}` : ""}`
}
</span>
<span class="printonly">${
  md`**${ n_topics<total_topics ? 'customized ':""}curriculum vitae** 

(see data-driven, interactive version at https://observablehq.com/@bogo/cv for more details)`
}
</span>
`
```

## 1. Content Selection (check the boxes or click buttons)

```js
viewof selected_entities = create_grouped_input( entity_timelines, htl.html`select<span class="printonly">ed</span> CV elements, grouped by type...`, "EXIN,Axelos,ConfigManagement,AfI,BIT,bitvoodoo,kubus,mITSM,AOKS,LHMS,DZB,SymGmbH,Wissenswandler".split(',') )
```

```js
viewof nestedForm = Inputs.form
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
        viewof selected_entities, 
          "DHV,Paragliding,SkyAdventures".split(',') 
      )
    ]
    ,
    [
      "Coaching", 
      () => set_input_value
      (
        viewof selected_entities, 
          "Coaching".split(',')
      )
    ]
    ,
    [
      "Visualization", 
      () => 
      {
      set_input_value
      (
        viewof selected_entities,
          "CDK,Java3D,_3DS,Visualization,Graphviz,ArsEdition,ING,Storz".split(',')
      )
      }
    ]
    ,
    [
      "EAM", // Enterprise Architecture Management 
      () => 
      {
        set_input_value
      (
        viewof selected_entities,
          "TUM,EXIN,Axelos,EnterpriseArchitecture,AOKP,BMWBank,mITSM,SAP,SymGmbH".split(',')
      )
      }
    ]
    ,
    [
      "Config Management", // Configuration Management
      () => set_input_value
      (
        viewof selected_entities, 
          "EXIN,Axelos,ConfigManagement,AfI,AOKS,BIT,bitvoodoo,DZB,kubus,LHMS,mITSM,SymGmbH,Wissenswandler".split(',')
      )
    ]
    ,
    [
      "Service Management", 
      () => 
      {
      set_input_value
      (
        viewof selected_entities, 
          "TUM,EXIN,Axelos,ServiceManagement,ADP,kubus,LHS,AOKS,HNU,BMWBank,SSB".split(',')
      )
      visco.explore("ServiceManagement") // highlight the Service Management track so that projects within that scope are more obvious
      }
    ]
    ,
    [
      "Semantic + EAM", 
      () => 
      {
      set_input_value
      (
        viewof selected_entities,
          "TUM,KnowledgeManagement,EnterpriseArchitecture,AOKP,mITSM,SymGmbH".split(',')
      )
      }
    ]
    ,
    [
      "typed languages", 
      () => 
      {
      set_input_value
      (
        viewof selected_entities, 
          "Cpp,_3DS,CDK,Java3D,JavaEE,ArsEdition,Logitech,mITSM,Storz,BMWBank,DCB,Völkl,CoSo,Wissenswandler".split(',')
      )
      visco.explore("Cpp") // highlight
      }
    ]
    
    /*
    [
      "Semantic + Java", 
      () => 
      {
      set_input_value
      (
        viewof selected_entities,
          "TUM,Java,KnowledgeManagement,BMWBank,DCB,mITSM,SAP,Storz,Wissenswandler".split(','),
          entity_timelines
      )
      }
    ]
    ,
    [
      "Cloud Architect (Java)", 
      () => 
      set_input_value
      (
        viewof selected_entities,
          "TUM,KnowledgeManagement,SwEngineering,Java3D,JavaEE,Javascript,SAP,Storz,SymGmbH".split(','),
          entity_timelines
      )
    ]
    ,
    [
      "Gaming & Data", 
      () => 
      set_input_value
      (
        viewof selected_entities,
          "KnowledgeManagement,Visualization,ArsEdition,SAP,Storz,BMWBank,Völkl,SymGmbH".split(','),
          entity_timelines
      )
    ]
    ,
    [
      "SNow CMDB JS", // ServiceNow CMDB Javascript
      () => 
      set_input_value
      (
        viewof selected_entities,
          "EXIN,Axelos,ConfigManagement,Javascript,ServiceNow,AfI,BIT,bitvoodoo,kubus,AOKS,LHMS,DZB,ING,SymGmbH".split(','),
          entity_timelines
      )
    ]
    */
    
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
```

```js
bookmark_current
```

## 2. Tabular View

```js
tab_cv = tabular_view( ["client","skill"], ["Client / School","Skills involved"] )
```

## 3. Diagram View

```js
viewof diagram_toggles
```

```js
viewof project_lod
```

```js
diagram = dot2svg(  dot_string, { fit : fit_width.length }  )
```

```js
kts_console
```

```js
viewof fit_width
```

```js
bnotes = notes
```

- - -
- - -

## Appendix

### textual definition of story + event details

```js
bogo_most_recent = "" // to be overridden e.g. in job applications to include a latest "open to work" event
```

```js
story = transform_paragraphs_to_lines (`

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

# Peter   SAPonCloud_2011_10 SAPonCloud_2013_03 - "rdfType":"person"

# Andreas   SAPonCloud_2011_10 SAPonCloud_2013_03 - "rdfType":"person"

Michael SAPonCloud_2011_10 SAPonCloud_2013_03 - "rdfType":"person","node":"URL='https://freitag.expert'"

# Ulrich  
SAPonCloud_2011_10 SAPonCloud_2013_03 GlobalContainerPipeline_2018_01 GlobalContainerPipeline_2018_03 ProjectManagement_2022_11 ProjectManagement_2023_06 - "rdfType":"person","endNode":"ING_future"

Michael BüroGemschftSeefeld_2006 Symsuite_2020_09 Symsuite_2022_10 - "rdfType":"person","endNode":"SymGmbH_future"

Christoph                        Symsuite_2020_09 Symsuite_2022_10 - "rdfType":"person","endNode":"SymGmbH_future"

Frank   
LDI_2015_04 LDI_2017_02  ZAM_2017_04 ZAM_2017_06  BusinessServiceManagement_2018_04 BusinessServiceManagement_2019_08 - "rdfType":"person","endNode":"AOKP_future"

# Tino  
BusinessServiceManagement_2018_04 BusinessServiceManagement_2019_08 Symsuite_2020_09 Symsuite_2022_10 - "rdfType":"person","endNode":"SymGmbH_future"

# Robin 
BusinessServiceManagement_2018_04 BusinessServiceManagement_2019_08 Symsuite_2020_09 Symsuite_2022_10 - "rdfType":"person","endNode":"SymGmbH_future"

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
`)
```

```js
events_json =
{ return Object.assign ( 
  {
    CoSo_1999_09  : { cssClasslist : "global_type_CoSo" , graphvizShape : "none" , graphvizLabel : "🏢 Continental Software GmbH" , htmlTooltip : "Foundation of Continental Software GmbH, fully owned by Boran Gögetap" }
    ,
    CoSo_2016_07  : { cssClasslist : "global_type_CoSo" , graphvizShape : "none" , graphvizLabel : "⬛" , htmlTooltip : "Termination of Continental Software GmbH for the sake of leaner management" }
 }

, project_json(
  "EmotionalIntelligence_2023_11",
  "Emotional Intelligence Workshop",`delivering a method 
(Angstregulierung) and performing exercises 
to manage anxiety in potentially stressful situations

see https://observablehq.com/@bogo/angstbewaeltigung

Boran contributes as Coach`
)

, project_json(
"SwedenToFrance_2022_05",
"Sweden to Bretagne",`solo sailing trip from Sweden to Bretagne on small hybrid katamaran Maru`,
"SwedenToFrance_2022_10"
)
  
, project_json(
"ParaglidingPilot_2013_06",
"🎓 Pilot license",`
license for solo paragliding
(issued by DHV, DE)`
)
, project_json(
"PassengerPermit_2015_08",
"🎓 Passenger Permit",`
license for paragliding with passenger
(= tandem / biplace) issued by DHV, DE`
)
, project_json(
"ParaglidingInstructor_2018_11",
"🎓 Paragliding Instructor",`
license to coach paragliding students
issued by DHV, DE`
)
  
, project_json(
"ITILServiceManager_2003",
"🎓 ITIL Service Manager",`
ITIL (v2) Service Manager 
certificate issued by EXIN, NL`
)
, project_json(
"ITILv3Expert_2007",
"🎓 ITIL Expert",`ITIL (v3) Expert
certificate issued by Axelos, UK`
)

, project_json(
"GymnasticsCoach_1987",
"🎓 Gymnastics Coach",`license to coach Gymnastics 
(Fachübungsleiter Geräteturnen, issued by BLSV, DE)`
)

, project_json(
"Fusion_2008",
"Fusion",`AOK Sachsen und AOK Thüringen 
fusionieren zur AOK PLUS und gründen 
zusammen mit der AOK Bayern die kubus IT`
)

 , project_json(
"Ethikfilter_2014",
"❤️ Ethics Filter",`from this point on, all my clients and project goals
are officially and consistently filtered by my personal ethical standards,
e.g. no bribing, no defense/military/weapons and no coal/oil/gas [...]

good-bye to many DAX companies and former clients, such as
BASF, BMW, Daimler, Lufthansa, German Telekom, Siemens and others`
)

, project_json(
"Istanbul_1969_02",
"🕯born in Istanbul",``
)
, project_json(
"Wiesbaden_1970",
"moved to Wiesbaden",``
)
, project_json(
"München_1976",
"moved to München",``
)
  
, project_json(
"ComputerScience_1989",
"🎓 Computer Science",`studies
with major in "Informatik" 
and minor in Psychology;
dropped out without diploma`,
"ComputerScience_1993"
)

, project_json(
"MagicMotion_1995",
"📀 Magic Motion",`CD-Rom Content and Software production

inventing animated stereovision (1st in history) 
based on the algorithm for "Magic Eye" still images,
we create suitable 3D models in 3D Studio (3DS),
implement a post-processing filter for 3DS, 
render "Magic Motion" videos, and
implemented a custom UI for viewing such videos

published under ISBN 9783760711461

Boran serves as Solution Architect
and Software Developer`)

, project_json(
"Cybertennis_1996",
"📦 Cybertennis",`immersive VR development

designing an immersive tennis court featuring
a real tennis racket with force feedback
plus a 3D-tracked head-mounted display (HMD)
as one part of the UI, and a virtual opponent
in a 3D scene which is rendered in real-time
and viewed in the HMD.

Boran serves as Solution Architect 
and Software Developer`
)
 
, project_json(
"Magellan_1993_10",
"Magellan suite for AutoCAD",`
working with Logitech (USA) to create a toolset
for intuitive designing and viewing of 3D models
within the AutoCAD software application

Boran serves as 3D Consultant + Solution Architect`,
"Magellan_1994_03"
)

, project_json(
  "ClimbingInstructor_2014_05",
  "🎓 Climbing Instructor","license to coach rock climbing (Trainer-C level, issued by DAV, DE)" 
)
  
, project_json(
"FoundInSpace_2001",
"📦 Found in Space", 
`3D Viewer for Knowledge Graphs

creating shapes for 'shapeless' data

various applications in data mining, data
warehousing, reporting and visualizing; 
works best for datasets that quickly change
in structure or size,
such as Configuration Items in an active
Service Provider organization 
-> frequently used in CMDB workshops

see https://youtu.be/bQgxX6pwGWY`
)
  
, project_json(
"eFF_2001_09",
"eFinanceFactory",`
developing business logic and web applications for
calculating financial products (lease and loan);

implementation based on Java Enterprise Edition (J2EE)
and Gillardon’s FinanceCore

Boran manages project on supplier’s side
and contributes as IT Architect`,
"eFF_2003_03"
)

, project_json(
"ITProjectManager_1997_12",
"IT Project Manager",`
managing projects for middleware and web applications

analysing and documenting requirements,
selecting and leading partners, 
reviewing work results such as high-level 
and detailed software design, 
managing test cases based on input from the business side, 
managing the quality of a project and software product results

Boran manages projects on customer’s side`,
"ITProjectManager_1999_06"
)

, project_json(
"Lithotrack_1997",
"📦 Lithotrack",`
developing a 3D navigation system to visualize 
and guide non-invasive medical surgery; 

certified for clinical use by 
FDA (US Food and Drug Administration)
and LGA (German Landesgewerbeanstalt) 

Boran manages project on supplier’s side
and contributes as Solution Architect`,
"Lithotrack_2001_12"
)

, project_json( 
"LithotrackJ_2002",
"📦 Lithotrack-J",`migrating Lithotrack
from 'PC' to 'Pocket-PC' hardware platform, and
from C++ based CDK to Java based 3D toolkit
to enable a much leaner form factor`,
"LithotrackJ_2006_06"
)

, project_json(
"UIS_1999_10",
"UIS",`"Universal Internet Services"

middleware services for clusters of
Microsoft Internet Application Servers

analysing requirements of web applications 
which execute on a clustered farm of IIS servers;

designing a solution for centralised 
middleware services to manage session state 
and serve content which is 'localized' in 
different languages but also for different 
geographical regions and for different brands 
(BMW, Rover, Mini…)

calculating all financial services (lease, loan...)
based on Gillardon's FinanceCore component

implementing all services in Java (2)
Enterprise Edition (EJB) with COM proxies

Boran manages project on supplier’s side
and contributes as solution architect`,
"UIS_2006_03"
)

, project_json(
"BPMspace_2005",
"📦 BPMspace",`
designing and implementing a custom toolsuite 
for process modelling and configuration management
in a joint venture between mITSM GmbH and
Continental Software GmbH

used for prototyping in ITSM consulting projects
as well as internal ERP, CRM and ITSM tool

Boran contributes as Product Owner`,
"BPMspace_2007_08"
)

, project_json(
"itsmTraining_2009_01",
"Custom ITSM and Servicedesk Training",`
creating training concept to deliver knowledge about 
custom ITSM process implementation and 
underlying tool support to 650 staff members; 

conduct pilot trainings; train additional trainers

Boran contributes as Author, Trainer / Coach
`,
"itsmTraining_2009_04"
)

, project_json(
"ItilLectures_2007",
"ITIL Lectures",`teaching Service Management practices,
based on ITIL and ISO 20.000, as part of an MBA study
"Strategisches Informationsmanagement"

Boran serves as Lecturer`,
"ItilLectures_2008_12"
)
  
, project_json(
"ITSMreq_2007_02",
"Requirement Specification for ITSM Tool",`
analysing tool requirements based on process
workflow models; documenting generic and 
specific requirements for a tool or tool suite.

Boran contributes as Process Consultant
and Requirements Engineer
`,
"ITSMreq_2007_05"
)

, project_json(
"ITGovernance_2008_02",
"IT Governance Consulting",`
analysing training needs for Information Security department;

conducting training workshops based on CobiT;
moderating self-assessment workshops based on CMMI 
and CobiT concepts of process maturity;

reviewing IT architecture from a Governance perspective

Boran contributes as Consultant, Trainer / Coach`
)

, project_json(
"bitCMDB_2011_07",
"Configuration Modelling workshops",`
delivering workshops and conceptional review for
providing key skills in analyzing and modelling
a Configuration Management System (CMS) / CMDB;

accessing various data sources to collect
business objects / Configuration Items (CIs):
BMC (Atrium, Patrol, Remedy), AixpertSoft 
(AixBOMS), SAP, Microsoft (Excel);

re-engineering a cross-departemental service model;
defining information ownership and maintenance concept; 

"Bundesamt für Informatik und Telekommunikation" is a
shared IT service unit for the Swiss federal goverment.

Boran contributes as Consultant, Trainer / Coach
`,
"bitCMDB_2011_09"
)

, project_json(
"DeploymentAutomation_2007_12",
"IT Deployment Process Automation",`
identify potential for automation of Deployment Process
in complex datacenter operations 
(50+ tasks in 10+ teams for every single deployment)

prototyping implementations to orchestrate many 
interdepending tasks and gradually automate
simple tasks completely based on jBPM and ALBPM workflow
engines with interfaces to internal ticket system`
)

, project_json(
"QualityClimbingSession2_2014_08",
"Quality Climbing",`Management Training Format 
with 50% practical exercises in a rock climbing gym

Climbing as a highly motivating example of
Risk- , Incident- and Service Management
with "skin in the game" and lots of fun.` )

, project_json(
"QualityClimbingSession1_2011_05",
"Quality Climbing",`Management Training Format 
with 50% practical exercises in a rock climbing gym

Climbing as a highly motivating example of
Risk- , Incident- and Service Management
with "skin in the game" and lots of fun.` )

, project_json(
"SAPonCloud_2011_10",
"SAP on Cloud",`Migration of large, complex and frequently changing 
SAP system landscapes into private and public cloud environments 
which are first assembled, then conserved as Cloud Templates,
distributed to regional data centers, deployed there 
and finally consumed by regional users;

Organizational facts (responsibility and accountability; milestones),
licensing and infrastructure details, software products and
release versions, stages and links in a supply chain
are all kept in a CMDB / Configuration Management System (CMS).

The CMS is implemented as an RDF triple store (repository)
with extensive use of the SPARQL language to generate complex reports.`,
"SAPonCloud_2013_03"
  )

, project_json(
"MapIT_2004_04",
"Map IT",`IT Governance / CMDB

Solution for modelling Business Processes (BP) plus supporting
IT Assets (application systems, databases, infrastructure)
of BMW Financial Services worldwide within ARIS;

developing scripts for queries, 
automated import from external data sources 
and automated analyses:
 Application Map (Bebauungsplan),
 Fault Tree / CFIA for Business Continuity Management (BCM);

Documenting modelling conventions and creating process manuals;
Developing training material and conduct train-the-trainer sessions
with configuration analysts for rolling out the solution 
to BMW FS subsidiaries worldwide.

nominated for the Process Excellence Award by IDS Scheer

Boran contributes as Solution Architect`,
"MapIT_2004_12"
)

, project_json(
"GlobalContainerPipeline_2018_01" ,
"Global Container Pipeline",`Planning and visualizing
a container-based and secure 
Continuous Delivery workflow`,
"GlobalContainerPipeline_2018_03"
)

, project_json(
"TandemPilot_2020_07",
"Tandem Pilot",`
commercial paragliding flights with guests;

supervising flight and education activities
on site as a paragliding instructor`
)

, project_json(
"RUP_2006_04",
"RUP & ITIL",`develop and conduct custom integrated training course

"Rational Unified Process (RUP) and ITIL Application Management"

including ITIL Foundation certification`
)

, project_json(
"AfICMDB_2019_11"
  ,
"CMDB Design",`
planning and prototyping for a CMDB as 
Knowledge Base for IT Services that are served 
in a multi-tenant and multi-client fashion`,
"AfICMDB_2020_08"
)

, project_json(
"Symsuite_2020_09",
"Symsuite",`creating an integrated platform
to support the most vital business processes
for any small or medium sized enterprise (SME)

based on a multi-tenant Knowledge Graph;

involves Enterprise Architecture, Process Design,
IT Architecture and related implementations;

use of Jira as CMDB and agile process management tool,
with KTS-bash as backend for routine visualization,
ad-hoc queries and complex government tasks such as
validating strictly role-based authentication;

Boran contributes Knowledge Management expertise
and graph-related software implementation`
,
"Symsuite_2022_10"
)

, project_json(
"ProjectManagement_2022_11",
"Project Management",`orchestrating project management tasks
for a set of related, national and international projects;

involves maintenance of Business Cases and
performing Business Impact Analysis (BIA)

using KTS to track complex inter-dependencies`
,
"ProjectManagement_2023_06"
)

, project_json(
"PerpetualTraveller_2022_05",
"⛺ Perpetual Traveller",`
living and traveling beyond 
and without registered residence`
)

, project_json(
"bitvCMDB_2019_10",
"CMDB Workshop for ITSM Consultants",`
bitvoodoo serves customers with expertise in
Jira and Confluence installations. To complete 
their portfolio, we look into Jira as a CMDB.

Boran contributes as Configuration Management expert`
)

, project_json(
"CSI_2014_02",
"CSI",`Configuration Management subproject of CSI
(= Configuration-Managment, Service-Level-Management
and Servicedesk)

analyzing service models between Business Processes 
and supporting IT Infrastructure;

designing data model for federated CMDB between 
IBM Maximo and various data providers such as
VM-Ware, HP-SIM, Enteo, Stablenet…

designing standard IT Architecures and blueprints;

devloping Conviz (based on KTS) to visualize
complex configuration models automatically;

reviewing ITSM processes according to COBIT framework;

Boran contributes as Configuration Management expert`
,
"CSI_2016_10"
)

, project_json(
"LDI_2015_04",
"Infrastructure Capability Analysis",`
"Leistungsfähigkeit der Infrastruktur (LDI)":

Identifying the existing Enterprise Architecture
top-down from Values and Goals, to business 
processes and capabilities, to supporting IT
applications and infrastructure at kubus IT
and other providers.

Modelling all facts in a causal map.

Prototyping to connect the IT providers's 
CMDB and Service Catalogue with the 
Business Process Map from ARIS.

Boran contributes as Analyst und Architect`,
"LDI_2017_02",
`Bestandsaufnahme der Unternehmensarchitektur, 
angefangen bei Zielen und Werten, weiter über
Geschäftsprozesse und Fähigkeiten, bis zu 
Softwaresystemen und technischer Infrastruktur 
bei kubus IT und anderen Dienstleistern.

Modellierung der Fakten in einem Ursache-Wirkungs-Netz;

prototypische Anbindung der CMDB
inklusive Servicekatalog von kubus IT 
sowie Geschäftsprozesslandkarte der AOK PLUS aus ARIS.

Boran unterstützt als Analyst und Architekt` // unused
)

, project_json(
"ZAM_2017_04",
"Centralized Demand Management",`
"Zentrales Anforderungsmanagement":

Migrating 4 previously independent but similar business
processes into 1 new, "centralized demand management".

Turning output from the LDI project into an implementation.

Workflows for requirements, projects, budget requrests,
requirement specifications and IT requests help recording,
assessing and executing all forms of demand.

Using Jira as an agile process- and service platform.

Boran contributes als Process Consultant and Architect`
,
"ZAM_2017_06",`
Konzeption und Implementierung eines Business Service Prozess

Basierend auf den Befunden aus dem LDI-Projekt entwerfen wir
einen Soll-Prozess der die unterschiedlichen Arten und Quellen
von Anforderungen im Unternehmen konsolidiert.

Workflows für Anforderungen, Projekte, Haushaltsanträge,
Pflichtenhefte, IT-Aufträge und Normen unterstützen Mitarbeiter 
in der Erfassung, Bewertung und Umsetzung von Anforderungen 
über alle Kanäle hinweg.

Einsatz von Jira als agiles Prozesswerkzeug.

Boran unterstützt als Prozessberater und Architekt` // unused
)

, project_json(
"BusinessServiceManagement_2018_04",
"Agile Management Processes",`
designing and implementing additional Management 
Processes following the sucessful pattern of "ZAM"

Implementing prototypes and operational versions of:
Risk Management, Management by Objectives (MBO), 
Talent-Management, agenda items and formal protocols.

Establishing a new internal full-stack support team.

Using Jira as an agile process- and service platform.

Boran contributes als Process Consultant and Architect`
,
"BusinessServiceManagement_2019_08",
`Konzeption und Implementierung weiterer agiler Managementprozesse

Nach dem Vorbild des Zentralen Anforderungsmanagement analysieren 
wir weitere Managementprozesse, entwerfen Soll-Prozesse, entwerfen
eine passende IT-Architektur und implementieren prototypische oder
operative Lösungen (Risiko-Management, Management by Objectives, 
Talent-Management, Tagesordnungen und Protokolle).

Aufbau eines internen Expertenteams für Support und Weiterentwicklung.

Einsatz von Jira als agiles Prozesswerkzeug.

BG unterstützt als Prozessberater und IT-Architekt` // unused
)

, project_json(
"lhmsCMDB_2019_02",
"Implementing SACM",`
LHM Services is an internal IT Service Provider 
for the City of Munich.

LHM-S introduces a new process and a new tool in
Service Asset & Configuration Management (SACM)
for their highly distributed services.

Project tasks in this phase include the process description,
a draft for the new CMDB model and the analysis of
specific requirements for the new CMDB and process tool.

Boran contributes as Configuration Management 
and Process Management expert`,
"lhmsCMDB_2019_09",
`Die LHM Services, Tochter der Landeshauptstadt München, 
liefert IT-Services an das Referat für Bildung und Sport.

Zur optimalen Steuerung der stark verteilten Services
führt die LHM-S einen neuen Prozess sowie ein neues Werkzeug
für Service-Asset- & Configuration Management (SACM) ein.

Projektaufgaben in dieser Phase umfassen die Prozessbeschreibung,
einen Entwurf für das neue CMDB-Modell sowie die Analyse
der spezifischen Anforderungen für das neue CMDB- und Prozesswerkzeug.

Boran contributes as Configuration Management 
and Process Management expert` // unused German text
)

, project_json(
"ITSM20_2017_10",
"CMDB Gap Analysis",`subproject of a major ITSM relauch

analyzing the current CMDB model and the Configuration
Management process for gaps and potential solutions;

ServiceNow used as CMDB and process tool;

Boran contributes as Configuration Management expert`
,
"ITSM20_2017_12"
)

/*
 * KTS family of projects or releases
 */
, project_json(
"KTSjava_2016",
"📦 KTS-Java",`
software product development using:
OWL/RDF for persistence;
SPARQL for complex queries 
that implement methods like FMEA and BIA;
massive XSLT to transform 
query results into presentation objects;
and Servlets for rendering the UI.

OWL ontology drives UI to offer creation of
required subjects / edges, and supports
powerful graph transformations
(mostly to reduce graph complexity)

software implementation uses OpenRDF Sesame 
(RDF4J) as graph database and Graphviz for rendering

Boran contributes as Solution Architect
and Developer.`
)

, project_json(
"KTSbash_2018_06",
"📦 KTS-bash",`migrating from Java / RDF / XSLT 
to jq programs and shell scripts
for widest possible options to host in CLI
/ terminal / headless environments,
such as CD pipelines, busybox or Termux

software implementation uses Graphviz for rendering

Jira is one of the supported systems for data entry 
and graph storage 

Boran continues serving as Product Owner,
Architect and Developer`
)

, project_json(
"KTSjs_2023_01",
"📦 KTS-js",`migrating jq + shell scripts 
to Javascript for hosting in node-js backends
as well as pure browser-based rendering
and for rapid prototying on ObservableHQ

software implementation uses a  Javascript
cross-compilation of Graphviz for rendering

see https://www.npmjs.com/search?q=%40kxfm
/ https://github.com/wissenswandler/kts-js

Boran continues serving as Product Owner,
Architect and Developer`
)

, project_json(
"ValueMaps_2023_02",
"📦 Value Maps for Jira",`product development 
to integrate KTS Value Maps seamlessly into
Atlassian's Jira user interface via AddOn

software implementation is based on KTS-js

see https://observablehq.com/collection/@bogo/kts-value-maps-demos`,
"ValueMaps_2023_03"
)

, project_json(
"Timelines_2023_04",
"📦 Timelines",`developing an Ontology, 
markdown syntax and visual language
to map shared events between entities
along large timespans

software implementation is based on KTS-js

useful for long-term storytelling, such as 
in diaries, biographies or CVs

see https://observablehq.com/collection/@bogo/kts-timeline-demos`,
"Timelines_2024_02"
)

) // end Object.assign

} // end cell block
```

```js
this_particular_diagram = "This particular diagram's central story is Boran's curriculum vitae (CV) with an emphasis on 'professional' events"
```

```js
style_buttons = Inputs.button
( [
  ["nothing", () => 
   {
     set_input_value(  viewof selected_entities, [] );
   }
  ]
  ,
  ["all skills", () => set_input_value(  viewof selected_entities, keep_types( ["skill"] )  )]
  ,
  ["all clients", () => set_input_value(  viewof selected_entities, keep_types( ["OU"] )  )]
  ,
  ["linear CV (Boran's timeline)", () => set_input_value(  viewof selected_entities, ["Boran"] ) ]
  ,
  ["Social CV (all people's timelines)", () => 
    {
      set_input_value(  viewof selected_entities, keep_types( ["person"] )  );
      set_input_value(  viewof project_lod, ["summary only"]          );
    }  
  ]
  ,
  ["People & Clients", () => set_input_value(viewof selected_entities, keep_types( ["person","OU"] ) )]
  ,
  ["everything", () => 
   {
     set_input_value(  viewof selected_entities, entity_timelines  );
     set_input_value(  viewof project_lod, []          );
   }
  ]
]
)
```

```js
dob = first_notice_of("Boran",entity_timelines)

```

```js
age = new Date
  (
    Date.now() - 
    new Date( dob.join('-') )
  ).getUTCFullYear() - 1970
```

```js
style
```

```js
roles_dict = 
{ return  { // this brace must be on same line as return statement !!
    "OU": "Client"
    ,
    "label":"Project / Product / Topic"
  }
}
```

```js
hpcc_js_wasm_version = "@2.8.0"
```

```js
css2xhr
```

```js
import { css2xhr } from "@bogo/css-hide-after-double-hr"
```

```js
import { get_flavour, create_grouped_input, dot_string, tabular_view, viewof project_lod, viewof fit_width, project_json, hide_types, keep_types, create_details_checkboxes, entity_timelines, bookmark_current, transform_paragraphs_to_lines, viewof diagram_toggles, dot2svg, visco, init, set_input_value, topic_events_map, first_notice_of, n_topics, total_topics, kts_console, style}
with {story, events_json, diagram_options, selected_entities, hpcc_js_wasm_version, roles_dict }
from "@bogo/timelib"
```

```js
import {diagram_options, notes}
with {this_particular_diagram}
from "@bogo/cv_template"
```

```js
my_init = {
  init( diagram );

  document.querySelectorAll( "form" )[0].style = "max-width:90%" // workaround against built-in style which limits forms to 640px
  
  yield "KTS ready"
}
```
