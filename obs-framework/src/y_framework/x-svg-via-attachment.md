# KTS SVG via dataloader
  
SVG image as static FileAttachment from a dynamic Dataloader.

Images are defined by a text in DOT language, which gets built into the static site at generation time.

```js 
display
(
d3.create("span")
  .classed( "ktscontainer", true )
  .html
  (
    await FileAttachment( "/img/simplegraph.svg" ).text()
  )
  .node()
)
```

Note that a dataloader is executed from the Framwork's root folder (the one above /docs/), so that any relative path should be relative to that root folder. This affects e.g. the path to a DOT source file that may get transformed by dot2svg.

```js 
display
(
d3.create("span")
  .classed( "ktscontainer", true )
  .html
  (
    await FileAttachment( "/img/cause-effect.svg" ).text()
  )
  .node()
)
```
