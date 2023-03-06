export * from './Tdot2svgStrings.js';
export * from './Tdot2svgStreams.js';
export * from './Tdot2svgFiles.js';

console.log( "This module does not perform any action in the CLI. Instead, you can use the transformer APIs:" );
console.log( " Tdot2svgFiles"   );
console.log( " Tdot2svgStreams" );
console.log( " Tdot2svgStrings" );
console.log( "NOTE: it is better to import above classes directly from their implementing js files," );
console.log( "instead through this combined index.js, to avoid unnecessary importing e.g. of 'fs' module!" );