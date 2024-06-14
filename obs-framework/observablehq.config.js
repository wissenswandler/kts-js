// See https://observablehq.com/framework/config for documentation.
export default {

  title: "KTS",
//title: "Boran Gögetap",   // used in the sidebar and webpage titles

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages:
  [
    { name: "1a Value Maps Portfolio",
      open:true,
      pages: 
      [
        {name: "Nomadic Sustainable Life (i)"   , path: "/nomadic-household"      },
      ]
    } ,
    { name: "1b Timelines Portfolio",
      open:true,
      pages: 
      [
        {name: "Sinking of Rainbow Warrior"     , path: "/rainbow-warrior"        },
        {name: "Boran's CV (i)"                 , path: "/cv" , pager: false      },
      ]
    } ,
    { name: "2a Value Maps demos",
      open:false,
      pages: 
      [
        {name: "Value Map Playground (i)"       , path: "/valuemap/playground"    },
        {name: "Neural Network Animation (i,a)" , path: "/valuemap/neural-network"},  
        {name: "Logical AND (i)"                , path: "/valuemap/logical-and"   },
      ]
    } ,
    { name: "2b Timelines demos",
      open:false,
      pages: 
      [
        {name: "Casablanca"                     , path: "/casablanca"             },
      ]
    } ,
    { name: "3a Value Maps (+ kxfm) library",
      open:false,
      pages:
      [
        {name: "simplest demo (static diagram)" , path: "/lib-demo"               },
        {name: "animated diagram transitions"   , path: "/lib-ani-transition"     },
        {name: "animated diagram selections"    , path: "/lib-ani-visco"          },
        {name: "full Value Maps demo"           , path: "/lib-0-full"             },
        {name: "composed diagram (details)"     , path: "/lib-z-composed-parts"   },
        {name: "error handling in DOT source"   , path: "/lib-9-dot-source-error" },
      ]
    } ,
    { name: "3b Timelines library",
      open:false,
      pages:
      [
        {name: "full Timelines  demo"           , path: "/lib-timelines"          },
      ]
    } ,
  ],

  root  : "src",        // path to the source root for preview
  theme : "dashboard",  // try "light", "dark", "slate", etc.
  style : "kxfm.css",

//pager : true,         // whether to show previous & next links in the footer
//header: "",           // what to show in the header (HTML)
  footer: "",           // what to show in the footer (HTML)

  search: true,         // activate search
  toc   : false,        // whether to show the table of contents

//output: "dist",       // path to the output root for build

};
