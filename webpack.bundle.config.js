const path = require("path");
const webpack = require("webpack");
const PRODUCTION = process.env.NODE_ENV === "production";
const TARGET_FOLDER = "bundle";


const editronCoreConfig = {
    entry: [
        path.join(__dirname, "index.js"),
        path.join(__dirname, "core.scss"),
        path.resolve("./node_modules/mithril-material-forms"),
        path.resolve("./node_modules/json-data-services")
    ],
    output: {
        filename: "editron-core.js",
        library: ["editron"],
        path: path.resolve(__dirname, TARGET_FOLDER)
    },

    context: __dirname,
    target: "web",
    devtool: PRODUCTION ? false : "source-map",

    externals: {
        mithril: "m"
    },

    resolve: {
        symlinks: false,
        modules: [".", "node_modules"],
        alias: {
            mitt: path.resolve("./node_modules/mitt/dist/mitt.js"),
            "medium-editor-styles": path.resolve("./node_modules/medium-editor/dist/css/medium-editor.min.css"),
            "medium-editor-theme": path.resolve("./node_modules/medium-editor/dist/css/themes/flat.min.css")
        }
    },

    module: {
        rules: [
            {
                test: /.*.js$/,
                loader: require.resolve("babel-loader"),
                include: [
                    path.resolve(__dirname, "app"),
                    path.resolve(__dirname, "lib"),
                    /json-.*\//, /mithril-.*\//, /editron-.*\//
                ],
                options: {
                    presets: [require.resolve("babel-preset-es2015")],
                    plugins: [
                        require.resolve("babel-plugin-transform-object-assign"),
                        require.resolve("babel-plugin-transform-object-rest-spread") // redux-undo
                    ],
                    babelrc: false,
                    cacheDirectory: true
                }
            },
            {
                test: /.*\.css$/,
                loaders: ["style-loader", "css-loader"]
            },
            {
                loader: "url-loader",
                test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff\d?$|\.ttf$|\.eot|\.otf|\.wav$|\.mp3$/
            },
            {
                test: [/wysiwyg-editor.scss/, /core.scss$/],
                use: [
                    "file-loader?name=[name].css",
                    "extract-loader",
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            includePaths: [path.join(__dirname, "node_modules")]
                        }
                    }
                ]
            },
            {
                loaders: [
                    "file-loader?name=index.html",
                    "extract-loader",
                    "html-loader"
                ],
                include: [path.join(__dirname, "app", "index.html")]
            },
            {
                loaders: "json-loader",
                test: /\.json$/
            }
        ]
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            DEBUG: !PRODUCTION
        }),
        new webpack.DllPlugin({
            name: "editron",
            context: __dirname,
            path: path.join(__dirname, TARGET_FOLDER, "manifest.json")
        })
    ].concat(PRODUCTION ? [
        new (require("uglifyjs-webpack-plugin"))({
            sourceMap: false,
            compress: { drop_console: true }
        })
    ] : [])
};


module.exports = [editronCoreConfig];