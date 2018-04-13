import * as React from "react";
import { Table, Cell, Column } from "@blueprintjs/table";

export const Home = () => {
    return (
        <div>
            Homey home!! <span className="pt-icon-standard pt-icon-more" />
            <Table numRows={10}>
                <Column
                    name="Dollars"
                    cellRenderer={(i: number) => (
                        <Cell>{`$${(i * 10).toFixed(2)}`}</Cell>
                    )}
                />
            </Table>
        </div>
    );
};

export const thing = "test";
