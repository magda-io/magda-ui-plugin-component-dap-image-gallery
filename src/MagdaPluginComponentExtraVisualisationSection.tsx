import React from "react";
import { CollectionResponse, CollectionFilesResponse, File } from "./DapTypes";
import { ExtraVisualisationSectionComponentType } from "@magda/external-ui-plugin-sdk";
import { useAsync } from "react-async-hook";
import requestJson from "./requestJson";
import ImageGallery from "react-image-gallery";
import "./MagdaPluginComponentExtraVisualisationSection.scss";

interface ImageItem {
    label: string;
    url: string;
}

/**
 * Get all possible image thumbnails for a file.
 * The result array in order of from small size to full size.
 *
 * @param {File} file
 * @return {*}  {ImageItem[]}
 */
function getImages(file: File): ImageItem[] {
    const thumbnails: ImageItem[] = [];

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
    return thumbnails;
}

/**
 * Pick two images from all possible images
 * One for the smallest size (use as thumbnail).
 * One used for full size preview.
 *
 * @param {ImageItem[]} images
 * @return {*}  {ImageItem[]}
 */
function pick2Images(images: ImageItem[]): ImageItem[] {
    if (images?.length >= 2) {
        return [images[0], images[images.length - 1]];
    } else if (images.length > 0) {
        return [images[0], images[0]];
    } else {
        return [] as ImageItem[];
    }
}

const DAPThumbnailViewer: ExtraVisualisationSectionComponentType = (props) => {
    const { dataset, config, distributionId } = props;
    const { identifier: datasetId } = dataset;
    const { registryApiReadOnlyBaseUrl } = config;

    if (dataset.sourceDetails?.id !== "dap") {
        return null;
    }

    const {
        result: galleryItems,
        loading,
        error
    } = useAsync(
        async (datasetId: string, distributionId?: string) => {
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
                    config.proxyUrl + "_0d/" + dapDatasetData.data
                );

            let files = collectionFilesData?.file;
            if (distributionId) {
                // on distribution page, we only show one item for current file.
                const fileId = dataset.distributions
                    ?.find((dis) => dis.identifier === distributionId)
                    ?.identifier?.replace(/[^0-9]/g, "");
                files = files?.filter((item) => String(item.id) == fileId);
            }

            const galleryItems = files
                ?.filter(
                    (item) =>
                        item.smallThumbnail ||
                        item.mediumThumbnail ||
                        item.largeThumbnail ||
                        item.largeThumbnail
                )
                ?.map((file) => {
                    const images = pick2Images(getImages(file));
                    if (!images?.length) {
                        return null;
                    }
                    const originalTitle = `${file.filename} (${images[1].label} size)`;
                    const thumbnailTitle = `${file.filename} (${images[0].label})`;
                    const galleryItem = {
                        original: images[1].url,
                        thumbnail: images[0].url,
                        originalTitle,
                        thumbnailTitle,
                        originalAlt: originalTitle,
                        thumbnailAlt: thumbnailTitle,
                        description: originalTitle,
                        originalHeight: "688px",
                        originalWidth: "688px",
                        thumbnailWidth: "92px",
                        thumbnailHeight: "92px",
                        loading: "lazy",
                        thumbnailLoading: "lazy"
                    };
                    return galleryItem;
                })
                ?.filter((item) => !!item);
            return galleryItems?.length ? galleryItems : [];
        },
        [datasetId, distributionId]
    );

    return (
        <div className="no-print magda-plugin-component-dap-thumbnail-viewer">
            <h3 className="section-heading">Thumbnail Viewer</h3>
            {loading ? (
                "Loading..."
            ) : error ? (
                <p>Error: {String(error)}</p>
            ) : !galleryItems?.length ? (
                "No thumbnail available."
            ) : (
                <ImageGallery
                    items={galleryItems}
                    infinite={false}
                    showIndex={true}
                    lazyLoad={true}
                    showPlayButton={false}
                    thumbnailPosition="bottom"
                    showNav={true}
                    useTranslate3D={false}
                />
            )}
        </div>
    );
};

export default DAPThumbnailViewer;
