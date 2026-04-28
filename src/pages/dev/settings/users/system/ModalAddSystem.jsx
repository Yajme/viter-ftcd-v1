import React from "react";
import * as Yup from "yup";
import { StoreContext } from "#store/StoreContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryData } from "#functions/custom-hooks/queryData";
import { apiVersion } from "#functions/functions-general";
import { setError, setIsAdd, setMessage, setSuccess } from "#store/StoreAction";
import ModalWrapperSide from "#partials/modals/ModalWrapperSide";
import { FaTimes } from "react-icons/fa";
import { Form, Formik } from "formik";
import { InputSelect, InputText} from "#components/form-inputs/FormInputs";
import ButtonSpinner from "#partials/spinners/ButtonSpinner";
import MessageError from "#partials/MessageError";
const ModalAddSystemUsers = ({ itemEdit , activeRoles = []}) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/controllers/dev/settings/users/system/index.php?id=${itemEdit.user_aid}`
          : `${apiVersion}/controllers/dev/settings/users/system/index.php`,
        itemEdit ? "PUT" : "POST",
        values,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (data.success) {
        dispatch(setSuccess(true));
        dispatch(
          setMessage(`Successfully ${itemEdit ? "updated" : "submitted"}`),
        );
        dispatch(setIsAdd(false));
      }
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });

  const initVal = {
    ...itemEdit,
    user_name: itemEdit ? itemEdit.user_name : "",
    user_email: itemEdit ? itemEdit.user_email : "",
    user_role_id: itemEdit ? itemEdit.user_role_id : "",
    user_email_old: itemEdit ? itemEdit.user_email_old : "",
  };

  const yupSchema = Yup.object({
    user_name: Yup.string().trim().required("Name is required"),
    user_email: Yup.string().trim().email("Invalid email").required("Email is required"),
    user_role_id: Yup.string().trim().required("Role is required"),
  });

  const handleClose = () => {
    dispatch(setIsAdd(false));
  };
  React.useEffect(() => {
    dispatch(setError(false));
  }, []);
  console.log(itemEdit);
  return (
    <>
      <ModalWrapperSide
        handleClose={handleClose}
        className="transition-all ease-in-out transform duration-200"
      >
        {/* Header*/}
        <div className="modal-header relative mb-4">
          <h3 className="text-dark text-sm">
            {itemEdit ? "Update" : "Add"} User
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-0 right-4"
          >
            <FaTimes />
          </button>
        </div>
        {/* Body*/}
        <div className="modal-body">
          <Formik
            initialValues={initVal}
            validationSchema={yupSchema}
            onSubmit={async (values) => {
              mutation.mutate(values);
              dispatch(setError(false));
            }}
          >
            {(props) => {
              return (
                <Form className="h-full">
                  <div className="modal-form-container">
                    <div className="modal-container">
                      <div className="relative mb-6">
                        <InputText
                          label="Name"
                          name="user_name"
                          type="text"
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mt-5 mb-6">
                        <InputSelect
                          label="Role"
                          name="user_role_id"
                          type="text"
                          disabled={mutation.isPending}
                        >
                          <optgroup label="Select a role">
                            <option value="" hidden> --- </option>
                            {activeRoles.map((item,key) => {
                              return <option key={key} value={item.role_aid}>{item.role_name}</option>;
                           })}
                          </optgroup>
                          
                        </InputSelect>
                      </div>
                      <div className="relative mt-5 mb-6">
                        <InputText
                          label="Email"
                          name="user_email"
                          type="email"
                          disabled={mutation.isPending}
                        />
                      </div>
                      {store.error && <MessageError />}
                    </div>
                    <div className="modal-action">
                      <button
                        type="submit"
                        disabled={mutation.isPending || !props.dirty}
                        className="btn-modal-submit"
                      >
                        {mutation.isPending ? (
                          <ButtonSpinner />
                        ) : itemEdit ? (
                          "Save"
                        ) : (
                          "Add"
                        )}
                      </button>
                      <button
                        type="reset"
                        className="btn-modal-cancel"
                        onClick={handleClose}
                        disabled={mutation.isPending}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </ModalWrapperSide>
    </>
  );
};

export default ModalAddSystemUsers;