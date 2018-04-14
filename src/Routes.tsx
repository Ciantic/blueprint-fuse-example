import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    Route,
    BrowserRouter as Router,
    NavLink,
    Switch
} from "react-router-dom";
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
                    <NavLink
                        exact
                        to="/"
                        className="pt-button pt-minimal pt-icon-home"
                        activeClassName="pt-active"
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/somepage"
                        className="pt-button pt-minimal"
                        activeClassName="pt-active"
                    >
                        Somepage
                    </NavLink>
                    <NavLink
                        to="/other"
                        className="pt-button pt-minimal"
                        activeClassName="pt-active"
                    >
                        Other
                    </NavLink>
                </NavbarGroup>
            </Navbar>
            <Switch>
                <AsyncRoute
                    exact
                    path="/"
                    importer={() => import("./Home")}
                    render={({ Home }) => {
                        return <Home />;
                    }}
                />
                <AsyncRoute
                    path="/somepage"
                    importer={() => import("./Somepage")}
                    render={({ Somepage }) => {
                        return <Somepage />;
                    }}
                />
                <AsyncRoute
                    path="/other"
                    importer={() => import("./Other")}
                    render={({ Other }) => {
                        return <Other />;
                    }}
                />
            </Switch>
        </div>
    );
};

/**
 * ImportWrapper
 *
 * Wraps the asynchronous import
 */
export class ImportWrapper<T> extends React.Component<
    {
        importer: () => Promise<T>;
        render: (v: T) => React.ReactNode;
    },
    {
        content?: React.ReactNode;
    }
> {
    async componentDidMount() {
        this.setState({
            content: this.props.render(await this.props.importer())
        });
    }

    render() {
        if (this.state && this.state.content) {
            return this.state.content;
        }
        return <div>Loading still...</div>;
    }
}

/**
 * Asynchronous route, loaded on demand
 *
 * @see {ImportWrapper}
 */
export class AsyncRoute<T> extends React.Component<{
    path: string;
    importer: () => Promise<T>;
    render: (v: T) => React.ReactNode;
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean;

    // Required for <Switch /> support, see
    // https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Switch.js
    computedMatch?: any;
}> {
    render() {
        return (
            <Route
                computedMatch={this.props.computedMatch}
                path={this.props.path}
                exact={this.props.exact}
                strict={this.props.strict}
                sensitive={this.props.sensitive}
                render={() => (
                    <ImportWrapper
                        key={this.props.path}
                        importer={this.props.importer}
                        render={this.props.render}
                    />
                )}
            />
        );
    }
}
