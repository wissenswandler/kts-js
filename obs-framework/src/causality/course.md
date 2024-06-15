---
toc   : true
index : true
---
# Causality Course 

Draft text and figures

# Introduction to Causality <!-- leanpub style: H1 for chapter title -->

Definition:

> Causality is the concept of *cause and effect* with all of its implications

## Structure <!-- H2 Obs style: the only TOC elements; leanpub style: chapter sections -->

Here is the simplest building block of causality, a pair of exactly one cause and one resulting effect:

```js
digraph`cause -> effect`
```
<hr/>

Cases of causality, which are interesting enough to talk about, are always more complex than that. In essence, however, they are always composed of this simple building block: two elements with one causal connection.

Composing multiple building blocks produces a network of cause-and-effect. I will use the term *causal network* for it.

## Causality in our World

Causality is present everywhere in our physical and intellectual world.

While causality could also be used to reason about philosophy or metaphysical phenomena, this document focusses on the fact-based facets of causality.

## Presentation

Personally I find it easier to think about causality when I can visualize it. I hope it is similar for you. This is why I use diagrams to illustrate the concepts. I call them ***Value Maps***.

Some people might call such diagrams *mind maps*, which fits in a way because the elements in the diagram show linked ideas which we may have in mind. This is where the similarity ends, however. The popular diagram type of a *mind map* is based on the concept of a *tree*, which is a specific and limited kind of network (see [Topology](#topology)).

# Topology

> how things are connected

Cause-and-effect-links can be composed in any and every conceivable structure. This is why we talk about a *network* of causality, because in the science of mathematics, logic or topology a *network* is the most general structure. A network can describe all possible configurations of how *things* are connected in general, and also how causes and effects are linked.

I find it useful to recognize a few typical sub-types of network.

Here you see a summary diagram of different topolgy types: chain, tree, fork, cycle and two simple networks which fork and join along their paths.

![examples of differenty topologies of causality](/fig/causality-topology.svg)

In a realistic causal network you can often find some or all of these topologies. It is worth knowing how these topologies work in detail, so let's take a look at them one by one.

### Chain

```js
digraph`more[label="more ..."] root -> intermediate -> more -> symptom`
```
The chain is the simplest topology. It is a linear sequence of causes and effects.

The first cause in a chain is sometimes called the *root cause* and the last effect is sometimes called the *symptom*. All the elements in between are both: *cause* of the following and *effect* of the previous. 

If we want to point out an indirect connection between a root cause and a symptom, then we might choose a chain. 

Often this is a simplification because actually most causes have mulitple effects. It is just that we are not interested in all of them, for the purpose of understanding one particular symptom. Here are the stages of the simplification process:

1. The real situation is a little bit complex...
```js
digraph2svg( `more[label="..."] root -> intermediate -> more -> result  node[label="side effect"] root->side1 intermediate->side2 `)
```
2. ... and we choose to look only at the elements of interest (direct path between root and result):
```js
digraph2svg( `more[label="..."] root -> intermediate -> more -> result  node[label="side effect"] root->side1 intermediate->side2 `)
.then( d => d
  .explore( 'root' )
  .explore( 'result' )
  .e( 'j' )
 )
```
3. We don't mention the side effects anymore...
```js
digraph2svg( `more[label="..."] root -> intermediate -> more -> result `)
```
4. ... and now the situation seems to be linear: a simple chain.

There is nothing wrong about simplification. Actually it is the only way how we can live in a complex world. At the same time, we must be aware of the simplifications that we make, and be ready to revise or view when necessary.  
  
```js
digraph2svg( `more[label="..."] root -> intermediate -> more -> result  side1[label="side effect"] root->side1->damage `)
```
5. bonus: if the side effect causes damage, then we should broaden our view. Now the causal network does not look like a chain any more. It has rather a *fork* topology.

### Tree



### Fork

### Join

...

## Mathematically speaking

The data structure of a causal network is a *directed graph*.

A *graph* is a network of nodes, connected by edges. A *directed graph* is a graph where the edges direction matters.

There is a huge difference between the situations where you "work in order to live" or where you "live in order to work". Both statements make sense and they describe different situations. This is why we need directed graphs.



<div id="ktsConsole">KTS loading...</div>

<style>

p > span.ktscontainer       { box-shadow    : unset; }
p > span.ktscontainer > svg { margin-bottom : -14px; } /* align vertically with text */

div:has( > span.ktscontainer),
  p:has( > img )
                            { width: 100%; max-width: unset; display:flex; justify-content: center; }

div#ktsConsole { display: none; }

</style>

```js 
import{ digraph, digraph2svg, visco } from "@kxfm/browser"
```
