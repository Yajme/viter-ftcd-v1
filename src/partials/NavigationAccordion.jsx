import React from "react";
import { FaChevronDown } from "react-icons/fa6";
import { Link } from "react-router-dom";
const NavigationAccordion = ({ subNavList = [], item }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full uppercase"
      >
        <div className="flex items-center gap-3 py-1 w-full">
          {item.icon} {item.label}
        </div>
        <FaChevronDown />
      </button>
      {isOpen && (
        <ul className="self-start w-full flex flex-col gap-1.5">
          {subNavList.map((_item, key) => {
            return (
              <li key={key} className="w-full">
                <Link
                  to={`${_item.path}`}
                  className="w-full hover:bg-gray-50/10 block pl-8"
                >
                  {_item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default NavigationAccordion;
