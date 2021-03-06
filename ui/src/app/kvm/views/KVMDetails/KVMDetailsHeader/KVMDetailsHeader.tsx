import { useEffect, useState } from "react";

import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useLocation } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";
import type { RouteParams } from "app/base/types";
import KVMActionFormWrapper from "app/kvm/components/KVMActionFormWrapper";
import PodDetailsActionMenu from "app/kvm/components/PodDetailsActionMenu";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

const KVMDetailsHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams<RouteParams>();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  // If path is not exactly "/kvm/<pod.id>" close the form.
  useEffect(() => {
    if (location.pathname !== `/kvm/${id}`) {
      setSelectedAction("");
    }
  }, [id, location.pathname]);

  return (
    <SectionHeader
      buttons={
        !selectedAction
          ? [
              <PodDetailsActionMenu
                key="action-dropdown"
                setSelectedAction={setSelectedAction}
              />,
            ]
          : undefined
      }
      formWrapper={
        (selectedAction && (
          <KVMActionFormWrapper
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
          />
        )) ||
        undefined
      }
      loading={!pod}
      subtitle={pluralize(
        "composed machine",
        pod?.composed_machines_count,
        true
      )}
      tabLinks={[
        ...(pod?.type === PodType.LXD
          ? [
              {
                active: location.pathname.endsWith(`/kvm/${id}/project`),
                component: Link,
                "data-test": "projects-tab",
                label: "Project",
                to: `/kvm/${id}/project`,
              },
            ]
          : []),
        {
          active: location.pathname.endsWith(`/kvm/${id}/resources`),
          component: Link,
          label: "Resources",
          to: `/kvm/${id}/resources`,
        },
        {
          active: location.pathname.endsWith(`/kvm/${id}/edit`),
          component: Link,
          label: "Settings",
          to: `/kvm/${id}/edit`,
        },
      ]}
      title={pod?.name || ""}
    />
  );
};

export default KVMDetailsHeader;
