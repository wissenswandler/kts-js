import jiraAPI from 'jira-client'

export default class JiraInterface
{
    #jiraclient = null;

    /*
     * should work with Jira Cloud and Jira Server
     */
    constructor( jiraInstance, atlassianUser, atlassianPassword, apiVersion = 'latest' )
    {
        /*
        * NOTE: apiVersion 'latest' seems to be interpreted as '2', at least in case of /search operation!
        * 2/search returns multi-line text fields (such as description) of type String, whereas
        * 3/search and latest/search return multi-line text fields of ADO type JSON object (see comment below)
        */
        this.#jiraclient = new jiraAPI({
            protocol    : 'https',
            host        : jiraInstance,
            username    : atlassianUser,
            password    : atlassianPassword,
            apiVersion  : "" + apiVersion, // see NOTE above
            strictSSL   : true
        });
    }

    async search( jqlText, fields )
    {
        let startAt = 0;
        let total = 1;  // this is a guess to start the loop

        let result = [];

        while( result.length < total )
        {
            const response = await this.#jiraclient.searchJira
            (   
                jqlText, 
                {
                    fields,
                    startAt,
                    maxResults: 100,
                }
            );
            total   = response.total; // updating total to the correct value
            result  = result.concat( response.issues );
            startAt = result.length;

	    // colorize following output in yellow without external packages (e.g. chalk)
	    process.stderr.write( `\x1b[33mextracted ${result.length} out of total ${total} issues\r\x1b[0m` );

        }
        process.stderr.write( `\n` );

        return result
    }
}
