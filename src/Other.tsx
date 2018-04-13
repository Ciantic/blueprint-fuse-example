import * as React from "react";
import { Table, Cell, Column } from "@blueprintjs/table";

export const Other = () => {
    return (
        <div>
            Other <span className="pt-icon-standard pt-icon-more" />
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
