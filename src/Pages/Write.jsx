import React from 'react'
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import { Header, LineEditor, AreaEditor, SimpleButton } from '../Components'
import { login, addEvent } from '../API/GAPI';

const Write = () => {
  const summary = ''
  const description = ''
  const onChange = (event) => {
    const {target: {name, value}} = event
    // console.log(name, value)

    if (name==="Summary") {
      summary = value
    } else if (name === "Description") {
      description = value
    }
  }

  const onClick = () => {
    login();
    addEvent(summary=summary, description=description);
  }

  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category="Diary" title="Write"/>
      <LineEditor title='Summary' onChange={onChange}/>
      <AreaEditor title='Description' onChange={onChange}/>
      <SimpleButton onClick={onClick} color='white' bgColor='blue' text='Submit' borderRadius='10px' size='md'/>
    </div>
  )
}

export default Write