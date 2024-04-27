// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "KTS",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages:
  [
    { name: "Value Maps Portfolio",
      open:true,
      pages: 
      [
        {name: "Nomadic Sustainable Life"      , path: "/nomadic-household"}
      ]
    }
    ,
    { name: "Value Maps demos",
      open:false,
      pages: 
      [
        {name: "Value Map Playground"          , path: "/valuemap/playground"},
        {name: "Neural Networks"               , path: "/valuemap/neural-networks"}
      ]
    }
    ,
    { name: "kxfm lib tests",
      open:false,
      pages:
      [
        {name: "simplest demo (static diagram)", path: "/lib-demo"},
        {name: "animated diagram transitions"  , path: "/lib-ani"},
        {name: "full API demo"                 , path: "/lib-0-full"},
        {name: "composed diagram (details)"    , path: "/lib-z-composed-parts"},
        {name: "error handling in DOT source"  , path: "/lib-9-dot-source-error"},
      ]
    }
  ],

  // Some additional configuration options and their defaults:
  theme: "dashboard", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  footer: "", // what to show in the footer (HTML)
  toc: false, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // root: "docs", // path to the source root for preview
  // output: "dist", // path to the output root for build
  search: true, // activate search
};
