// import React from 'react';
import { devNavUrl, urlDeveloper } from "#functions/functions-general";
import Layout from "#pages/dev/layout";
import { FaArrowLeft, FaChevronRight } from 'react-icons/fa6';
import { Link, useNavigate } from "react-router-dom";
export default function Settings({ children, menu, submenu }) {
  const navigate = useNavigate();
  return (
    <Layout menu="settings" >
      {/* Settings Navigation*/}
      <div className="mb-6">
        <div className="flex gap-3 items-center">
          <button onClick={()=> navigate(-1)}>
            <FaArrowLeft size={24}/>
          </button>
          <ul className="flex gap-3 items-center">
            <li><Link to={`${devNavUrl}/${urlDeveloper}/settings`} className="text-primary">
            Settings
            </Link></li>
            {menu !== "" && (
              <>
                <li><FaChevronRight /></li>
                <li>{submenu != "" ? (
                  <Link to={`${devNavUrl}/${urlDeveloper}/settings/${menu}`} className="text-primary">
                    {menu}
                  </Link>
                ) : menu}</li>
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
