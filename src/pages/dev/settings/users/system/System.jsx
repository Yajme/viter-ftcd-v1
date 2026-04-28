import { FaPlus } from "react-icons/fa6";
import { setIsAdd } from "#store/StoreAction";
import { StoreContext } from "#store/StoreContext";
import UsersList from "./SystemList";
import React from "react";
import ModalAddUsers from "./ModalAddSystem";
import { apiVersion } from "#functions/functions-general";
import useQueryData from "#functions/custom-hooks/useQueryData";
import ButtonSpinner from "#partials/spinners/ButtonSpinner";
const SystemUsers = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const {
    isLoading,
    data: dataRoles,
  } = useQueryData(
    `${apiVersion}/controllers/dev/settings/users/roles/index.php`,
    "get",
    "roles",
    );
  
  const filterArrayActiveRoles = dataRoles?.data.filter((item) => item.role_is_active === 1);
 
  
  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };
  return (
    <>
      
        {/* Page Header */}
        {/*<div className="bg-white h-dvw w-dvh">*/}

        {/*</div>*/}
        <div className="flex items-center justify-between w-full">
          <h1>Users</h1>
          <div>
            {isLoading ? <ButtonSpinner /> :

             ( <button
                className="flex items-center gap-1 hover:underline"
                type="button"
                onClick={handleAdd}
              >
                <FaPlus className="text-primary" />
                Add
              </button>)}
          </div>
        </div>
        {/*Page Content*/}
        <div>
          <UsersList setItemEdit={setItemEdit} itemEdit={itemEdit} activeRole={filterArrayActiveRoles}/>
        </div>
      

      {store.isAdd && (
        <>
          <ModalAddUsers itemEdit={itemEdit} activeRoles={filterArrayActiveRoles} />
        </>
      )}
    </>
  );
};

export default SystemUsers;