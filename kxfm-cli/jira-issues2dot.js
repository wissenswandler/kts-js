#!/usr/bin/env node

/*
 * CLI entry into lightweight KTS lib
 */

import { Tjira2dot } from '@kxfm/jira2dot';

let input = "";
process.stdin.on
(   "data",
    (chunk) =>
    {
        input += chunk;
    }
);
process.stdin.on
(   "end",
    () =>
    {
        const issueArray = JSON.parse(input);
        console.log( Tjira2dot.jiraIssueArray2dotString( issueArray , process.argv[2] )  );
    }
);