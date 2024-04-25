// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "kxfm",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages:
  [
    { name: "Value Maps Showcases",
      open:true,
      pages: 
      [
        {name: "Nomadic Sustainable Life", path: "/nomadic-household"}
      ]
    }
    ,
    { name: "kxfm lib demos",
      open:true,
      pages:
      [
        {name: "kxfm simplest demo"          , path: "/demo"},
        {name: "Composed Value Map (details)", path: "/lib-z-composed-parts"},
        {name: "animated diagram"            , path: "/lib-ani"},
        {name: "kxfm full API demo"          , path: "/lib-0-migration-wip"},
        {name: "Value Map Playground"        , path: "/lib-1-valuemap-playground"},
        {name: "error handling in DOT source", path: "/lib-9-dot-source-error"},
      ]
    }
    ,
    { name: "kxfm lib experiments (incl. failing ones)",
      open:false,
      pages:
      [
        {name: "migration class Logic"       , path: "/TODO/logic"}
      ]
    }
    ,
    { name: "Observable Framework tests (incl. failing ones)",
      open:false,
      pages:
      [
        {name: "KTS SVG via dataloader"      , path: "/y_framework/x-svg-via-attachment" },
        {name: "Confetti imported via NPM"   , path: "/y_framework/z_confetti_npm"},
        {name: "Confetti imported via BARE"  , path: "/y_framework/z_confetti_node_local_SOLVED"},
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
