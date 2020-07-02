import pluralize from "pluralize";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { getProcessingLabel } from "../utils";
import { machine as machineActions } from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import { useProcessing } from "app/base/hooks";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import TagFormFields from "./TagFormFields";

const TagFormSchema = Yup.object().shape({
  tags: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        displayName: Yup.string(),
      })
    )
    .min(1)
    .required("You must select at least one tag."),
});

export const TagForm = ({ processing, setProcessing, setSelectedAction }) => {
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({ tags: [] });
  const selectedMachines = useSelector(machineSelectors.selected);
  const saved = useSelector(machineSelectors.saved);
  const errors = useSelector(machineSelectors.errors);
  const taggingSelected = useSelector(machineSelectors.taggingSelected);

  let formErrors = { ...errors };
  if (formErrors && formErrors.name) {
    formErrors.tags = formErrors.name;
    delete formErrors.name;
  }
  const hasErrors = Object.keys(errors).length > 0;

  useProcessing(
    taggingSelected.length,
    () => {
      setProcessing(false);
      setSelectedAction(null);
    },
    hasErrors,
    () => setProcessing(false)
  );

  return (
    <FormikForm
      buttons={FormCardButtons}
      buttonsBordered={false}
      errors={formErrors}
      cleanup={machineActions.cleanup}
      initialValues={initialValues}
      submitLabel={`Tag ${selectedMachines.length} ${pluralize(
        "machine",
        selectedMachines.length
      )}`}
      onCancel={() => setSelectedAction(null, true)}
      onSaveAnalytics={{
        action: "Tag",
        category: "Take action menu",
        label: "Tag selected machines",
      }}
      onSubmit={(values) => {
        if (values.tags && values.tags.length) {
          selectedMachines.forEach((machine) => {
            dispatch(machineActions.tag(machine.system_id, values.tags));
          });
        }
        setInitialValues(values);
        setProcessing(true);
      }}
      saving={processing}
      savingLabel={getProcessingLabel(
        taggingSelected.length,
        selectedMachines.length,
        "tag"
      )}
      saved={saved}
      validationSchema={TagFormSchema}
    >
      <TagFormFields />
    </FormikForm>
  );
};

TagForm.propTypes = {
  processing: PropTypes.bool,
  setProcessing: PropTypes.func.isRequired,
  setSelectedAction: PropTypes.func.isRequired,
};

export default TagForm;