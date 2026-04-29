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
import { InputCheckbox, InputText, InputTextArea } from "#components/form-inputs/FormInputs";
import ButtonSpinner from "#partials/spinners/ButtonSpinner";
import MessageError from "#partials/MessageError";
const ModalAddDonors = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/controllers/dev/donors/index.php?id=${itemEdit.donor_aid}`
          : `${apiVersion}/controllers/dev/donors/index.php`,
        itemEdit ? "PUT" : "POST",
        values,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
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
    donor_name_old: itemEdit ? itemEdit.donor_name_old : "",
    donor_full_name: itemEdit ? itemEdit.donor_full_name : "",
    donor_email: itemEdit ? itemEdit.donor_email : "",
    donor_contact: itemEdit ? itemEdit.donor_contact : "",
    donor_address: itemEdit ? itemEdit.donor_address : "",
    donor_city: itemEdit ? itemEdit.donor_city : "",
    donor_province: itemEdit ? itemEdit.donor_province : "",
    donor_country: itemEdit ? itemEdit.donor_country : "",
    donor_zip: itemEdit ? itemEdit.donor_zip : "",
    donor_is_active: itemEdit ? itemEdit.donor_is_active === 1 : false,
    donor_stripe_id: itemEdit ? itemEdit.donor_stripe_id : "",
    
  };

  const yupSchema = Yup.object({
    donor_full_name: Yup.string().trim().required("Name is required"),
    donor_email: Yup.string().email("Invalid Email").trim().required("Email is required"),
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
            {itemEdit ? "Update" : "Add"} Role
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
                        <InputCheckbox 
                        label="Active"
                        name="donor_is_active"
                        id="donor_is_active"
                        />
                      </div>
                      <div className="relative mt-5 mb-6">
                        <InputText 
                        label="Full Name"
                        name="donor_full_name"
                        type="text"
                        disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mt-5 mb-6">
                        <InputText
                          label="Email"
                          name="donor_email"
                          type="email"
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mt-5 mb-6">
                        <InputText
                          label="Contact"
                          name="donor_contact"
                          type="text"
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mt-5 mb-6">
                        <InputTextArea
                          label="address"
                          name="donor_address"
                          type="text"
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mt-5 mb-6">
                        <InputText
                          label="City"
                          name="donor_city"
                          type="text"
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mt-5 mb-6">
                        <InputText
                          label="Province/State"
                          name="donor_province"
                          type="text"
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mt-5 mb-6">
                        <InputText
                          label="Country"
                          name="donor_country"
                          type="text"
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mt-5 mb-6">
                        <InputText
                          label="Zip Code"
                          name="donor_zip"
                          type="text"
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

export default ModalAddDonors;
