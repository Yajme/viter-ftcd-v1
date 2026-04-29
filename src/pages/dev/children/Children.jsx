import { FaPlus } from "react-icons/fa6";
import { setIsAdd } from "#store/StoreAction";
import { StoreContext } from "#store/StoreContext";
import ChildrenList from "./ChildrenList";
import React from "react";
import ModalAddChildren from "./ModalAddChildren";
import Layout from "#pages/dev/layout";
const Children = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };
  return (
    <>
      <Layout>

        {/* Page Header */}
        <div className="flex items-center justify-between w-full">
          <h1>Children List</h1>
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
          <ChildrenList setItemEdit={setItemEdit} itemEdit={itemEdit} />
        </div>
     

      {store.isAdd && (
        <>
          <ModalAddChildren itemEdit={itemEdit} />
        </>
      )}
      </Layout>
    </>
  );
};

export default Children;
