import { queryDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const activity = await getSummaryActivity();
    const stock = await getStockInventory();
    const outbound = await getOutboundTransactionByDate();
    return NextResponse.json({
        activity: activity,
        stock: stock,
        outbound: outbound
    });
}

export async function getSummaryActivity() {
  const sql = `WITH ib AS (
			SELECT ih.id, ih.inbound_no AS no_ref,ih.receipt_id AS reference_no, ih.status, ih.inbound_date AS trans_date, id.tot_item, id.tot_qty
			FROM inbound_headers ih
			INNER JOIN (
				SELECT inbound_id, COUNT(item_code) AS tot_item, SUM(quantity) AS tot_qty FROM inbound_details GROUP BY inbound_id
			) id ON ih.id = id.inbound_id
			WHERE ih.status NOT IN ('complete', 'cancel')
		), ob AS (
			SELECT oh.id, oh.outbound_no AS no_ref, oh.shipment_id AS reference_no, oh.status, oh.outbound_date AS trans_date, od.tot_item, od.tot_qty
			FROM outbound_headers oh
			INNER JOIN (
				SELECT outbound_id, COUNT(item_code) AS tot_item, SUM(quantity) AS tot_qty FROM outbound_details GROUP BY outbound_id
			) od ON oh.id = od.outbound_id
			WHERE oh.status NOT IN ('complete', 'cancel')
		)

		SELECT *, 'inbound' AS trans_type FROM ib
		UNION ALL
		SELECT *, 'outbound' AS trans_type FROM ob ORDER BY trans_type, no_ref DESC`;
  return queryDB(sql);
}
export async function getStockInventory() {
  const sql = `select a.barcode, 
	a.owner_code, b.category,
	b.item_code, b.item_name, a.qa_status,
	sum(a.qty_origin) as qty_in,
	sum(a.qty_onhand) as qty_onhand,
	sum(a.qty_available) as qty_available,
	sum(a.qty_allocated) as qty_allocated,
	sum(a.qty_shipped) as qty_out,
	b.cbm as cbm_pcs,
	b.cbm * sum(a.qty_available) as cbm_total
	from inventories a
	inner join products b on a.item_id = b.id
	where a.qty_origin > 0
	group by b.item_code, b.item_name, a.qa_status,
	a.barcode, a.owner_code, b.category, b.cbm`;
  return queryDB(sql);
}
export async function getOutboundTransactionByDate() {
  const sql = `SELECT a.outbound_date, 
    SUM(b.quantity) as quantity
    FROM outbound_headers a
    LEFT JOIN outbound_details b on a.id = b.outbound_id
    WHERE a.[status] <> 'cancel' 
    GROUP BY a.outbound_date
    ORDER BY a.outbound_date ASC`;
  return queryDB(sql);
}