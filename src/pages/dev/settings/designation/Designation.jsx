import { FaPlus } from "react-icons/fa6";
import { setIsAdd } from "#store/StoreAction";
import { StoreContext } from "#store/StoreContext";
import DesignationList from "./DesignationList";
import React from "react";
import ModalAddDesignation from "./ModalAddDesignation";
import useQueryData from "#functions/custom-hooks/useQueryData";
import { apiVersion } from "#functions/functions-general";
import ButtonSpinner from "#partials/spinners/ButtonSpinner";
import Settings from "#pages/dev/settings/Settings";
const Designation = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
 const {
    isLoading,
    data: dataCategory,
  } = useQueryData(
    `${apiVersion}/controllers/dev/settings/category/index.php`,
    "get",
    "category",
    );
  
  const filterArrayActiveCategory = dataCategory?.data.filter((item) => item.category_is_active === 1);
 
  
  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };
  return (
    <>
      
       <Settings menu="Designation" submenu="">
         {/* Page Header */}
        <div className="flex items-center justify-between w-full">
          <h1>Designation</h1>
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
          <DesignationList setItemEdit={setItemEdit} itemEdit={itemEdit} />
        </div>
     

      {store.isAdd && (
        <>
          <ModalAddDesignation itemEdit={itemEdit} activeCategory={filterArrayActiveCategory


          }/>
        </>
      )}
       </Settings>
    </>
  );
};

export default Designation;
