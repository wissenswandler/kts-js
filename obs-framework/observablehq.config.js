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
        {name: "Nomadic Sustainable Life"      , path: "/nomadic-household"},
      ]
    }
    ,
    { name: "Value Maps demos",
      open:false,
      pages: 
      [
        {name: "Value Map Playground"          , path: "/valuemap/playground"},
        {name: "Neural Network Animation"      , path: "/neural-network"},
      ]
    }
    ,
    { name: "Timelines demos",
      open:false,
      pages: 
      [
        {name: "Casablanca"                    , path: "/casablanca"},
      ]
    }
    ,
    { name: "kxfm lib tests",
      open:false,
      pages:
      [
        {name: "simplest demo (static diagram)", path: "/lib-demo"               },
        {name: "animated diagram transitions"  , path: "/lib-ani-transition"     },
        {name: "animated diagram selections"   , path: "/lib-ani-visco"          },
        {name: "Timelines"                     , path: "/lib-timelines"          },
        {name: "full API demo"                 , path: "/lib-0-full"             },
        {name: "composed diagram (details)"    , path: "/lib-z-composed-parts"   },
        {name: "error handling in DOT source"  , path: "/lib-9-dot-source-error" },
      ]
    }
  ],

  root : "src", // path to the source root for preview
  theme: "dashboard", // try "light", "dark", "slate", etc.
  style: "kxfm.css",

  // header: "", // what to show in the header (HTML)
  footer: '<script src="/lib/graph.js"></script>', // what to show in the footer (HTML)

  search: true, // activate search
  toc: false, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer

  // output: "dist", // path to the output root for build

};
