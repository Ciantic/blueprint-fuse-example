const {
    FuseBox,
    Sparky,
    WebIndexPlugin,
    CSSPlugin,
    CSSResourcePlugin,
    QuantumPlugin
} = require("fuse-box");
const { src, task, watch, context, fuse } = require("fuse-box/sparky");
const express = require("express");
const path = require("path");

context(
    class {
        getConfig() {
            return FuseBox.init({
                homeDir: "src",
                output: "dist/$name.js",
                hash: this.isProduction,
                target: "browser@es6",
                useTypescriptCompiler: true,
                plugins: [
                    WebIndexPlugin({
                        title: "React Code Splitting demo",
                        template: "src/index.html"
                        //path: "/static/"
                    }),
                    [
                        CSSResourcePlugin({
                            dist: "dist/static/css-resources",
                            resolve: f => `/static/css-resources/${f}`
                        }),
                        CSSPlugin()
                    ],

                    this.isProduction &&
                        QuantumPlugin({
                            css: true,
                            bakeApiIntoBundle: "static/app",
                            treeshake: true
                            // uglify: true,
                            // extendServerImport: true
                        })
                ]
            });
        }
        createBundle(fuse) {
            const app = fuse.bundle("static/app");
            const vendor = fuse
                .bundle("static/vendor")
                .instructions("~ index.tsx");
            app.splitConfig({ dest: "static" });
            if (!this.isProduction) {
                app.watch();
                app.hmr();
            }
            app.instructions(">index.tsx");
            return app;
        }

        enableServer(fuse) {
            fuse.dev({ root: false }, server => {
                const dist = path.join(__dirname, "dist");
                const app = server.httpServer.app;
                app.use("/", express.static(dist));
                app.get("*", function(req, res) {
                    res.sendFile(path.join(dist, "index.html"));
                });
            });
        }
    }
);

task("clean", () =>
    src("dist")
        .clean("dist")
        .clean(".fusebox")
        .exec()
);

task("default", ["clean"], async context => {
    const fuse = context.getConfig();
    context.enableServer(fuse);

    context.createBundle(fuse);
    await fuse.run();
});

task("dist", ["clean"], async context => {
    context.isProduction = true;
    const fuse = context.getConfig();
    context.enableServer(fuse);
    //fuse.dev(); // remove it later
    context.createBundle(fuse);
    await fuse.run();
});
/*
const {
    FuseBox,
    WebIndexPlugin,
    CSSPlugin,
    CSSResourcePlugin
} = require("fuse-box");

const express = require("express");
const path = require("path");

const fuse = FuseBox.init({
    homeDir: "src",
    target: "browser@es6",
    output: "dist/$name.js",
    plugins: [
        WebIndexPlugin({
            template: "src/index.html"
        }),
        [
            CSSResourcePlugin({
                dist: "dist/css-resources"
            }),
            CSSPlugin()
        ]
    ]
});

fuse.dev({ root: false }, server => {
    const dist = path.join(__dirname, "dist");
    const app = server.httpServer.app;
    app.use("/", express.static(dist));
    app.get("*", function(req, res) {
        res.sendFile(path.join(dist, "index.html"));
    });
}); // launch http server

fuse
    .bundle("app")
    .instructions(" > index.tsx")
    .hmr()
    .watch();
fuse.run();

*/
