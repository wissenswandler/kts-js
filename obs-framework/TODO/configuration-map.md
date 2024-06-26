# Configuration Map (ITIL) example
#### to answer _Interesting Questions in Service Management_ in simple language

Hover or click on any box (in the diagram below) to investigate its path of impact or dependencies (will appear colored).

You can use such colored paths as a starting point like for Business Impact Analysis (BIA), Root Cause Analysis, Fault Tree Analysis (FTA) or Failure Mode and Effects Analysis (FMEA, "Fehlermöglichkeitseinflussanalyse").

```html
<div id="ktsConsole"/>
```

```js
value_map = htl.html`<div id="ktscontainer">
${
dot`

strict digraph {

fontsize=15

# # # # # # # # # 
#
# standard style in WOC
# (Wissenswandler Ontology for Causality)
#

labelloc=t	# the diagram's title on top
rankdir =BT	# most 'valuable' things go on top, supporting things (infrastructure) go to the bottom
style=filled	# to be inherited by nodes, so they remain in their fillcolor if part of colored cluster
tooltip=" "	# to avoid the default echo of a graph's id as the tooltip
 newrank=true	# to enable multiple ranking constraints which are evaluated globally (not per cluster)
 
nodesep="0.2"	# condense
ranksep="0.4" 	# condense

graph [
 fontname=Helvetica
 color=whitesmoke
 remincross=true
 splines=true
 shape=none
]

node [
 fontname=Helvetica
 shape=box	# a matter of taste, slightly influenced by UML
 style="filled,rounded" # instances shall appear more soft and friendly (classes with sharp corners)
 fillcolor=white
 id="\\N"
 tooltip=" "	# to avoid the default echo of a node's id as the tooltip

 margin=0.1 	# condense
 width=0  	# condense
 height=0 	# condense
 ]
	
edge [
 color=forestgreen	# represents positive effects (adding value)
 penwidth=2	# width 2 is easier to click on
 fontsize=10	# smaller than the default of 12 in nodes
 id="\\T___\\H"
] 


# # # # # # # # # 
#
# legend
#
subgraph cluster_legend_svg
{
label=""
style="" # prevent inherited filling
color=white

node [ fontsize=10 shape=note color=white fontcolor=white ]
svg_legend_metamodel [label="MM..." tooltip="click for Metamodel and more legend..." URL="../metamodel/"]

}

subgraph cluster_legend_times_and_sequences
{
label=""
fillcolor=ghostwhite

node [ fontsize=10 ]

future [ style="filled,rounded,dotted" color="" fontcolor="" ]	# style = redundant with future nodes!!
present
past [ style="filled,rounded,dashed" color=grey fontcolor=grey ]# style = redundant with historical nodes!!

} # end cluster_legend

subgraph cluster_spacer
{
label=""
style=invis ## invisible spacer layout hack

node [ fontsize=10 style=invis ]
spacer
}

# # # # # # # # # 
#
# standard nodes
#

this_symptom [label="this\nsymptom"]
other_symptom [label="other\nsymptom"]
third_application [label="third\napplication"]
some_information [label="some\ninformation"]
other_information [label="other\ninformation"]
third_server [label="third\nserver"]
third_software_product [label="third software\nproduct"]
free_license [label="free\nlicense"]
other_software [label="other\nsoftware"]
b_user [label="b\nuser" tooltip="business user role"]
import [tooltip="happens every morning"]
other_server [label="other\nserver"]
other_server_model [label="server\nmodel"]
other_software_product [label="other software\nproduct"]
new_software_test [label="new\nsoftware"]
other_software_test [label="other\nsoftware"]
commercial_license [label="commercial\nlicense" tooltip="this license does require a fee for test installations" ]
other_subnet [label="other\nsubnet"]
one_route [label="one\nroute"]
this_software [label="this\nsoftware"]
a_user [label="a\nuser"]
this_service [label="this\nservice"]
the_router [label="the\nrouter"]
this_subnet [label="this\nsubnet"]
lab_server [label="lab\nserver"]
internal_qa [label="internal\ntesting"]
this_server [label="this\nserver"]
other_vendor [label="other\nvendor "]
new_software_product [label="new software\nproduct"]
other_manufacturer [label="manufacturer"]

# # # # # # # # # 
#
# historical nodes
#
{
node [ style="filled,rounded,dashed" color=grey fontcolor=grey ]

old_software [label="old\nsoftware"]
}


# # # # # # # # # 
#
# future nodes
#
{
node [ style="filled,rounded,dotted" color="" fontcolor="" ]

privacy_requirement	[label="privacy\nrequirement"]
other_software_planned	[label="planned new\nsoftware"]
c_user			[label="c\nuser"]
new_customer		[label="new\ncustomer"] 
}

# # # # # # # # # 
#
# legend
#
subgraph cluster_legend_realization
{
label=""
fillcolor=ghostwhite
#rank=min

node [ fontsize=10 ]
node [ shape=none ]

instance
blueprint

} # end cluster_legend

#
# generic provider->consumer-legend outside clusters for global ranking
#
{
node [ fontsize=10 shape=none ]

provider -> consumer [ label="&nbsp; value" ]
}


# # # # # # # # # 
#
# standard edges
#

some_information -> privacy_requirement
other_vendor -> other_software_product

 this_server ->  this_software
other_server -> other_software -> { b_user, this_symptom, import }

the_router -> one_route -> import -> this_software -> a_user

 this_subnet ->  {  this_server, one_route }
other_subnet ->  { other_server, one_route, third_server }

third_application -> { some_information, other_information, other_symptom }
third_server -> old_software

{some_information, other_information} -> this_service

commercial_license -> other_software_product
      free_license -> third_software_product

lab_server -> { other_software_test, new_software_test } -> internal_qa

other_software_planned -> c_user -> new_customer

other_manufacturer -> other_server_model

#
# map of questions
#
{
node [ shape=none ]
edge [ penwidth=2 ]
edge [ colorscheme=ylorbr7 ]
node [ colorscheme=ylorbr7 ]

  node [ style=invis ]; edge [ style=invis ] ## question visibility <-- dont change this marker ##

#
# forward reasoning, effect side
#
node [ fillcolor=1 ]
edge [     color=2 ]

qaa1 [label="A 1"]
qaa2 [label="A 2"]
qaa6 [label="A 6"]
qaa7 [label="A 7"]

a_user				-> qaa1
this_software			-> qaa2
internal_qa			-> qaa6
{ other_software, b_user }	-> qaa7

#
# cause side
#
node [ fillcolor=6 ]
edge [     color=6 ]

qaq1 [label="Q 1"]
qaq2 [label="Q 2"]
qaq6 [label="Q 6"]
qaq7 [label="Q 7"]

qaq1 -> this_server
qaq2 -> the_router
qaq6 -> new_software_product
qaq7 -> commercial_license


#
# backward reasoning, effect side
#
edge [ dir=back arrowtail=normal style=dashed ]
edge [ colorscheme=ylorrd7     color=2 ]
node [ colorscheme=ylorrd7 fillcolor=1 ]

  edge [ style=invis ] ## question visibility <-- dont change this marker ##

qaq3 [label="Q 3"]
qaq4 [label="Q 4"]
qaq5 [label="Q 5"]
qaq8 [label="Q 8"]
qaq91 [label="Q 9.1"]
qaq92 [label="Q 9.2"]

this_symptom		-> qaq3
privacy_requirement	-> qaq4
this_service		-> qaq5
new_customer		-> qaq8
this_symptom		-> qaq91
other_symptom		-> qaq92

#
# backw. r. cause side
#
edge [ color=6 ]
node [ fillcolor=6 ]

qaa4 [label="A 4"]
qaa8 [label="A 8"]
qaa9 [label="A 9"]

qaa4 -> third_application
qaa8 -> { other_server, other_subnet }
qaa9 -> other_subnet

} # end question map

#
# blueprint edges
#
{
edge [ arrowhead=onormal color=blue penwidth=1 /*style=dashed*/ ]

blueprint -> instance [ label=<<I><br/>realized as</I>> constraint=false ] ## legend

other_software_product -> { other_software, other_software_test }
third_software_product -> third_application
new_software_product -> { new_software_test, other_software_planned }

 other_server_model -> other_server
}

#
# sequential edges 
#
{
edge [ arrowhead=onormalonormal penwidth=1 color="" ]

past -> present -> future [ constraint=none label=<<I><br/>followed by</I>> ] ## legend

other_software -> other_software_planned

other_software_product -> new_software_product

old_software -> third_application
}

#
# hidden edges / layout hacks
#
{
edge [ style=invis ]

 instance -> provider
}


 { rank=same; provider; other_vendor }

 { rank=same; consumer; a_user }


} # end graph 
`
}
</div>
`
```

```js
Inputs.button
(
  [
    [ "1",  () => { visco.execute_command_sequence("e,this_server"        ) } ] ,
    [ "2",  () => { visco.execute_command_sequence("e,the_router"         ) } ] ,
    [ "3",  () => { visco.execute_command_sequence("e,this_symptom"       ) } ] ,
    [ "4",  () => { visco.execute_command_sequence("e,privacy_requirement,third_software_product,j") } ] ,
    [ "5",  () => { visco.execute_command_sequence("e,this_service"       ) } ] ,
    [ "6",  () => { visco.execute_command_sequence("e,N,new_software_test") } ] ,
    [ "7",  () => { visco.execute_command_sequence("e,commercial_license,a_user,j" ) } ] ,
    [ "8",  () => { visco.execute_command_sequence("e,new_customer"              ) } ] ,
    [ "9",  () => { visco.execute_command_sequence("e,this_symptom,other_symptom") } ] 
  ]
  , {label: "cheat buttons"}
)
```

```js
visco_buttons_Fe
```

Here are some example questions:

1. Who uses _**this server**_?
2. What if I replace **_the router_**?
3. Which piece causes **_this symptom_**?
4. Which software needs to be _secured_?
5. How much does **_this service_** cost us in total?
6. Who suffered from the known bug in the **_new software_**?
7. Which software installations require a **_commercial license_** fee?
8. Which computing resources should we size for the **_new customer_**?
9. Which single component could possibly cause all of these **_symptom_**s?


- - -

And here is your cheat sheet with solution screenshots:

```js
configurationMapAllSolutions = FileAttachment("configuration-map-all-solutions.png").image()
```

_visual results from using the cheat buttons above, or simply clicking the relevant Configuration Items (CIs) in the diagram above_

- - -

### Document control

this is a port from 2019 <a href="https://wissenswandler.github.io/configuration-map/" target="external">https://wissenswandler.github.io/configuration-map/</a>

re-posted on https://www.linkedin.com/posts/boran-goegetap_example-configuration-map-activity-7092985388343975936-UfsV

See this [training course on ITIL Configuration Management](https://www.goegetap.name/cmdb/modellierung/) if you want to learn more about the subject... 

- - -
- - -

## under the hood

```html
<style>

  #ktscontainer
  {
    box-shadow: 0 0 8px 1px rgba(0,0,0,.1);
    margin: 8px;
    display: inline-block;
  }

  /*
  */
  body > div > div:has( #ktsConsole )
  ,
  body > div > div:has( > form > button )
  { float: right }

  /*
  */
  body > div > div:has( ol )
  { float: left }
  
  body > div > div:has( > hr:only-child )
  ,
  body > div > div:has( style )
  { clear:both }

  /* there are no local hrefs on observable, so we need to detect external websites in a different way */
  a[href^="https://wissenswandler"] ,
  a[href^="https://www.goegetap"]   ,
  a[href*=".wikipedia."] 
  {
    background   : url(https://www.goegetap.name/img/external.svg) center right no-repeat;
    padding-right: 15px;  
  }
</style>
```

```js
css2xhr
```

```js
import { css2xhr } from "@bogo/css-hide-after-double-hr"
```

```js
import { init, visco, visco_buttons_Fe }
from "@bogo/kxfm"
```

```js
{
  init(value_map)

  visco.execute_command_sequence("e,this_symptom,other_symptom")

  return "KTS ready"
}
```
