import { queryDataInfinite } from "#functions/custom-hooks/queryDataInfinite";
import { apiVersion} from "#functions/functions-general";
import Loadmore from "#partials/Loadmore";
import ModalArchive from "#partials/modals/ModalArchive";
import ModalDelete from "#partials/modals/ModalDelete";
import ModalRestore from "#partials/modals/ModalRestore";
import NoData from "#partials/NoData";
import SearchBar from "#partials/SearchBar";
import ServerError from "#partials/ServerError";
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
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { FaArchive, FaEdit, FaList, FaTrashRestore } from "react-icons/fa";
import { FaTrash, FaUsers } from "react-icons/fa6";
import { useInView } from "react-intersection-observer";

export default function ChildrenList({ setItemEdit, itemEdit }) {
  const { store, dispatch } = React.useContext(StoreContext);

  // page
  const [page, setPage] = React.useState(1);
  const [filterData, setFilterData] = React.useState("");
  const [onSearch, setOnSearch] = React.useState(false);
  const [searchValue] = React.useState("");
  const { ref, inView } = useInView();
  const search = React.useRef({ value: "" });

  let counter = 1;
  // use if with loadmore button and search bar
  const {
    data: result,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["children", searchValue, store.isSearch, filterData],
    queryFn: async ({ pageParam = 1 }) =>
      await queryDataInfinite(
        `${apiVersion}/controllers/dev/children/page.php?start=${pageParam}`,
        `${apiVersion}/controllers/dev/children/page.php?start=${pageParam}`, // list endpoint
        // store.isSearch || isFilter, // search boolean, // search boolean
        store.isSearch || store.isFilter,
        {
          searchValue: search?.current?.value,
          filterData,
        },
        `post`,
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total) {
        return lastPage.page + lastPage.count;
      }
      // if (lastPage.page < lastPage.total && lastPage.count != 0) {
      //   return lastPage.page + lastPage.per_page;
      // }
      return;
    },
    refetchOnWindowFocus: false,
  });

//   React.useEffect(() => {
//     if (inView) {
//       setPage((prev) => prev + 1);
//       fetchNextPage();
//     }
//   }, [inView]);
const getAge = (birthdate) => {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // ✅ adjust if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};
  const handleEdit = (item) => {
    dispatch(setIsAdd(true));
    setItemEdit(item);
  };

  const handleRestore = (item) => {
    dispatch(setIsRestore(true));
    setItemEdit(item);
  };
  const handleArchive = (item) => {
    dispatch(setIsArchive(true));
    setItemEdit(item);
  };
  const handleDelete = (item) => {
    dispatch(setIsDelete(true));
    setItemEdit(item);
  };
  return (
    <>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
            <div className="relative">
          <label htmlFor=""> Status </label>
          <select
            name=""
            id=""
            onChange={(e) => setFilterData(e.target.value)}
            value={filterData}
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        <div className="flex items-center gap-1 ">
            <FaUsers size={21}/>
            <p className="my-auto text-lg font-semibold">{result?.pages[0]?.count || 0}</p>
        </div>
        </div>
        <SearchBar
          search={search}
          dispatch={dispatch}
          store={store}
          result={result?.pages}
          isFetching={isFetching}
          setOnSearch={setOnSearch}
          onSearch={onSearch}
        />
      </div>
      <div className="relative pt-4 rounded-md">
        {status !== "pending" && isFetching && <FetchingSpinner />}
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Status</th>
              <th>Name</th>
              <th>Birthdate</th>
              <th>Age</th>
              <th>Residency Status</th>
              <th>Donation Limit</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!error &&
              (status == "pending" || result?.pages[0]?.count == 0) && (
                <tr>
                  <td colSpan={"100%"} className="p-10">
                    {status == "pending" ? (
                      <TableLoading cols={2} count={20} />
                    ) : (
                      <NoData />
                    )}
                  </td>
                </tr>
              )}
            {error && (
              <tr>
                <td colSpan={"100%"} className="p-10">
                  <ServerError />
                </td>
              </tr>
            )}
            {result?.pages?.map((page, key) => (
              <React.Fragment key={key}>
                {page?.data?.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>{counter++}</td>
                      <td>
                        <Status
                          text={
                            item.child_is_active == 1 ? "active" : "inactive"
                          }
                        />
                      </td>
                      <td>{item.child_full_name}</td>
                      <td>{item.child_birthdate}</td>
                      <td>{getAge(item.child_birthdate)}</td>
                      <td>{item.child_residency}</td>
                      <td>{item.child_donation_limit}</td>
                      <td>
                        <div className="flex items-center gap-3 justify-center">
                          {item.child_is_active == 1 ? (
                            <>
                              <button
                                type="button"
                                className="tooltip-action-table"
                                data-tooltip="edit"
                                onClick={() => handleEdit(item)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                className="tooltip-action-table"
                                data-tooltip="Archive"
                                onClick={() => handleArchive(item)}
                              >
                                <FaArchive />
                              </button>
                              <button
                                type="button"
                                className="tooltip-action-table"
                                data-tooltip="List"
                                onClick={() => handleArchive(item)}
                              >
                                <FaList />
                              </button>
                              
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="tooltip-action-table"
                                data-tooltip="Restore"
                                onClick={() => handleRestore(item)}
                              >
                                <FaTrashRestore />
                              </button>
                              <button
                                type="button"
                                className="tooltip-action-table"
                                data-tooltip="delete"
                                onClick={() => handleDelete(item)}
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {store.isRestore && (
        <ModalRestore
          mysqlApiRestore={`${apiVersion}/controllers/dev/children/index.php?id=${itemEdit.child_aid}&action=archive`}
          dataItem={itemEdit}
          queryKey={"children"}
          msg={"Are you sure to restore this record?"}
          successMsg={"Successfully restored this record"}
          item={`${itemEdit.child_full_name}`}
        />
      )}
      {store.isDelete && (
        <ModalDelete
          mysqlApiDelete={`${apiVersion}/controllers/dev/children/index.php?id=${itemEdit.child_aid}`}
          dataItem={itemEdit}
          queryKey={"children"}
          msg={"Are you sure to delete this record?"}
          successMsg={"Successfully deleted this record"}
          item={`${itemEdit.child_full_name}`}
        />
      )}
      {store.isArchive && (
        <ModalArchive
          mysqlApiArchive={`${apiVersion}/controllers/dev/children/index.php?id=${itemEdit.child_aid}&action=archive`}
          dataItem={itemEdit}
          queryKey={"children"}
          msg={"Are you sure you want to archive this record?"}
          successMsg={"Successfully archived this record."}
          item={`${itemEdit.child_full_name}`}
        />
      )}
      <div className="loadmore flex justify-center flex-col items-center pb-10">
        <Loadmore
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          result={result?.pages[0]}
          setPage={setPage}
          page={page}
          refView={ref}
          isSearchOrFilter={store.isSearch || store?.isFilter}
        />
      </div>
    </>
  );
};

