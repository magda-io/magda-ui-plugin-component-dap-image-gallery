import React from "react";
import { ExtraVisualisationSectionComponentType } from "@magda/external-ui-plugin-sdk";
import { ConfigDataType } from "@magda/external-ui-plugin-sdk";
import urijs from "urijs";

// we don't need to deifne all property here
// see Magda main repo for full definition
type DatasetDataType = {
    identifier: string;
    landingPage?: string;
    distributions?: DistributionDataType[];
};

// we don't need to deifne all property here
// see Magda main repo for full definition
type DistributionDataType = {
    identifier: string;
    format?: string;
    downloadURL?: string;
    accessURL?: string;
};

function validateDistribution(disData: DistributionDataType) {
    const { format, downloadURL, accessURL } = disData;
    if (!format || typeof format !== "string") {
        return false;
    }
    if (format.toLocaleLowerCase().trim() !== "esri sceneserver") {
        return false;
    }
    const url = downloadURL ? downloadURL : accessURL;
    if (!url || typeof url !== "string") {
        return false;
    }
    if (!url.match(/\W*SceneServer\W*/)) {
        return false;
    }
    return true;
}

type DTConfigType = {
    // determin which DT URL should be used. i.e. only when the source dataset url domain contains `sourceDataDomain`, the DT config entry will be matched.
    // "*" or empty value or undefined means the DT entry can be used for any 3d datasets
    sourceDataDomain?: string;
    url: string;
}[];

function createDTLink(
    dataset: DatasetDataType,
    disData: DistributionDataType,
    configData: ConfigDataType
): string | null {
    const { landingPage } = dataset;
    const { extraConfigData } = configData;

    if (!extraConfigData?.["3dDatasetDigitalTwinInstances"]?.length) {
        console.log(
            "Open 3D Dataset Button: cannot locate Digital Twin Config."
        );
        return null;
    }

    if (!landingPage || typeof landingPage !== "string") {
        console.log("Open 3D Dataset Button: dataset landing page is empty.");
        return null;
    }

    const uri = urijs(landingPage);
    const sourceDomain = uri.host();
    const itemId = uri.search(true)?.id;

    if (!itemId) {
        console.log(
            "Open 3D Dataset Button: dataset landing page doesn't contains 3D item id."
        );
        return null;
    }

    const dtConfigData: DTConfigType =
        extraConfigData["3dDatasetDigitalTwinInstances"];
    const dtConfig = dtConfigData.find((item) => {
        if (!item.sourceDataDomain || item.sourceDataDomain === "*") {
            return true;
        }
        if (
            typeof item.sourceDataDomain === "string" &&
            sourceDomain.indexOf(item.sourceDataDomain) !== -1
        ) {
            return true;
        }
        return false;
    });

    if (!dtConfig || !dtConfig?.url) {
        console.log("Open 3D Dataset Button: cannot find a matched DT config.");
        return null;
    }

    return urijs(dtConfig.url).fragment(`magdaLayers=${itemId}`).toString();
}

const MagdaPluginComponentExtraVisualisationSection: ExtraVisualisationSectionComponentType =
    (props) => {
        const dataset: DatasetDataType = props.dataset;
        const distributionId: string | undefined = props.distributionId;
        const configData = props.config;

        if (!dataset?.distributions?.length) {
            // no distribution available
            console.log("Open 3D Dataset Button: no distribution available.");
            return null;
        }

        let selectedDis;

        if (distributionId) {
            selectedDis = dataset.distributions.find(
                (item) => item?.identifier === distributionId
            );
            if (!selectedDis) {
                console.log(
                    "Open 3D Dataset Button: Cannot locate distribution with id: " +
                        distributionId
                );
                return null;
            }
            if (!validateDistribution(selectedDis)) {
                console.log(
                    "Open 3D Dataset Button: the distribution doesn't contain a ESRI SceneServer API access url."
                );
                return null;
            }
        } else {
            selectedDis = dataset.distributions.find((item) =>
                validateDistribution(item)
            );
            if (!selectedDis) {
                console.log(
                    "Open 3D Dataset Button: the dataset has no supported 3D data distribution."
                );
                return null;
            }
        }

        const dtLink = createDTLink(dataset, selectedDis, configData);
        if (!dtLink) {
            return null;
        }

        return (
            <div className="no-print">
                <h3 className="section-heading">Map Preview</h3>
                <p>
                    Map Preview cannot preview 3D datasets. Please click the
                    button to view the 3D datasets in Digital Twin.
                </p>
                <a
                    className="au-btn au-btn--secondary open-3d-dataset-in-dt-button"
                    aria-label="Open 3D Dataset in Digital Twin"
                    target="_blank"
                    href={dtLink}
                >
                    <span>Open 3D Dataset in Digital Twin</span>
                </a>
            </div>
        );
    };

export default MagdaPluginComponentExtraVisualisationSection;
