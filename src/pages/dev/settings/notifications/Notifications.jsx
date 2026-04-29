import { FaPlus } from "react-icons/fa6";
import { setIsAdd } from "#store/StoreAction";
import { StoreContext } from "#store/StoreContext";
import NotificationList from "./NotificationsList";
import React from "react";
import ModalAddNotification from "./ModalAddNotifications";

import Settings from "#pages/dev/settings/Settings";
const Notification = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };
  return (
    <>
      
       <Settings menu="Notifications" submenu="">
         {/* Page Header */}
        <div className="flex items-center justify-between w-full">
          <h1>Notification</h1>
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
          <NotificationList setItemEdit={setItemEdit} itemEdit={itemEdit} />
        </div>
     

      {store.isAdd && (
        <>
          <ModalAddNotification itemEdit={itemEdit} />
        </>
      )}
       </Settings>
    </>
  );
};

export default Notification;
