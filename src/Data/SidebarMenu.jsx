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
      title: 'overview',
      links: [
        {
          name: 'dashboard',
          icon: <SiActigraph/>,
        },
        {
          name: 'calendar',
          icon: <AiOutlineCalendar />,
        },
      ],
    },
  
    {
      title: 'DailyNote',
      links: [
        {
          name: 'list',
          icon: <AiOutlineRead/>,
        },
        {
          name: 'write',
          icon: <BsPencil/>,
        },
      ],
    },
  ];