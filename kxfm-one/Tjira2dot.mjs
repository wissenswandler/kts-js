/*
 * lightweight KTS micro library (no external dependencies)
 */

import {KTS4Dot} from './KTS4Dot.js';
import {KTS4SVG} from './KTS4SVG.js';

const ARROW_UP = '▲';
const ARROW_DN = '▼';

const cloudInstanceMatcheR = /https:\/\/[a-zA-Z-]+\.atlassian\.net\//g;

/*
 * a Set of unqiue objects
 * where identity is defined by the unique_by property
 */
class UniqueSet extends Map
{
    
  static get unqiue_by() { return "id"; }

  add (o) 
  {
    let currentItem = this.get( o[ UniqueSet.unqiue_by ] );

    if (currentItem)
    {
        if (this.deepCompare(o, currentItem))
            throw( "refusing: " + o[ UniqueSet.unqiue_by ] );
    }

    // log the length of the o.fields object [Copilot]
    //console.warn( "adding: " + o.key + " with " + Object.keys(o.fields).length + " fields" );
    //console.warn( "adding: " + o.id );

    this.set( o[ UniqueSet.unqiue_by ], o );

    return this;
  };

  deepCompare(o, i)
  {
    // TODO: theoretically handle the case of replacing an issue with less details with one with more details;
    // However, as long as 'issues' are harvested first, then linked issues, we always receive the more detailed issue first
    // so, practically we will never have to deal with such replacement
    //return o.key == i.key && Object.keys(o.fields).length <= Object.keys(i.fields).length;

    return o[ UniqueSet.unqiue_by ] == i[ UniqueSet.unqiue_by ]
  }

  set( k, v)
  {
    this.decorate( v );
    super.set( k, v );
  }
  
  /*
   * optionally modify o
   * after it has been accepted,
   * but before it is added to the set
   */
  decorate( o )
  {
    // not implemented in base class
  }
}
/*
 * a Set of unqiue, detailed Jira issues
 * where an issue with more details (fields) is preferred over a less detailed one
 */
class JiraIssueSet extends UniqueSet
{
  /*
   * decoreate the issue with a style
   */
  decorate( o )
  {
    // test whether o.key contains the text "META" [Copilot]
    let meta = o.key.includes("META");
    o.isMeta = meta;

    let base_dot_style = (meta ? "filled" : "filled,rounded");
    switch( o.fields.status.statusCategory.id )
    {
        case 3:
            o.dot_style = base_dot_style + ",dashed";
            break;
        case 2:
            o.dot_style = base_dot_style + ",dotted";
            break;
        case 1: // never seen in the wild, so mark it bold to stand out visually
            o.dot_style = base_dot_style + ",bold";
            break;
        default: // in particular == 4
            o.dot_style = base_dot_style;
    }
  }
}

class JiraIssueLinkSet extends UniqueSet
{
}

const PARENT_PSEUDO_LINKTYPE =
{
    id      : "jira__field__parent"
    ,
    name    : "parent -- style: arrowhead=diamond"
    ,
    inward  : "has parent(field)"
    ,
    outward : "has child (= inverse of 'parent')"
}

export class Tjira2dot
{

static safeAdd( set, o )
{
    try
    {
        set.add( o );
    }
    catch( e )
    {
        //console.warn( e );
    }
}


/*
* convert Jira issue array to DOT string
* @param {Array} issueArray - array of Jira issues
* @returns {String} - DOT string
*/
static jiraIssueArray2dotString( issueArray, jiraInstance )
{

    const issueSet = new JiraIssueSet(   issueArray.map(  i  => { i.querydistance_0=true; return [ i.id, i ] }  )   );
    const linkSet  = new JiraIssueLinkSet();   

    // add all issues from issuelinks to the set [mostly Copilot]
    // and add all links to the link set
    issueArray.forEach
    (   issue =>
        {
            if( issue.fields.parent )
                this.safeAdd( issueSet, issue.fields.parent );

            if( issue.fields.issuelinks )
            {
                issue.fields.issuelinks.forEach
                (   link =>
                    // note that traditional Jira semantics are in "dependency" direction,
                    // which is the opposite of "value" direction,
                    // so it appears that we reverse the direction of the edge by drawing it from the outwardIssue to the inwardIssue
                    // however this is the intended semantics of KTS
                    {
                        if( link.outwardIssue )
                        {
                            link.outwardIssue.querydistance_1 = true;
                            this.safeAdd( issueSet, link.outwardIssue );

                            link.o_id = issue.id;
                            link.s_id = link.outwardIssue.id;
                            delete link.outwardIssue;
                            this.safeAdd( linkSet, link );
                        }
                        if( link.inwardIssue )
                        {
                            link.inwardIssue.querydistance_1 = true;
                            this.safeAdd( issueSet, link.inwardIssue );

                            link.s_id = issue.id;
                            link.o_id = link.inwardIssue.id;
                            delete link.inwardIssue;
                            this.safeAdd( linkSet, link );
                        }
                    }
                );
            }
            if( issue.fields.parent )
            {
                this.safeAdd( linkSet, { id : issue.id + "_parent" , s_id: issue.id, o_id: issue.fields.parent.id, type: PARENT_PSEUDO_LINKTYPE } );
            }
        }
    );

    return this.jiraGraph2dotString( { nodes: issueSet, edges: linkSet }, jiraInstance );
}

/*
 * a Jira Graph is a set of Nodes and a set of Edges, both in Jira API shape
 */
static jiraGraph2dotString( jiraGraph, jiraInstance )
{
    let dotString = `digraph Map {
graph [
    class="dot_by_kts"
]
node [
   margin=0.1
]`;

/*
 * TODO: consider these values for tighter layout IF graph grows too large
 *
graph [
   nodesep=0.2
   ranksep=0.2
]
node [
   margin=0.1
]`
 *
 */

    /*
     * render nodes first (otherwise references to nodes that are not yet defined will result in naked nodes)
     */
    jiraGraph.nodes.forEach
    (   issue =>
        {
            //let issue = key_value_pair[1];

            //
            // node definition
            //
            dotString += "\n\n" 
                + "# self: " + issue.self + "\n"
                + "<" + issue.key + ">"
                + " [ "
                + this.renderLabel( issue, jiraInstance )
                + KTS4Dot.renderAttributeIfExists( "tooltip" , issue.fields.description )
                + this.renderURL( issue, jiraInstance )
                + KTS4Dot.renderAttributeIfExists( "style" , issue.dot_style ) // [Copilot !!]
                + ' class="type_' + issue.fields.issuetype.id
                + (issue.querydistance_0 ? " querydistance_0" : "" )
                + (issue.querydistance_1 ? " querydistance_1" : "" )
                + '"'
                + " ]";
        }
    );

    dotString += "\n";

    // create array from edges map
    let edges = Array.from( jiraGraph.edges.values() )

    // sort edges by link type
    .sort( (a,b) => (a.type.id < b.type.id) ? -1 : (a.type.id > b.type.id) ? 1 : 0  );

    let groupedEdges = edges.reduce // group edges by type
    (   (acc, link) =>
        {
            let key = link.type.id;
            if( !acc[key] )
                acc[key] = [];
            acc[key].push( link );
            return acc;
        }
    ,   {}
    );

    // ieteate over grouped edges
    Object.keys( groupedEdges ).forEach
    (   linkTypeId =>
        {
            let group = groupedEdges[ linkTypeId ];

            let p = group[0].type;

            let impact_neutral  = p.name.startsWith(  '0' );

            let impact_negative = p.name.startsWith( '-'  )
                                  ||
                                  ["10000", "10006"].includes( p.id )   // built-in "Blocks" and "Problem/Incident" link types
            let reverse_impact  = ["10000", "10006"].includes( p.id )   // built-in "Blocks" and "Problem/Incident" link types
                                  ||
                                  p.name.startsWith(  '2' )
                                  ||
                                  p.name.startsWith( '-2' )
                                  ||
                                   p.inward.endsWith( ARROW_DN )
                                  ||
                                  p.outward.endsWith( ARROW_UP )
                                  
            let impact_inverter = reverse_impact ? 1 : 0;   // TODO: move link direction inversion up to the abstract graph level, so that other renderers can use it too
            
            let  inwardLabel =  p.inward.replace( ARROW_UP , '' ).trim();
            let outwardLabel = p.outward.replace( ARROW_DN , '' ).trim();

            let predicateNameParts = p.name.split( " -- style: " );
            let predicateName = predicateNameParts[0];
            let style = predicateNameParts[1];

            /*
             * render link type definition
             */
            let styleOrLabel = style ? style : KTS4Dot.renderAttributeIfExists( "label" , reverse_impact ? outwardLabel : inwardLabel ) ;
            let hasLabel = styleOrLabel.indexOf( "label=" ) >= 0;
            dotString += '\n{'
            + ' edge ['
            + styleOrLabel
            + ']'
            + ' # link type: "' + predicateName + '"'

            /*
            * render edges
            */
            group.forEach
            (   link =>
                {
                    let s = jiraGraph.nodes.get( link.s_id );
                    let o = jiraGraph.nodes.get( link.o_id );

                    let tooltip = `${s.fields.summary} –${inwardLabel}→ ${o.fields.summary} –${outwardLabel}→ ${s.fields.summary}` ;

                    let nodes = [ s, o ];

                    dotString += `\n<${nodes[0+impact_inverter].key}> -> <${nodes[1-impact_inverter].key}>`
                    + "["
                    + ( hasLabel ? 'labeltooltip="' + KTS4Dot.safeAttribute( tooltip ) + '"' : '' )
                    +                  ' tooltip="' + KTS4Dot.safeAttribute( tooltip ) + '"'
                    + ' class="type_' + p.id
                    + ( impact_negative ? " impact_negative" : "" )
                    + ( impact_neutral  ? " impact_neutral"  : "" )
                    + ( (s.querydistance_1 || o.querydistance_1) ? " querydistance_1" : " querydistance_0" )
                    + '"'
                    + "]";
                }
            );

            /*
             * end of link type definition
             */
            dotString += "\n}";
        }
    );

    return dotString + "\n}";
}

static renderLabel( issue, jiraInstance )
{
    if( issue.fields.summary.length === 1  &&  issue.fields.issuetype.name.toLowerCase().startsWith("op") )
    {
        return `shape=circle label="${KTS4Dot.safeAttribute( issue.fields.summary )}"`;
    }

    let typeSearchAttribute = "";
    if( issue.isMeta )
    {
        const typeSearchUrl = "https://" + this.jiraInstanceFromIssueOrParameter(issue,jiraInstance) + "/issues/?jql=type=" + issue.fields.issuetype.id + "+ORDER+BY+summary";
        typeSearchAttribute = ` HREF="${typeSearchUrl}"`;
    }

/*
 * NOTE: keeping the IMG tag in one line with TD tag is important, otherwise the IMG tag will be ignored!!
 * see https://github.com/hpcc-systems/hpcc-js-wasm/issues/145
 */
    return `label=
<<TABLE BORDER="0" CELLSPACING="0"> <TR>
  <TD CELLPADDING="0"${typeSearchAttribute}><IMG SRC="${issue.fields.issuetype.iconUrl}" /></TD>
  <TD COLSPAN='3'>${KTS4SVG.escapeHtml( issue.fields.summary )}</TD>
 </TR> <TR>
  <TD${typeSearchAttribute} COLSPAN="2" SIDES="LBR" ALIGN="LEFT"><FONT POINT-SIZE='8'>${KTS4SVG.escapeHtml(issue.fields.issuetype.name)}</FONT></TD>
  <TD><FONT POINT-SIZE='8'>${KTS4SVG.escapeHtml(issue.fields.status.name)}</FONT></TD>
  <TD ALIGN='RIGHT'><FONT POINT-SIZE='8'>${issue.key}</FONT></TD>
</TR> </TABLE>>`;   // tag <I> in <FONT> causes the italic line to be v-aligned slightly higher than the non-italic line; this is not even fixed by a VALIGN="BOTTOM", so I remove the <I>
}

static jiraInstanceFromIssueOrParameter( issue, jiraInstance )
{
    return this.jiraInstanceFromIssue( issue ) || jiraInstance;
}
static jiraInstanceFromIssue( issue )
{
    const cloudInstanceMatcheS = [ ...issue.self.matchAll( cloudInstanceMatcheR ) ];

    if( cloudInstanceMatcheS && cloudInstanceMatcheS[0] )
    {
        return cloudInstanceMatcheS[0][1];
    }
    else
        return null;
}

static renderURL( issue, jiraInstance )
{
    let browsePath;

    const cloudInstanceMatcheS = [ ...issue.self.matchAll( cloudInstanceMatcheR ) ];

    if( cloudInstanceMatcheS && cloudInstanceMatcheS[0] )
    {
        browsePath = cloudInstanceMatcheS[0][0] + "browse";
    }
    else
    {
        if( !jiraInstance )
        {  
            jiraInstance = "knowhere.atlassian.net";
            console.warn( "could not extract instance name from issue.self: " + issue.self );
            console.warn( "and no instance name supplied via parameter" );
            console.warn( "using default instance name FOR TESTING PURPOSES: " + jiraInstance );
        }
        browsePath = "https://" + jiraInstance + "/browse"
	/*
	 * issue records which are retrieved on Forge server contain self value like following pattern:
	 * https://api.atlassian.com/ex/jira/03f3ce7b-7d4b-4363-9370-9e6917312a51/rest/api/2/issue/10597
	 */
        // console.warn( "could not extract cloud instance from issue.self: " + issue.self );
        // console.warn( "using supplied browsePath: " + browsePath);
    }

	return " URL=\"" + browsePath + "/" + issue.key + "\""
}

} // end of class Tjira2dot
