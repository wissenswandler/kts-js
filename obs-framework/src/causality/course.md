---
title : C
toc   : true
---

# Causality Course 

Draft text and figures

# Introduction to Causality

Definition:

> Causality is the concept of *cause and effect* with all the that come with it

## Structure

Here is the simplest building block of causality - a pair of exactly one cause and one resulting effect:

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

Personally I find it easier to understand networks [TBC...]

# Topology

Cause-and-effect-links can be composed in any and every conceivable structure. This is why we talk about a *network* of causality, because in the science of mathematics, logic or topology a *network* is the most general structure. A network can describe all possible configurations of how *things* are connected in general, and also how causes and effects are linked.

I find it useful to recognize a few typical sub-types of network.

Here you see diagrams of a chain, a tree, a fork, a cycle and two simple networks which diverge and merge along their paths.

![examples of differenty topologies of causality](/fig/causality-topology.svg)

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
import{ digraph } from "@kxfm/browser"
```
