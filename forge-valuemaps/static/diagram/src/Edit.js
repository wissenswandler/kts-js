import React from 'react';
import Form, { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Button, { ButtonGroup } from '@atlaskit/button';
import { view } from '@forge/bridge';

function Edit( {props} )
{
  const onSubmit = (formData) => view.submit(formData); // = @forge/bridge/view

  console.debug( "KTS config in Edit / props 01: " + JSON.stringify(props) );
  //console.debug( "KTS config in Edit / formProps " + formProps ); # simply referencing formProps here breaks the Component (no error, just no rendering)

  let current_query = props.query || "project != META order by updated desc";

  //
  // since I could not find a way to pass the props to the Form,
  // I am using the defaultValue attribute as a workaround
  //
  return (
    <Form onSubmit={onSubmit}>
      {
      ( { formProps, submitting } ) => 
      //console.debug( "KTS config in Edit / formProps " + JSON.stringify(formProps) )  // => {"ref":{"current":null}}  // ... and breaks the Component (no error, just no rendering)
      (
        <form {...formProps}>
          <Field name="query" label="Query" isRequired="true" defaultValue={current_query} >
            {  ({ fieldProps }) => <TextField {...fieldProps} />  }
          </Field>
          <br/>
          <ButtonGroup>
            <Button type="submit" isDisabled={submitting}>Save</Button>
            <Button appearance="subtle" onClick={view.close}>Cancel</Button>
          </ButtonGroup>
        </form>
      )
      }
    </Form>
  );
}

export default Edit;