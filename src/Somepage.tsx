import * as React from "react";
import { Table, Cell, Column } from "@blueprintjs/table";

export const Somepage = () => {
    return (
        <div>
            <Table numRows={10}>
                <Column
                    name="Some page"
                    cellRenderer={(i: number) => (
                        <Cell>{`$${(i * 10).toFixed(2)}`}</Cell>
                    )}
                />
            </Table>
        </div>
    );
};
