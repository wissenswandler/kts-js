/*
 * lightweight KTS micro library (no dependencies)
 */

export class KTS4Dot
{
/*
 * add some required and some recommended attributes to the DOT string
 *
 * also scan for image urls and return them in an array
 */
static preprocess(dot_string)
{
    return dot_string.replace
    (
        /(graph.*\{)/
        ,
        `$1
graph [
 color=whitesmoke       # KTS style
 fontname=Helvetica     # KTS style
 labelloc=b
 rankdir=BT             # KTS style
 remincross=true
 splines=true
 style="filled,rounded" # KTS style
 tooltip=" "  # prevent DOT default of graph's name/label
]
node [ id="\\N"
 fillcolor=white # opaque nodes on top of colored clusters in background
 fontname=Helvetica     # KTS style - node's fillcolor is not inherited
 height=0
 shape=box              # KTS style
 style="filled,rounded" # KTS style
 width=0
 tooltip=" "  # prevent DOT defaults of edge's label (might be a table)
]
edge [ id="\\T___\\H"   # KTS contract for graph traversal
 arrowtail=none # prevent DOT default of a tail that looks like an arrowhead, in case of dir=both
 color=forestgreen
 dir=both               # convenience for defining arrow tails (attribute not needed there)
 # font family may by a serif one by default (better visual contrast between node and edge labels)
 fontsize=10            # KTS style
 penwidth=2             # green lines are easier to see when drawn thicker
]
`	);
};

/*
 * return an attribute name/value IF value ist not empty,
 * otherwise return an empty string
 */
static renderAttributeIfExists( name, value )
{
    const  safeValue = KTS4Dot.safeAttribute( value );
    return safeValue == "" ? "" : ` ${name}=\"${safeValue}\"`   // mind the leading space to separate attributes in DOT string
}

/*
 * return a string that is safe to use as a DOT language attribute
 * by replacing double quotes with escaped double quotes
 * @param {String} text - text to be used as a label (NOTE it could also be an ADO)
 * @returns {String} - safe text to be used as a label which is delimited by double quotes(!)
 */
static safeAttribute( value )
{
    if( value == null )
    {
        //console.warn( "found a NULL text (which is OK)" );
        return "";
    } 
    if( typeof value === "object" )
    {
        /* this could be an Atlassian Document Object (ADO) e.g. like that:
        const ado =
        {
            "version":1,
            "type":"doc",
            "content":
            [
                {
                    "type":"paragraph",
                    "content":
                    [
                        {
                            "type":"text",
                            "text":"Typ-1 Hypervisor (native / bare metal)"
                        }
                    ]
                }
            ]
        };
        */
        console.warn( "found a text OBJECT (that is not null) and don't know how to handle that, returning empty string: " + JSON.stringify( value ) );
        return "";
    }
    if( ! typeof value.replace === "function" )
    {
        console.warn( "found a text that is not a function and don't know how to handle that, returning empty string: " + JSON.stringify( value ) );
        return "";
    }
    try
    {
        return value.replace( /"/g, "\\\"" )
    }
    catch( error )
    {
    	console.error( error );
	    console.warn( "typeof text: " + typeof value );
    	return "";
    }
}

} // end of class KTS4Dot
