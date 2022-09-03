import React from 'react';
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock, AiOutlineRead } from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart, FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import { BsKanban, BsBarChart, BsBoxSeam, BsCurrencyDollar, BsShield, BsChatLeft, BsPencil } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';
import { RiStockLine } from 'react-icons/ri';
import { GiLouvrePyramid } from 'react-icons/gi';
import { SiActigraph } from 'react-icons/si';

export const sidebarMenu = [
    {
      title: 'Dashboard',
      links: [
        {
          name: 'records',
          icon: <SiActigraph/>,
        },
        {
          name: 'calendar',
          icon: <AiOutlineCalendar />,
        },
      ],
    },
  
    {
      title: 'Pages',
      links: [
        {
          name: 'read',
          icon: <AiOutlineRead/>,
        },
        {
          name: 'write',
          icon: <BsPencil/>,
        },        
        {
          name: 'kanban',
          icon: <BsKanban />,
        },
        {
          name: 'editor',
          icon: <FiEdit />,
        },
        {
          name: 'color-picker',
          icon: <BiColorFill />,
        },
      ],
    },
    {
      title: 'Charts',
      links: [
        {
          name: 'line',
          icon: <AiOutlineStock />,
        },
        {
          name: 'area',
          icon: <AiOutlineAreaChart />,
        },
  
        {
          name: 'bar',
          icon: <AiOutlineBarChart />,
        },
        {
          name: 'pie',
          icon: <FiPieChart />,
        },
        {
          name: 'pyramid',
          icon: <GiLouvrePyramid />,
        },
        {
          name: 'stacked',
          icon: <AiOutlineBarChart />,
        },
        {
          name: 'color-mapping',
          icon: <BsBarChart />,
        },
      ],
    },
  ];