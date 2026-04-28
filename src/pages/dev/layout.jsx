import ModalSuccess from "#partials/modals/ModalSuccess";
import { useContext } from "react";
import Header from "../../partials/Header.jsx";
import Navigation from "../../partials/Navigation.jsx";
import { navList } from "./nav-functions.jsx";
import { StoreContext } from "#store/StoreContext";
const layout = ({ children, menu, submenu }) => {
  const { store, dispatch } = useContext(StoreContext);
  return (
    <>
      {/* Header */}
      <Header />
      {/* Navigation */}
      <Navigation navigationList={navList} menu={menu} submenu={submenu} />
      {/* Body */}
      <div className="wrapper">{children}</div>
      {/* Footer */}

      {store.success && <ModalSuccess />}
    </>
  );
};

export default layout;
