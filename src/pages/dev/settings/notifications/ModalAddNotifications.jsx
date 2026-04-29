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
const ModalAddNotifications = ({ itemEdit, activeCategory }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/controllers/dev/settings/notifications/index.php?id=${itemEdit.notification_aid}`
          : `${apiVersion}/controllers/dev/settings/notifications/index.php`,
        itemEdit ? "PUT" : "POST",
        values,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
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
    notification_name: itemEdit ? itemEdit.notification_name : "",
    notification_email: itemEdit ? itemEdit.notification_email : "",
    notification_phone: itemEdit ? itemEdit.notification_phone : "",
    notification_purpose: itemEdit ? itemEdit.notification_purpose : "",
    notification_name_old: itemEdit ? itemEdit.notification_name : "",

  };

  const yupSchema = Yup.object({
    notification_name: Yup.string().trim().required("Name is required"),
  });

  const handleClose = () => {
    dispatch(setIsAdd(false));
  };
  React.useEffect(() => {
    dispatch(setError(false));
  }, []);
  return (
    <>
      <ModalWrapperSide
        handleClose={handleClose}
        className="transition-all ease-in-out transform duration-200"
      >
        {/* Header*/}
        <div className="modal-header relative mb-4">
          <h3 className="text-dark text-sm">
            {itemEdit ? "Update" : "Add"} Notifications
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
            onSubmit={async (values, { setSubmitting, resetForm }) => {
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
                          name="notification_name"
                          type="text"
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mt-5 mb-6">
                        <InputText
                          label="Email"
                          name="notification_email"
                          type="text"
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mt-5 mb-6">
                        <InputText
                          label="Phone"
                          name="notification_phone"
                          type="text"
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mt-5 mb-6">
                                              <InputSelect
                                                label="Purpose"
                                                name="notification_purpose"
                                                type="text"
                                                disabled={mutation.isPending}
                                              >
                                                <optgroup label="Select a purpose">
                                                  <option value="" hidden> --- </option>
                                                  <option value="For New Donor">For New Donor</option>
                                                  <option value="For Donation Receipt">For Donation Receipt</option>
                                                  <option value="For Contact Us">For Contact Us</option>
                                                  <option value="For FAQ">For FAQ</option>
                                                </optgroup>
                                              </InputSelect>
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

export default ModalAddNotifications;
