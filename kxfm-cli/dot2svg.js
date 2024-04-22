#!/usr/bin/env node

/*
 * CLI entry to transform either piped input or file to SVG
 *
 * this depends on filesystem, streams and graphviz renderer implementation, 
 * so it is rather heavyweight and cannot be used in some environments (Forge FaaS, Browser...)
 *
 * also the graphviz renderer is constructed here
 */

import { exit } from 'process';
import fs from 'fs'
import chalk from 'chalk'	
import {Tdot2svgStreams}	from '@kxfm/one'
import {Tdot2svgFiles}		from './Tdot2svgFiles.js'

import { Graphviz } from "@hpcc-js/wasm/graphviz";
const graphviz = await Graphviz.load();

let dotsource_filename;
let svgproduct_filename;

let force_build = false;
if( process.argv.includes( "-f" ) )
{
	force_build = true;
	// remove "-f" from process.argv
	process.argv.splice( process.argv.indexOf( "-f" ), 1 );
}
let watch = false;
if( process.argv.includes( "-w" ) )
{
	watch = true;
	// remove "-w" from process.argv
	process.argv.splice( process.argv.indexOf( "-w" ), 1 );
}

// test whether file ../lib/graph.js exists
let libPath = "../lib";
const testLib = libPath + "/graph.js";
try
{
	fs.accessSync( testLib );
	console.warn( chalk.green( `using local library ${testLib} (+ .css)` ) );
}
catch (err)
{
	libPath = "https://cdn.jsdelivr.net/npm/@kxfm/visco@latest";
	console.warn( chalk.yellowBright( `library ${testLib} does not exist. Using default ${libPath}` ) );
}


/*
 * set dotsource_filename from command line argument or use default "graph.dot"
 */
function set_dotsource_filename ()
{
	if (process.argv.length > 2)
	{
		dotsource_filename = process.argv[2]
	}
	else
	{
		dotsource_filename = "graph.dot";
		console.warn( chalk.grey( `assuming DOT input from ${dotsource_filename} (supply filename as 1. parameter if needed)` ) )
	}
}

function set_svgproduct_filename ()
{
	if (process.argv.length > 3)
	{
		svgproduct_filename = process.argv[3]
	}
	else
	{
		// default svproduct_filename shall be the same as dotsource_filename but with .svg extension
		svgproduct_filename = dotsource_filename.replace( /\.dot$/, ".svg" );
		console.warn( chalk.grey( `assuming SVG output  to ${svgproduct_filename} (supply filename as 2. parameter if needed)` ) )
	}
}

if( ! Boolean( process.stdin.isTTY ) && process.argv.length === 2 )
// (apparently) piped input AND no command line argument
{
	if( process.argv.length > 2 )
	{
		console.warn( chalk.yellowBright ( `ignoring command line argument "${process.argv[2]}" because we are piped to.` ) )
	}
	console.warn(chalk.green("reading DOT source from stdin. Type CTRL-D to signal end of your input..."));
	Tdot2svgStreams.build_diagram_from_stdin( libPath, graphviz );
}
else
{
// no piped input OR command line argument

if( ! Boolean( process.stdin.isTTY ) && process.argv.length > 2 )
// piped input AND command line argument => over defined !!
{
	console.warn( chalk.yellowBright ( `ignoring piped input in favour of command-line parameter "${process.argv[2]}"` ) )
}
// no piped input AND no command line argument

set_dotsource_filename();

// build diagram only if source file is newer than product file	
fs.stat( dotsource_filename, (err, source_stats) => 
{
	if (err)
	{		
		console.error( chalk.red ( `no file with name "${dotsource_filename}" => aborting` ) )
		exit( 404 );
	}
	else
	set_svgproduct_filename();
	fs.stat( svgproduct_filename, (err, product_stats) =>
	{
		if (err)
		{
	 		log_and_build_diagram_from_file( `initial build of missing "${svgproduct_filename}" from "${dotsource_filename}"`, dotsource_filename, svgproduct_filename, graphviz, libPath )
			if( watch )	watch_sourcefile_to_build_productfile( dotsource_filename, svgproduct_filename, libPath );
		}
		else
		if (source_stats.mtime > product_stats.mtime)
		{
	 		log_and_build_diagram_from_file( `update build from input "${dotsource_filename}" (which is newer than "${svgproduct_filename}")`, dotsource_filename, svgproduct_filename, graphviz, libPath  )
			if( watch )	watch_sourcefile_to_build_productfile( dotsource_filename, svgproduct_filename, libPath );
		}
		else
		// both source and product exist and product is up to date
		if( force_build )
		{
	 		log_and_build_diagram_from_file( `forcing (new) build from input "${dotsource_filename}" (which is older than "${svgproduct_filename}")`, dotsource_filename, svgproduct_filename, graphviz, libPath )
			if( watch )	watch_sourcefile_to_build_productfile( dotsource_filename, svgproduct_filename, libPath );
		}
		else
		{
			console.warn( chalk.grey( `no need to build "${svgproduct_filename}" now but let's watch for changes in "${dotsource_filename}" and build then (force build with parameter "-f")` ) )
			watch_sourcefile_to_build_productfile( dotsource_filename, svgproduct_filename, libPath );
		}
	})
})
}

function watch_sourcefile_to_build_productfile( dotsource_filename, svgproduct_filename, libPath )
{
	console.warn( chalk.grey( `watching ${dotsource_filename} for changes...` ) )
	fs.watchFile
	(	dotsource_filename,
		() =>
		{
			log_and_build_diagram_from_file(`\n${dotsource_filename} was touched,`, dotsource_filename, svgproduct_filename, graphviz, libPath);
		}
	)
}


function log_and_build_diagram_from_file( log_comment, dotsource_filename, svgproduct_filename, graphviz, libPath )
{
	console.warn(  chalk.grey( log_comment )  );
	Tdot2svgFiles.build_diagram_from_file( dotsource_filename, svgproduct_filename, graphviz, libPath )
}
