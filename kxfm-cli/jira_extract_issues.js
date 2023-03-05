#!/usr/bin/env node

/*
 CLI to fetch from Jira Cloud REST API

 @param {String} jiraCloudInstance - Jira Cloud instance name
 @param {String} jqlText - JQL query text
 @returns {Array} - array of Jira issues with a limited set of fields
 
 results could be piped to jiraIssueArray2dotString.js in order to create a GraphViz DOT file
 */

import path from 'path';
import chalk from 'chalk';
import JiraExtract from './JiraExtract.js';
import JiraInterface from './JiraInterface.js';

// read Jira Cloud instance name from first command line argument, **/DIR, or use default
let jiraInstance = null;
if( process.argv[2] )
{
    jiraInstance = process.argv[2];
}
else
{
    // test whether current dir name contains dots (Copilot)
    jiraInstance = JiraExtract.find_instance_name();
    if( jiraInstance )
    {
        console.warn( chalk.grey( `assuming Jira instance name "${jiraInstance}" from DIR (supply instance name as 1. parameter if needed)` ) )
    }
    else
    {
        jiraInstance = "knowhere.atlassian.net";
        console.warn( chalk.yellowBright( `using hardcoded default "${jiraInstance}" as Jira instance FOR TEST PURPOSES (supply instance name as 1. parameter OR change to a dotted DIR)` ) )
    }    
}

// read user name and password from file ~/.jiracurl/user
// format: user:password
import fs from 'fs';
import os from 'node:os';
const userFile = path.join( os.homedir(), '.jiracurl', 'user' );
let atlassianUser = "";
let atlassianPassword = "";
try
{
    const userfile_content = fs.readFileSync( userFile ).toString();
    try
    {
        const user_and_pwd = userfile_content.split(':');
        atlassianUser = user_and_pwd[0].substring(3); // remove leading "-u " from file content
        // trim trailing newline from password
        atlassianPassword = user_and_pwd[1].substring(0, user_and_pwd[1].length - 1);
    }
    catch (error)
    {
        console.warn( chalk.grey(
        `No user/pwd found in ${userFile} - using anonymous access instead. Use "-u <user>:<password>" (same syntax as for cURL) in file ${userFile} to supply credentials IF you want to authenticate. See https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/`
        ));
    }
}
catch (error)
{
    console.warn( chalk.yellowBright(
    `No userfile found at ${userFile} - using anonymous access instead. NOTE: this will only work for public information. Create file ${userFile} IF you want to authenticate.`
    ));
}


// read jqlText from second command line argument OR from file OR construct from DIR name
const arg2 = process.argv[3];
let jqlText = arg2;
if( !jqlText )
{
    try
    {
        jqlText = fs.readFileSync( path.join( process.cwd(), 'jql.txt' ) ).toString();
        // trim trailing newline from jqlText
        jqlText = jqlText.substring(0, jqlText.length - 1);

        console.warn( chalk.green( `reading query text "${jqlText}" from file jql.txt` ) )
    }
    catch (error)
    {
        console.warn( chalk.yellowBright( error ) );
        let cwd = process.cwd().split( path.sep ).pop();
        jqlText = `project=${cwd} OR labels=view--${cwd}`;
        console.warn( chalk.grey( `assuming query text "${jqlText}" from DIR (supply "jql.txt" OR query as 2. parameter, if needed)` ) )
    }
}

let
jirainterface = new JiraInterface( jiraInstance, atlassianUser, atlassianPassword, '2' );
jirainterface.search (  jqlText, ['summary','description','issuetype','issuelinks','parent','status']  )
.then
(   searchResult =>
{
    console.log( JSON.stringify( searchResult.issues )  )
    console.warn( chalk.grey( `done extracting ${searchResult.issues.length} issues` ) )
}
)
.catch
(
    error => 
    {
        console.error(chalk.red(error));
        console.warn( chalk.yellowBright( "with jiraInstance ==>" + jiraInstance + "<== and jqlText ==>" + jqlText + "<==" ) );
    }   
);