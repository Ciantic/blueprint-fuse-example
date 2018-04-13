import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, BrowserRouter as Router, Link, Switch } from "react-router-dom";
import {
    Navbar,
    NavbarGroup,
    NavbarHeading,
    Alignment,
    NavbarDivider,
    Button
} from "@blueprintjs/core";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/table/lib/css/table.css";
import "./index.css";

export const App = () => {
    return (
        <div>
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>Testing</NavbarHeading>
                    <NavbarDivider />
                    <Link to="/">
                        <Button
                            className="pt-minimal"
                            icon="home"
                            text="Home"
                        />
                    </Link>
                    <Link to="/somepage">
                        <Button className="pt-minimal" text="Somepage" />
                    </Link>
                    <Link to="/other">
                        <Button className="pt-minimal" text="Other" />
                    </Link>
                </NavbarGroup>
            </Navbar>
            {/* <Switch> */}
            {/* TODO: Switch breaks things :( */}
            <Route
                exact
                path="/"
                render={() => (
                    <LoaderWrapper
                        importer={() => import("./Home")}
                        render={({ Home }) => {
                            return <Home />;
                        }}
                    />
                )}
            />
            <Route
                path="/somepage"
                render={() => (
                    <LoaderWrapper
                        importer={() => import("./Somepage")}
                        render={({ Somepage }) => {
                            return <Somepage />;
                        }}
                    />
                )}
            />
            <Route
                path="/other"
                render={() => (
                    <LoaderWrapper
                        importer={() => import("./Other")}
                        render={({ Other }) => {
                            return <Other />;
                        }}
                    />
                )}
            />
            {/* </Switch> */}
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
