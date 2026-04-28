import { FaPlus } from "react-icons/fa6";
import { setIsAdd } from "#store/StoreAction";
import { StoreContext } from "#store/StoreContext";
import RolesList from "./RolesList";
import React from "react";
import ModalAddRoles from "./ModalAddRoles";
const Roles = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };
  return (
    <>
      
        {/* Page Header */}
        <div className="flex items-center justify-between w-full">
          <h1>Roles</h1>
          <div>
            <button
              className="flex items-center gap-1 hover:underline"
              type="button"
              onClick={handleAdd}
            >
              <FaPlus className="text-primary" />
              Add
            </button>
          </div>
        </div>
        {/*Page Content*/}
        <div>
          <RolesList setItemEdit={setItemEdit} itemEdit={itemEdit} />
        </div>
     

      {store.isAdd && (
        <>
          <ModalAddRoles itemEdit={itemEdit} />
        </>
      )}
    </>
  );
};

export default Roles;
