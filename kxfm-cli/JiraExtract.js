import path from 'path';

export default class JiraExtract
{
    static find_instance_name()
    {
        return this.find_instance_name_in_array( process.cwd().split( path.sep ) );
    }

   /*
    * recursively search for first (parent) dir name containing a dot, starting at the current workding dir,
    */
    static find_instance_name_in_array( dir_parts_array )
    {
        const dir_name = dir_parts_array[dir_parts_array.length - 1];
        if (dir_name.includes('.'))
        {
            return dir_name;
        }
        else if (dir_parts_array.length === 1)
        {
            return null;
        }
        else
        {
            return this.find_instance_name_in_array(dir_parts_array.slice(0, dir_parts_array.length - 1));
        }
    }
}
