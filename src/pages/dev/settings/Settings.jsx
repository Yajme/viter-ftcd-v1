// import React from 'react';
import Layout from "#pages/dev/layout";
import { FaArrowLeft, FaChevronRight } from 'react-icons/fa6';
export default function Settings({ children, menu, submenu }) {
  return (
    <Layout menu="settings" >
      {/* Settings Navigation*/}
      <div className="mb-6">
        <div className="flex gap-3 items-center">
          <button>
            <FaArrowLeft size={24}/>
          </button>
          <ul className="flex gap-3 items-center">
            <li>Settings</li>
            {menu !== "" && (
              <>
                <li><FaChevronRight /></li>
                <li>{menu}</li>
              </>
            )}
            {submenu != "" && (
              <>
                <li><FaChevronRight /></li>
                <li>{submenu}</li>
              </>
            )}
          </ul>
        </div>
      </div>
      {/* Main Component*/}
      <div>
        {children}
      </div>
    </Layout>
  );
}
