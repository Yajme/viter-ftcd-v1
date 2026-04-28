import useQueryData from "#functions/custom-hooks/useQueryData";
import { apiVersion, formatDate } from "#functions/functions-general";
import ModalArchive from "#partials/modals/ModalArchive";
import ModalDelete from "#partials/modals/ModalDelete";
import ModalRestore from "#partials/modals/ModalRestore";
import NoData from "#partials/NoData";
import FetchingSpinner from "#partials/spinners/FetchingSpinner";
import Status from "#partials/Status";
import TableLoading from "#partials/TableLoading";
import {
  setIsAdd,
  setIsArchive,
  setIsDelete,
  setIsRestore,
} from "#store/StoreAction";
import { StoreContext } from "#store/StoreContext";
import React from "react";
import { FaArchive, FaEdit, FaTrashRestore } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";

const RolesList = ({ setItemEdit, itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const {
    isLoading,
    isFetching,
    data: dataRoles,
  } = useQueryData(
    `${apiVersion}/controllers/dev/settings/users/roles/index.php`,
    "get",
    "roles",
  );
  const handleEdit = (item) => {
    dispatch(setIsAdd(true));
    setItemEdit(item);
  };
  const handleArchive = (item) => {
    dispatch(setIsArchive(true));
    setItemEdit(item);
  };
  const handleRestore = (item) => {
    dispatch(setIsRestore(true));
    setItemEdit(item);
  };
  const handleDelete = (item) => {
    dispatch(setIsDelete(true));
    setItemEdit(item);
  };
  return (
    <>
      <div className="relative pt-6 rounded-md">
        {isFetching && !isLoading && <FetchingSpinner />}
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Status</th>
              <th>Role</th>
              <th>Description</th>
              <th>Created</th>
              <th>Date updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="100%" className="p-10">
                  <TableLoading cols={2} count={20} />
                </td>
              </tr>
            ) : dataRoles?.count === 0 ? (
              <tr>
                <td colSpan="100%" className="p-10">
                  <NoData />
                </td>
              </tr>
            ) : (
              dataRoles?.data.map((role, key) => {
                return (
                  <tr key={key}>
                    <td>{role.role_aid}</td>
                    <td>
                      <Status
                        text={`${role.role_is_active == 1 ? "active" : "inactive"}`}
                      />
                    </td>
                    <td>{role.role_name}</td>
                    <td>{role.role_description}</td>
                    <td>{formatDate(role.role_created, "--", "short-date")}</td>
                    <td>{formatDate(role.role_updated, "--", "short-date")}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        {role.role_is_active == 1 ? (
                          <>
                            <button
                              type="button"
                              className="tooltip-action-table"
                              data-tooltip="edit"
                              onClick={() => handleEdit(role)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              className="tooltip-action-table"
                              data-tooltip="Archive"
                              onClick={() => handleArchive(role)}
                            >
                              <FaArchive />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="tooltip-action-table"
                              data-tooltip="Restore"
                              onClick={() => handleRestore(role)}
                            >
                              <FaTrashRestore />
                            </button>
                            <button
                              type="button"
                              className="tooltip-action-table"
                              data-tooltip="delete"
                              onClick={() => handleDelete(role)}
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {store.isRestore && (
        <ModalRestore
          mysqlApiRestore={`${apiVersion}/controllers/dev/settings/users/roles/index.php?id=${itemEdit.role_aid}&action=archive`}
          dataItem={itemEdit}
          queryKey={"roles"}
          msg={"Are you sure to restore this record?"}
          successMsg={"Successfully restored this record"}
          item={itemEdit.role_name}
        />
      )}
      {store.isDelete && (
        <ModalDelete
          mysqlApiDelete={`${apiVersion}/controllers/dev/settings/users/roles/index.php?id=${itemEdit.role_aid}`}
          dataItem={itemEdit}
          queryKey={"roles"}
          msg={"Are you sure to delete this record?"}
          successMsg={"Successfully deleted this record"}
          item={itemEdit.role_name}
        />
      )}
      {store.isArchive && (
        <ModalArchive
          mysqlApiArchive={`${apiVersion}/controllers/dev/settings/users/roles/index.php?id=${itemEdit.role_aid}&action=archive`}
          dataItem={itemEdit}
          queryKey={"roles"}
          msg={"Are you sure you want to archive this record?"}
          successMsg={"Successfully archived this record."}
          item={itemEdit.role_name}
        />
      )}
    </>
  );
};

export default RolesList;
