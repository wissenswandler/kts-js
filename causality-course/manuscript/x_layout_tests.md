# x Layout Tests

```js 
import{ digraph, digraph2svg, visco } from "@kxfm/browser"
```
## a
Leanest case: ${digraph`root -> intermediate -> result`} inline client-side diagram 

## b
Client-side diagram from fenced code block:
```js
digraph`more[label="more ..."] root -> intermediate -> more -> symptom`
```

## c
Client-side diagram from fenced code block, plus Visco initialization:
```js
digraph`more[label="..."] root -> intermediate -> more -> result  node[label="side effect"] root->side1 intermediate->side2 `
.then( d => d
  .explore( 'root' )
  .explore( 'result' )
  .e( 'j' )
 )
```

Test cases a - c above all take their diagram definition from within this markdown document (in Observable Framework). This requires a proprietary Markdown extension by Observable, a technique which is not compatible with Leanpub. However it is great for first draft documents, which can be written and previews in Obs Framework Dev server. 

Before publishing them on Leanpub, such diagrams need to be refactored: extract DOT code from MD manuscript to a new file, standard data loader for conversion of DOT to SVG, then replace reference in MD manuscript to MD image tag (such as in test case d)
- - -

## d
Below is an SVG image from a source (file) which is external to this Markdown file, but local to the manuscript, and thus should be compatible with Leanpub.

Mind that an SVG *image* can't be interactive. This is perfectly fine in books (perhaps not in courses), unless the author wishes to add some selection to the diagram (such as in exampe c above).

![examples of differenty topologies of causality](/fig/causality-topology.svg)
SVG image, coded as markdown

**This is the only compatible technique which works in Leanpub and Obs Framework.**

Also this technique has the best potential for re-using the diagram, as its (DOT) source is kept as a separate file, and the SVG gets generated automatically (by Obs Framework Preview server, or Obs Framework Build process).

- - -

## e
In theory, we could inline SVG source as HTML-like code inside MD.

There are two reasons why this is not a useful workflow for a manuscript which is meant to be used at Leanpub:

1. Markua on Leanpub does not support HTML (and SVG) tags directly. There needs to be a directive around it. So the code would not be interoperable between Leanpub and other MD implementations (Obs Framework Dev server e.g.)

1. Inserting the SVG from a source which had produced it is a manual process. It is just easier to generate an SVG by a dataloader, as in test case c.


