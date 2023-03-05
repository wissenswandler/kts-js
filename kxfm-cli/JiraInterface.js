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

    search( jqlText, fields )
    {
        return this.#jiraclient.searchJira
        (   jqlText, 
            {   maxResults: 1000,
                fields : fields
            }
        );
    }
}