import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { Tjira2dot }  from '@kxfm/jira2dot';
import {KTS4Dot}      from '@kxfm/dot';

/*
 * NOTE: package 'chalk' is not compatible with Forge,
 * will result in error: 
 * 
=== Snapshotting functions...

Error: Error thrown in the snapshot context.
App code snapshot error: navigator is not defined
 *
 * ... and FaaS will not execute!
 */

const resolver = new Resolver();

/*
 * log to console only in development environment,
 * to avoid cluttering the log in production
 * 
 * these logs are typically used while developing using forge tunnel
 * 
 * wrapping the message in an array prevents simpler toString() in favour of JSON.stringify() (?)
 */
function devdebugInContext( context, message_object )
{
    if
    (
      context.environmentType === 'DEVELOPMENT'
    )
    {
        console.debug( ["(devdebug) " , message_object] );
    }
}

resolver.define
(
  'getDotFromIssueQuery',
  async ( req ) =>
  {
    function devdebug( string ) { devdebugInContext( req.payload.clientContext, string ) };
    devdebug( req );
    devdebug( req.context.extension );
    devdebug( req.payload.clientContext );
    
    try
    {
      let jqlQueryText = req.payload.jql;

      switch ( req.context.extension.type )
      {
        case 'jira:dashboardGadget':
          jqlQueryText = req.context.extension.gadgetConfiguration.query;
          break;
        case 'jira:projectPage':
          const projectKey = req.context.extension.project.key;
          jqlQueryText = `project=${ projectKey } OR labels=view--${ projectKey } order by updated desc`;
          break;
        case 'jira:globalPage':
          jqlQueryText = `project != META order by updated desc`;
          break;
        case 'jira:issueActivity':
        case 'jira:issueGlance':
        case 'jira:issuePanel':
          jqlQueryText = `issue=${ req.context.extension.issue.key }`;
          break;
      }

      const issues = await fetchIssues( jqlQueryText );
      devdebug(`found ${ issues.length } Jira-issues`);

      let siteUrl = req.payload.clientContext.siteUrl;
      let siteUrlWithoutProtocol = siteUrl ? siteUrl.substring(8) : 'localhost';

      return Tjira2dot.jiraIssueArray2dotString( issues, siteUrlWithoutProtocol );
    }
    catch (error)
    {
      console.error( JSON.stringify(error) );
      return `graph {     error [    shape=none style=filled fillcolor=lightpink label="${   KTS4Dot.safeAttribute(  JSON.stringify( error )  )   }"    ]     }`
    }
  }
);

function debugResponse(response)
{
  console.debug( `returning response of type: ${typeof response} and length: ${response.length} ` );
  return response;
}

/*
 * fetch the first maxResults issues from Jira
 * TODO: handle pagination
 * TODO: upgrade to API version 3 and handle ADO text fields
 */
async function fetchIssues( jqlQueryText = "project=XXX", fields = 'summary,description,issuetype,status,issuelinks,parent' )
{
  const jiraResult = 
  await api
    .asUser()
    .requestJira( route`/rest/api/2/search?jql=${jqlQueryText}&fields=${fields}&maxResults=1000` )

  const data = await jiraResult.json();

  if( data.warningMessages?.[0]  ) console.warn ( data.warningMessages );
  if( data.errorMessages?.[0]    ) console.error( data.errorMessages   );

  if( data.total > data.maxResults ) console.warn( `WARNING: only ${data.maxResults} of ${data.total} issues returned from query ${jqlQueryText}` );

  if( data.issues ) return data.issues;
  else throw new Error( data.errorMessages );
}

export const handler = resolver.getDefinitions();