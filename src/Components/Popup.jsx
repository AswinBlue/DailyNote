import React from 'react'

const Popup = ({children, visible}) => {
    return (
        visible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-3/5 h-4/5">
                {children}
            </div>
        </div>)
      );

    // const PopupHeader = () => {
    //     return (
    //         <div className="bg-blue-500">
    //             {/* button row */}
    //             <div className='flex justify-end'>
    //                 <button onClick={onButtonClick}>
    //                     {/* <MdOutlineCancel/> */}
    //                 </button>
    //                 <button onClick={onButtonClick}>
    //                     {/* <MdModeEditOutline/> */}
    //                 </button>
    //                 <button onClick={onButtonClick}>
    //                     {/* <MdDelete/> */}
    //                 </button>
    //             </div>
    //             {/* title line */}
    //             <div className='flex text-white font-bold'>

    //             </div>
    //         </div>
    //     );
    // }

    // const PopupBody = () => {
    //     return (
    //         <div>body</div>
    //     );
    // }

    // return (
    //     <div className='absolute '>
    //         <PopupHeader></PopupHeader>
    //         <PopupBody></PopupBody>
    //     </div>
    // );
}

export default Popup;

    // <MdOutlineTitle/>
    // const headerTemplate = (props) => {
    //     return (
    //       <div className="e-popup-header">
    //         <div class="e-header-icon-wrapper">
    //           <button class="e-edit e-control e-btn e-lib e-flat e-round e-small e-icon-btn" title="Edit" disabled="">
    //             <span class="e-btn-icon e-icons e-edit-icon"></span>
    //           </button>
    //           <button class="e-delete e-control e-btn e-lib e-flat e-round e-small e-icon-btn" title="Delete" disabled="">
    //             <span class="e-btn-icon e-icons e-delete-icon"></span>
    //           </button>
    //           <button class="e-close e-control e-btn e-lib e-flat e-round e-small e-icon-btn" title="Close">
    //             <span class="e-btn-icon e-icons e-close-icon"></span>
    //           </button>
    //         </div>
    //         <div class="e-subject-wrap">
    //           <div class="e-subject e-text-ellipsis" title="updates">{props.Subject}</div>
    //         </div>
    //       </div>
    //     );
    //   }
    
    //   const contentTemplate = (props) => {
    //     console.log(props.StartTime.toISOString().substring(0, 16));
    //     console.log(props.EndTime.toISOString().substring(0, 16));
    //     return (
    //       <div className="e-popup-content">
    //         {props.elementType === 'cell' ? (
    //           <div className="e-cell-content">
    //           </div>
    //         ) : (
    //           <div className="e-cell-content">
    //             <div className="e-date-time">
    //               <div className="e-date-time-icon e-icons"></div>
    //               <div className="e-description-details e-text-ellipsis">
    //                 <div className="e-date-time-details e-text-ellipsis">{props.StartTime.toISOString().substring(0, 16)} ~ {props.EndTime.toISOString().substring(0, 16)}</div>
    //               </div>
    //             </div>
    //             <div className="e-description">
    //               <div className="e-description-icon e-icons"></div>
    //               <div className="e-description-details e-text-ellipsis">{props.Description}</div>
    //             </div>
    
    //             {score_fields.forEach(element => {
    //               <div className="e-description">
    //                 <div className="e-chevron-down-fill-icon e-icons"></div>
    //                 <div className="e-description-details e-text-ellipsis">{element} : {props[element]}</div>
    //               </div>
    //             })}
    //           </div>
    //         )}
    //       </div>
    //     );
    //   }