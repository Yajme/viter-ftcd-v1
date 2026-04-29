import { FaPlus } from "react-icons/fa6";
import { setIsAdd } from "#store/StoreAction";
import { StoreContext } from "#store/StoreContext";
import DonorsList from "./DonorsList";
import React from "react";
import ModalAddDonors from "./ModalAddDonors";
import Layout from "#pages/dev/layout";
const Donors = () => {
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
          <h1>Donors</h1>
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
          <DonorsList setItemEdit={setItemEdit} itemEdit={itemEdit} />
        </div>
     

      {store.isAdd && (
        <>
          <ModalAddDonors itemEdit={itemEdit} />
        </>
      )}
      </Layout>
    </>
  );
};

export default Donors;
