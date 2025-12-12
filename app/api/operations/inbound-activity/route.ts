import { queryDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const activity = await geInboundActivty();
    return NextResponse.json({
        activity: activity,
    });
}

export async function geInboundActivty() {
  const sql = `WITH ib AS 
    (SELECT 
    a.id, a.inbound_no, a.receipt_id, c.supplier_name, a.inbound_date, a.[status],
    SUM(b.quantity) AS quantity_req
    FROM inbound_headers a
    LEFT JOIN inbound_details b ON a.id = b.inbound_id
    LEFT JOIN suppliers c ON a.supplier_id = c.id
    WHERE a.[status] <> 'cancel' 
    GROUP BY a.id, a.inbound_no, a.receipt_id, c.supplier_name, a.inbound_date, a.[status]),
    ibc AS (
        SELECT inbound_id, SUM(quantity) AS quantity 
        FROM inbound_barcodes
        GROUP BY inbound_id
    ),
	ibs AS (
        SELECT inbound_id, SUM(quantity) AS quantity 
        FROM inbound_barcodes
		WHERE [status] = 'in stock'
        GROUP BY inbound_id
    )
    SELECT ib.*,
    ISNULL(ibc.quantity, 0) AS quantity_scan,
	  ISNULL(ibs.quantity, 0) AS quantity_rcvd
    FROM ib
    LEFT JOIN ibc ON ib.id = ibc.inbound_id
	LEFT JOIN ibs ON ib.id = ibs.inbound_id`;
  return queryDB(sql);
}