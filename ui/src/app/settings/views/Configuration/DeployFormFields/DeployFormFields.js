import { Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import configSelectors from "app/store/config/selectors";
import FormikField from "app/base/components/FormikField";
import { osInfo as osInfoSelectors } from "app/store/general/selectors";

const DeployFormFields = () => {
  const formikProps = useFormikContext();
  const defaultOSystemOptions = useSelector(
    configSelectors.defaultOSystemOptions
  );

  const distroSeriesOptions = useSelector((state) =>
    osInfoSelectors.getOsReleases(state, formikProps.values.default_osystem)
  );

  const allDistroSeries = useSelector(osInfoSelectors.getAllOsReleases);

  return (
    <>
      <FormikField
        label="Default operating system used for deployment"
        component={Select}
        options={defaultOSystemOptions}
        name="default_osystem"
        onChange={(e) => {
          formikProps.handleChange(e);
          formikProps.setFieldTouched("default_osystem", true, true);
          formikProps.setFieldValue(
            "default_distro_series",
            allDistroSeries[e.target.value][0].value
          );
          formikProps.setFieldTouched("default_distro_series", true, true);
        }}
      />
      <FormikField
        label="Default OS release used for deployment"
        component={Select}
        options={distroSeriesOptions}
        name="default_distro_series"
      />
    </>
  );
};

export default DeployFormFields;
