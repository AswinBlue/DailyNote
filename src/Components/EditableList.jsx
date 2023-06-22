import React, { useEffect, useRef, useState } from 'react'
import { ListViewComponent } from '@syncfusion/ej2-react-lists';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

const EditableList = ({ listData, rowComponent }) => {
    let listviewInstance = null; // TODO: change into useState if need
    let fields = { text: "text", iconCss: "icon" }; // TODO: chack https://ej2.syncfusion.com/react/documentation/listview/data-binding
    let addTitle = '';

    const listTemplate = (itemTemplate) => {
        return (
        <div className="text-content">
            {itemTemplate}
            <span className="delete-icon" onClick={deleteItem}/>
        </div>
      );
    }
    const addItem = () => {
        let data = {
            text: addTitle,
            icon: "delete-icon"
        };
        listviewInstance.addItem([data]);
        addTitle = '';
    }
    const deleteItem = (args) => {
        args.stopPropagation();
        let liItem = args.target.closest('li');
        listviewInstance.removeItem(liItem);
    }
    const onAddTitleChange = (event) => {
        addTitle = event.value;
    }
    return (
        <div>
            <ListViewComponent id="sample-list"
                dataSource={listData}
                fields={fields}
                template={listTemplate}
                ref={(listview) => {
                    listviewInstance = listview;
                }}
            />
            <input onChange={onAddTitleChange}
                value={addTitle?addTitle:''} 
                onBlur={onAddTitleChange} 
                className='w-full border-solid border-b-2 border-b-gray-500 tracking-normal text-slate-900'
            />
            <ButtonComponent id="btn" onClick={addItem}>
                Add Item
            </ButtonComponent>
        </div>
    );
};

export default EditableList;