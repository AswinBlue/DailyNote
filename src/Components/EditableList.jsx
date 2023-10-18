import React, { useEffect } from 'react'
import { ListViewComponent } from '@syncfusion/ej2-react-lists';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

const EditableList = ({ listData, rowComponent }) => {
    let listviewInstance = null; // TODO: change into useState if need
    let fields = { text: "name", iconCss: "icon" }; // TODO: chack https://ej2.syncfusion.com/react/documentation/listview/data-binding
    let addTitle = '';
    var formattedData = null;

    // reconstruct data format
    useEffect(() => {
        formattedData = [];
        Object.entries(listData).forEach(([key, value]) => {
            var newObject = {
                name: key,
                id: key,
                value: value,
                icon: "delete-icon"
            };
            formattedData.push(newObject);
        });
        console.log('EditableList:' + formattedData);
    }, []);

    const listTemplate = (itemTemplate) => {
        return (
        <div className="text-content">
            {itemTemplate}
            <span className="delete-icon" onClick={deleteItem}/>
        </div>
      );
    }
    const addItem = () => {
        var newObject = {
            name: addTitle,
            id: addTitle,
            value: 50, // TODO: value from radio button
            icon: "delete-icon"
        };
        listviewInstance.addItem([newObject]);
        console.log('addTitle:', addTitle);
    }
    const deleteItem = (args) => {
        args.stopPropagation();
        let liItem = args.target.closest('li');
        listviewInstance.removeItem(liItem);
    }
    const onAddTitleChange = (event) => {
        addTitle = event.target.value;
    }
    return (
        <div>
            <ListViewComponent id="list"
                dataSource={formattedData}
                fields={fields}
                template={listTemplate}
                ref={(listview) => {
                    listviewInstance = listview;
                }}
            ></ListViewComponent>
            <div className='flex m-1 gap-5'>
                <input onChange={onAddTitleChange}
                    onBlur={onAddTitleChange} 
                    className='w-full border-solid border-b-2 border-b-gray-500 tracking-normal text-slate-900'
                    />
                <ButtonComponent id="btn" onClick={addItem}>
                    Add Item
                </ButtonComponent>
            </div>
        </div>
    );
};

export default EditableList;