// dependency on fs breaks wds with: Could not resolve import "fs"
//export{ Tdot2svgFiles   } from "./Tdot2svgFiles.js" 

export { Tdot2svgStreams  } from "./Tdot2svgStreams.js"
export { Tdot2svgStrings  } from "./Tdot2svgStrings.js"
export { Arr              } from "./Arr.js"
export { Tjira2dot        } from "./Tjira2dot.js"
export { KTS4HTML         } from "./KTS4HTML.js"
export { KTS4Browser        ,
       create_kts_console } from "./KTS4Browser.js"

console.log( "\x1b[30mkxfm/one loaded via index.js\x1b[0m" )
