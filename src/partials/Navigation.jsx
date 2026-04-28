import React from "react";
import { StoreContext } from "../store/StoreContext.jsx";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa6";
import NavigationAccordion from "./NavigationAccordion.jsx";
// import { devNavUrl } from "../functions/functions-general.tsx";

const Navigation = ({ navigationList = [], menu, submenu }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const isMobileOrTablet = window.matchMedia("(max-width:1027px)").matches;
  const scrollRef = React.useRef(null);

  const link = "/developer";
  const handleShowNavigation = () => {};
  const handleScroll = (e) => {};
  return (
    <>
      {" "}
      <div className="print:hidden">
        <nav
          className={`${
            store.isShow ? "translate-x-0" : ""
          } h-dvh  duration-200 ease-in fixed z-40 overflow-y-auto w-[14rem] print:hidden py-3 uppercase pt-[76px]`}
          ref={scrollRef}
          onScroll={(e) => handleScroll(e)}
        >
          <div className="text-sm text-white flex flex-col justify-between h-full">
            <ul>
              {navigationList.map((item, key) => {
                return (
                  <li
                    key={key}
                    className={`flex items-center gap-3 hover:bg-gray-50/10 px-4 ${item.subNavList && "flex-col gap-0.5!"}`}
                  >
                    {item.subNavList ? (
                      <NavigationAccordion
                        subNavList={item.subNavList}
                        item={item}
                      />
                    ) : (
                      <Link to={item.path} className="py-1 w-full  ">
                        <div className="flex items-center gap-3">
                          {item.icon} {item.label}
                        </div>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
        <span
          className={`${
            store.isShow ? "" : "-translate-x-full"
          } fixed z-30 w-screen h-screen bg-dark/50 ${
            isMobileOrTablet ? "" : "lg:hidden"
          }`}
          onClick={handleShowNavigation}
          onTouchMove={handleShowNavigation}
        ></span>
      </div>
    </>
  );
};

export default Navigation;
