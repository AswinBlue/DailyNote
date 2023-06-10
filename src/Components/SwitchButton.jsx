import React from 'react';

import { useStateContext } from '../Contexts/ContextProvider';

const SwitchButton = ({ icon, bgColor, color, bgHoverColor, size, text, borderRadius, width, onClick }) => {

  return (
    <button
      type="button"
      onClick={() => onClick()}
      style={{ backgroundColor: bgColor, color, borderRadius }}
      className={` text-${size} p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor}`}
    >
      {icon} {text}
    </button>
  );
};

export default SwitchButton;