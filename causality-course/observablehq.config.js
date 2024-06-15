// See https://observablehq.com/framework/config for documentation.
export default {

  title: "Causality",   // used in the sidebar and webpage titles

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  /*
  pages:
  [
    { name: "1b Timelines Portfolio",
      open:true,
      pages: 
      [
        {name: "Boran's CV (i)"                 , path: "/cv" , pager: false      },
      ]
    } ,
  ],
  */

  root  : "src",        // path to the source root for preview
  theme : "dashboard",  // try "light", "dark", "slate", etc.
  style : "book.css",

//pager : true,         // whether to show previous & next links in the footer
//header: "",           // what to show in the header (HTML)
  footer: "",           // what to show in the footer (HTML)

  search: true,         // activate search
  toc   : true,         // whether to show the table of contents

//output: "dist",       // path to the output root for build

};
