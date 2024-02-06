import { ReactElement } from 'react';

import { AiFillCar, AiFillCalendar, AiFillPushpin } from 'react-icons/ai';
import { RiHistoryLine, RiTodoFill, RiDashboardFill, RiRoadMapLine } from 'react-icons/ri';
import {
  BsCardList,
  BsFillPersonLinesFill,
  BsFillTicketFill,
  BsJournals,
  BsSearch,
  BsTelephoneFill,
  BsTelephonePlusFill,
} from 'react-icons/bs';
import { IoMapSharp } from 'react-icons/io5';
import { GiPapers } from 'react-icons/gi';

// Define the type for each icon object
interface IconObject {
  name: string;
  icon: ReactElement;
}

const iconsNav: IconObject[] = [
  { name: 'AiFillCar', icon: <AiFillCar /> },
  { name: 'AiFillCalendar', icon: <AiFillCalendar /> },
  { name: 'AiFillPushpin', icon: <AiFillPushpin /> },
  { name: 'GiPapers', icon: <GiPapers /> },
  { name: 'RiTodoFill', icon: <RiTodoFill /> },
  { name: 'RiDashboardFill', icon: <RiDashboardFill /> },
  { name: 'RiRoadMapLine', icon: <RiRoadMapLine /> },
  { name: 'BsCardList', icon: <BsCardList /> },
  { name: 'BsFillPersonLinesFill', icon: <BsFillPersonLinesFill /> },
  { name: 'BsFillTicketFill', icon: <BsFillTicketFill /> },
  { name: 'BsJournals', icon: <BsJournals /> },
  { name: 'BsSearch', icon: <BsSearch /> },
  { name: 'BsTelephoneFill', icon: <BsTelephoneFill /> },
  { name: 'BsTelephonePlusFill', icon: <BsTelephonePlusFill /> },
  { name: 'IoMapSharp', icon: <IoMapSharp /> },
  { name: 'RiHistoryLine', icon: <RiHistoryLine /> },
];

// Exporting the array of icon components
export const icons = iconsNav.map(({ icon }) => icon);
