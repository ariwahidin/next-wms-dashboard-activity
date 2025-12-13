"use client"

import { TopNav } from '@/components/navigation/top-nav';
import { PageWrapper } from '@/components/shared/page-wrapper';
import { Search, Package, Truck, AlertCircle, Filter } from 'lucide-react';
import { parse } from 'path';
import { useState, useEffect, use } from "react"

// Types
interface OutboundTransaction {
    inbound_no: string;
    receipt_id: string;
    inbound_date: string;
    supplier: string;
    outbound_date: string;
    outbound_no: string;
    shipment_id: string;
    customer: string;
    item_code: string;
    ean: string;
    serial_number: string;
    quantity: number;
    pic_scan: string;
    tanggal_scan: string;
    spk_number: string;
    delivery_date: string;
    driver: string;
    transporter_name: string;
    truck_size: string;
    truck_no: string;
    remarks_spk_dtl: string;
}

type FilterType = 'shipmentId' | 'customer' | 'itemCode' | 'ean' | 'serialNumber';

// Dummy Data
// const dummyData: OutboundTransaction[] = [
//     {
//         outboundNo: 'OUT-2024-001',
//         shipmentId: 'SHP-20241201-001',
//         customer: 'PT Maju Jaya',
//         itemCode: 'ITM-001',
//         ean: '8991002300019',
//         serialNumber: 'SN-2024-001-A',
//         quantity: 100,
//         picScan: 'Ahmad Ridwan',
//         tanggalScan: '2024-12-01 08:30:00',
//         spkNumber: 'SPK/2024/12/001'
//     },
//     {
//         outboundNo: 'OUT-2024-002',
//         shipmentId: 'SHP-20241201-001',
//         customer: 'PT Maju Jaya',
//         itemCode: 'ITM-002',
//         ean: '8991002300026',
//         serialNumber: 'SN-2024-001-B',
//         quantity: 50,
//         picScan: 'Ahmad Ridwan',
//         tanggalScan: '2024-12-01 08:45:00',
//         spkNumber: 'SPK/2024/12/001'
//     },
//     {
//         outboundNo: 'OUT-2024-003',
//         shipmentId: 'SHP-20241202-002',
//         customer: 'CV Sejahtera Abadi',
//         itemCode: 'ITM-003',
//         ean: '8991002300033',
//         serialNumber: 'SN-2024-002-A',
//         quantity: 75,
//         picScan: 'Budi Santoso',
//         tanggalScan: '2024-12-02 09:15:00',
//         spkNumber: 'SPK/2024/12/002'
//     },
//     {
//         outboundNo: 'OUT-2024-004',
//         shipmentId: 'SHP-20241203-003',
//         customer: 'PT Global Logistics',
//         itemCode: 'ITM-001',
//         ean: '8991002300019',
//         serialNumber: 'SN-2024-003-A',
//         quantity: 120,
//         picScan: 'Siti Nurhaliza',
//         tanggalScan: '2024-12-03 10:00:00',
//         spkNumber: 'SPK/2024/12/003'
//     },
//     {
//         outboundNo: 'OUT-2024-005',
//         shipmentId: 'SHP-20241203-003',
//         customer: 'PT Global Logistics',
//         itemCode: 'ITM-004',
//         ean: '8991002300040',
//         serialNumber: 'SN-2024-003-B',
//         quantity: 80,
//         picScan: 'Siti Nurhaliza',
//         tanggalScan: '2024-12-03 10:30:00',
//         spkNumber: 'SPK/2024/12/003'
//     }
// ];



export default function OutboundTransactionViewer() {
    const [filterType, setFilterType] = useState<FilterType>('shipmentId');
    const [keyword, setKeyword] = useState('');
    const [transactions, setTransactions] = useState<OutboundTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const filterOptions: { value: FilterType; label: string }[] = [
        { value: 'shipmentId', label: 'Shipment ID' },
        { value: 'customer', label: 'Customer' },
        { value: 'itemCode', label: 'Item Code' },
        { value: 'ean', label: 'EAN' },
        { value: 'serialNumber', label: 'Serial Number' }
    ];

    const handleSearch = async () => {
        if (!keyword.trim()) return;

        setIsLoading(true);
        setHasSearched(true);

        // Simulate API call
        // setTimeout(() => {
        //     const filtered = dummyData.filter(item => {
        //         const value = item[filterType].toLowerCase();
        //         return value.includes(keyword.toLowerCase());
        //     });

        //     setTransactions(filtered);
        //     setIsLoading(false);
        // }, 500);


        // Actual API call implementation:
        try {
            const response = await fetch(`/api/operations/outbound-history?filterType=${filterType}&keyword=${encodeURIComponent(keyword)}`);
            const data = await response.json();
            setTransactions(data.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        } finally {
            setIsLoading(false);
        }

    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };


    return (
        <>
            <TopNav />
            <PageWrapper title="Outbound Activity" description="">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    {/* <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Truck className="w-8 h-8 text-indigo-600" />
                            <h1 className="text-3xl font-bold text-gray-800">Outbound Transactions</h1>
                        </div>
                        <p className="text-gray-600">Monitor and track your outbound shipment transactions</p>
                    </div> */}

                    {/* Filter Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Truck className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Outbound History</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter By
                                </label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    {filterOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-7">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Keyword
                                </label>
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={`Enter ${filterOptions.find(f => f.value === filterType)?.label}...`}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div className="md:col-span-2 flex items-end">
                                <button
                                    onClick={handleSearch}
                                    disabled={!keyword.trim() || isLoading}
                                    className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    <Search className="w-4 h-4" />
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {!hasSearched ? (
                            <div className="p-12 text-center">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Search Performed</h3>
                                <p className="text-gray-500">Please select a filter and enter a keyword to view transactions</p>
                            </div>
                        ) : isLoading ? (
                            <div className="p-12 text-center">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
                                <p className="text-gray-600">Loading transactions...</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="p-12 text-center">
                                <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
                                <p className="text-gray-500">No transactions match your search criteria</p>
                            </div>
                        ) : (
                            <>
                                <div className="p-6 bg-indigo-50 border-b border-indigo-100">
                                    <p className="text-sm font-medium text-indigo-900">
                                        Found <span className="font-bold">{transactions.length}</span> transaction(s)
                                        for <span className="font-bold">{filterOptions.find(f => f.value === filterType)?.label}</span> <span className="font-bold">{keyword}</span>
                                        , Total item quantity: <span className="font-bold">{transactions.reduce(
                                            (total, t) => total + Number(t.quantity ?? 0),
                                            0
                                        )}</span>
                                    </p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Inbound No</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Receipt ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Inbound Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Supplier</th> */}

                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Outbound No</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Outbound Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Shipment ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item Code</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">EAN</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Serial Number</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Qty</th>
                                                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PIC Scan</th> */}
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tanggal Scan</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SPK Number</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delivery Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Driver</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Transporter Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Truck Size</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Truck No</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Remarks SPK Dtl</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {transactions.map((transaction, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors">

                                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.inbound_no}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.receipt_id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.inbound_date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.supplier}</td> */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.outbound_no}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.outbound_date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.shipment_id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.customer}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.item_code}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.ean}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.serial_number}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.quantity}</td>
                                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.pic_scan}</td> */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.tanggal_scan}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.spk_number}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.delivery_date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.driver}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.transporter_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.truck_size}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.truck_no}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.remarks_spk_dtl}</td>


                                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.shipmentId}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.customer}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.itemCode}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.ean}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.serialNumber}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.quantity}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.picScan}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.tanggalScan}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.spkNumber}</td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </PageWrapper>
        </>
    );
};
