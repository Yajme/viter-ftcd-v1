import { FaPlus } from "react-icons/fa6";
import { setIsAdd } from "#store/StoreAction";
import { StoreContext } from "#store/StoreContext";
import CategoryList from "./CategoryList";
import React from "react";
import ModalAddCategory from "./ModalAddCategory";
import Layout from "#pages/dev/layout";
const Category= () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
 
  
  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };
  return (
    <>
      <Layout>
        <div className="flex items-center justify-between w-full">
          <h1>Categories</h1>
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
          <CategoryList setItemEdit={setItemEdit} itemEdit={itemEdit} />
        </div>
      

      {store.isAdd && (
        <>
          <ModalAddCategory itemEdit={itemEdit}  />
        </>
      )}
      </Layout>
    </>
  );
};

export default Category;