import { FaUserCircle, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
// Route /settings/users
export default function Users() {
  return (
    <>
      <div className="relative flex flex-col">
        <div>
          <h2 className="text-2xl mb-6">Users</h2>
          {/* Wrapper*/}
          <div className="flex flex-col">
            {/* Item 1*/}
            <Link to="/developer/settings/users/roles" className="hover:text-primary">
              <div className="flex justify-between border-b border-b-gray-500 py-4">
                <div className="flex items-center gap-2 ">
                  {/* Icon*/}
                  <FaUserCircle />
                  {/* Title*/}
                  <h3 className="text-xl">Roles</h3>
                </div>

                <div>
                  <FaChevronRight size={32} />
                </div>
              </div>
            </Link>
            <Link to="/developer/settings/users/system" className="hover:text-primary">
              <div className="flex justify-between border-b border-b-gray-500 py-4">
                <div className="flex items-center gap-2 ">
                  {/* Icon*/}
                  <FaUserCircle />
                  {/* Title*/}
                  <h3 className="text-xl">System Users</h3>
                </div>

                <div>
                  <FaChevronRight size={32} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
