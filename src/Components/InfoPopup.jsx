import React from 'react'

const InfoPopup = (show, onClose) => {
    console.log(onClose);
    return (
        <div style={{ display: show ? "block" : "none" }}>
            <p>This is an info popup.</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default InfoPopup