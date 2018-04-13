import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, BrowserRouter as Router, Link } from "react-router-dom";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/table/lib/css/table.css";
import "./index.css";

export const App = () => {
    return (
        <div>
            <Link to="/">Roog</Link>
            <br />
            <Link to="/home">Home</Link>
            <br />
            <Link to="/other">Other</Link>
            <br />

            <AsyncRoute
                path="/home"
                importer={() => import("./Home")}
                render={({ Home }) => {
                    return <Home />;
                }}
            />
            <AsyncRoute
                path="/other"
                importer={() => import("./Other")}
                render={({ Other }) => {
                    return <Other />;
                }}
            />
        </div>
    );
};

export class LoaderWrapper<T> extends React.Component<
    {
        importer: () => Promise<T>;
        render: (v: T) => React.ReactNode;
    },
    {
        node?: T;
    }
> {
    // Do asynchronous action here
    async componentDidMount() {
        this.setState({
            node: await this.props.importer()
        });
    }

    render() {
        if (this.state && this.state.node) {
            return this.props.render(this.state.node);
        }
        return <div>Loading still...</div>;
    }
}

export class AsyncRoute<T> extends React.Component<
    {
        path: string;
        importer: () => Promise<T>;
        render: (v: T) => React.ReactNode;
    },
    {
        node: T;
    }
> {
    render() {
        return (
            <Route
                path={this.props.path}
                render={() => (
                    <LoaderWrapper
                        importer={this.props.importer}
                        render={this.props.render}
                    />
                )}
            />
        );
    }
}
