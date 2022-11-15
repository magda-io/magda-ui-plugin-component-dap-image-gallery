const path = require("path");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const configFile = path.resolve(__dirname, "./tsconfig.json");

module.exports = {
    entry: {
        app: "./src/index.tsx"
    },
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./public",
        hot: true
    },
    output: {
        path: path.join(__dirname, ".", "dist")
    },
    externals: {
        react: "React",
        "react-dom": "ReactDOM",
        "react-router": "ReactRouter",
        "react-router-dom": "ReactRouterDOM"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader",
                options: {
                    configFile,
                    compilerOptions: {
                        lib: [
                            "dom",
                            "es5",
                            "es6",
                            "scripthost",
                            "es2015.promise"
                        ]
                    }
                }
            },
            {
                test: /\.(css|s[ac]ss)$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader"
                ]
            },
            {
                test: /\.svg$/,
                use: ["@svgr/webpack"]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Hot Module Replacement",
            template: path.resolve(__dirname, "public/index.html")
        })
    ],
    resolve: {
        plugins: [
            new TsconfigPathsPlugin({
                configFile
            })
        ],
        extensions: [".tsx", ".ts", ".js"]
    }
};
