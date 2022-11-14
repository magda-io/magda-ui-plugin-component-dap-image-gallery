import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { user, config } from "./defaultData";
import sampleDatasetData from "./sampleDataset.json";
import MagdaPluginComponentExtraVisualisationSection from "./MagdaPluginComponentExtraVisualisationSection";

ReactDOM.render(
    <BrowserRouter>
        <div>
            <div>
                <h2>DAP Thumbnail Viewer On Dataset Page:</h2>
                <div>
                    <MagdaPluginComponentExtraVisualisationSection
                        isFetchingWhoAmI={false}
                        whoAmIError={null}
                        user={user}
                        config={config}
                        requestSignOut={() => Promise.resolve()}
                        requestWhoAmI={() => Promise.resolve()}
                        fetchContent={() => Promise.resolve()}
                        history={{} as any}
                        location={{} as any}
                        match={{} as any}
                        dataset={sampleDatasetData as any}
                    />
                </div>
            </div>
            <div>
                <h2>
                    DAP Thumbnail Viewer On Distribution Page with Thumbnail:
                </h2>
                <div>
                    <MagdaPluginComponentExtraVisualisationSection
                        isFetchingWhoAmI={false}
                        whoAmIError={null}
                        user={user}
                        config={config}
                        requestSignOut={() => Promise.resolve()}
                        requestWhoAmI={() => Promise.resolve()}
                        fetchContent={() => Promise.resolve()}
                        history={{} as any}
                        location={{} as any}
                        match={{} as any}
                        dataset={sampleDatasetData as any}
                        distributionId={"dist-dap-13381115"}
                    />
                </div>
            </div>
            <div>
                <h2>
                    DAP Thumbnail Viewer On Distribution Page without Thumbnail:
                </h2>
                <div>
                    <MagdaPluginComponentExtraVisualisationSection
                        isFetchingWhoAmI={false}
                        whoAmIError={null}
                        user={user}
                        config={config}
                        requestSignOut={() => Promise.resolve()}
                        requestWhoAmI={() => Promise.resolve()}
                        fetchContent={() => Promise.resolve()}
                        history={{} as any}
                        location={{} as any}
                        match={{} as any}
                        dataset={sampleDatasetData as any}
                        distributionId={"dist-dap-13381115"}
                    />
                </div>
            </div>
        </div>
    </BrowserRouter>,
    document.getElementById("root")
);
