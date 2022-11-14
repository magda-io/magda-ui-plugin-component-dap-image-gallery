import React, { FunctionComponent, useState } from "react";
import { ExtraVisualisationSectionComponentType } from "@magda/external-ui-plugin-sdk";
import { useAsync } from "react-async-hook";
import requestJson from "./requestJson";
import { CollectionResponse, CollectionFilesResponse, File } from "./DapTypes";

const FileThumbnailViewer: FunctionComponent<{ file: File }> = (props) => {
    const { file } = props;
    const [idx, setIdx] = useState<number>(0);
    const thumbnails: {
        label: string;
        url: string;
    }[] = [];
    if (file?.smallThumbnail) {
        thumbnails.push({
            label: "Small",
            url: file.smallThumbnail
        });
    }
    if (file?.mediumThumbnail) {
        thumbnails.push({
            label: "Medium",
            url: file.mediumThumbnail
        });
    }
    if (file?.largeThumbnail) {
        thumbnails.push({
            label: "Large",
            url: file.largeThumbnail
        });
    }
    if (file?.fullThumbnail) {
        thumbnails.push({
            label: "Full",
            url: file.fullThumbnail
        });
    }

    const thumbnailUrl = thumbnails?.[idx] ? thumbnails[idx].url : "";
    console.log("thumbnails idx: ", idx, "thumbnailUrl: ", thumbnailUrl);
    return (
        <div
            style={{
                width: "100%",
                height: "440px"
            }}
        >
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <select
                    placeholder="Please select thumbnail..."
                    onChange={(e) => setIdx(parseInt(e.target.value))}
                >
                    {thumbnails.map((item, itemIdx) => (
                        <option
                            key={itemIdx}
                            value={itemIdx}
                            selected={itemIdx === idx}
                        >
                            {item.label}
                        </option>
                    ))}
                </select>

                <button className="button"> Option in New Window </button>
            </div>
            <img src={thumbnailUrl} alt="thumbnail image" />
        </div>
    );
};

const DAPThumbnailViewer: ExtraVisualisationSectionComponentType = (props) => {
    const { dataset, config, distributionId } = props;
    const { identifier: datasetId } = dataset;
    const { registryApiReadOnlyBaseUrl } = config;

    if (!distributionId) {
        // this plugin will not be enabled on dataset page
        // as we don't
        return null;
    }

    if (dataset.sourceDetails?.id !== "dap") {
        return null;
    }

    const fileId = dataset.distributions
        ?.find((dis) => dis.identifier === distributionId)
        ?.identifier?.replace(/[^0-9]/g, "");

    const {
        result: files,
        loading,
        error
    } = useAsync(
        async (datasetId: string) => {
            const dapDatasetData = await requestJson<CollectionResponse>(
                `${registryApiReadOnlyBaseUrl}records/${encodeURIComponent(
                    datasetId
                )}/aspects/dap-dataset`
            );
            if (!dapDatasetData.data) {
                throw new Error("Cannot locate data files.");
            }
            const collectionFilesData =
                await requestJson<CollectionFilesResponse>(
                    dapDatasetData.data,
                    undefined,
                    true
                );
            const files = collectionFilesData?.file?.filter(
                (item) =>
                    item.smallThumbnail ||
                    item.mediumThumbnail ||
                    item.largeThumbnail ||
                    item.largeThumbnail
            );
            return files;
        },
        [datasetId]
    );
    const file = files?.find((item) => String(item.id) == fileId);

    return (
        <div className="no-print">
            <h3 className="section-heading">Thumbnail Viewer</h3>
            {loading ? (
                "Loading..."
            ) : error ? (
                <p>Error: {String(error)}</p>
            ) : !files?.length ? (
                "No thumbnail available."
            ) : (
                <FileThumbnailViewer file={file} />
            )}
        </div>
    );
};

export default DAPThumbnailViewer;
