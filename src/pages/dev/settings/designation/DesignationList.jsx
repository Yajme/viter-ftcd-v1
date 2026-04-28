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

const DesignationList = ({ setItemEdit, itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const {
    isLoading,
    isFetching,
    data: dataDesignation,
  } = useQueryData(
    `${apiVersion}/controllers/dev/settings/designation/index.php`,
    "get",
    "designation",
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
              <th>Name</th>
              <th>Category</th>
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
            ) : dataDesignation?.count === 0 ? (
              <tr>
                <td colSpan="100%" className="p-10">
                  <NoData />
                </td>
              </tr>
            ) : (
              dataDesignation?.data.map((designation, key) => {
                return (
                  <tr key={key}>
                    <td>{designation.designation_aid}</td>
                    <td>
                      <Status
                        text={`${designation.designation_is_active == 1 ? "active" : "inactive"}`}
                      />
                    </td>
                    <td>{designation.designation_name}</td>
                    <td>{designation.category_name}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        {designation.designation_is_active == 1 ? (
                          <>
                            <button
                              type="button"
                              className="tooltip-action-table"
                              data-tooltip="edit"
                              onClick={() => handleEdit(designation)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              className="tooltip-action-table"
                              data-tooltip="Archive"
                              onClick={() => handleArchive(designation)}
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
                              onClick={() => handleRestore(designation)}
                            >
                              <FaTrashRestore />
                            </button>
                            <button
                              type="button"
                              className="tooltip-action-table"
                              data-tooltip="delete"
                              onClick={() => handleDelete(designation)}
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
          mysqlApiRestore={`${apiVersion}/controllers/dev/settings/designation/index.php?id=${itemEdit.designation_aid}&action=archive`}
          dataItem={itemEdit}
          queryKey={"designation"}
          msg={"Are you sure to restore this record?"}
          successMsg={"Successfully restored this record"}
          item={itemEdit.designation_name}
        />
      )}
      {store.isDelete && (
        <ModalDelete
          mysqlApiDelete={`${apiVersion}/controllers/dev/settings/designation/index.php?id=${itemEdit.designation_aid}`}
          dataItem={itemEdit}
          queryKey={"designation"}
          msg={"Are you sure to delete this record?"}
          successMsg={"Successfully deleted this record"}
          item={itemEdit.designation_name}
        />
      )}
      {store.isArchive && (
        <ModalArchive
          mysqlApiArchive={`${apiVersion}/controllers/dev/settings/designation/index.php?id=${itemEdit.designation_aid}&action=archive`}
          dataItem={itemEdit}
          queryKey={"designation"}
          msg={"Are you sure you want to archive this record?"}
          successMsg={"Successfully archived this record."}
          item={itemEdit.designation_name}
        />
      )}
    </>
  );
};

export default DesignationList;
