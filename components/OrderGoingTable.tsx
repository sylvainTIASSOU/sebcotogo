"use client";

import React, {useState, useEffect} from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import {Api} from "@/api/Api";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";

interface DataType {
    key: string;
    date: string;
    price: string;
    status: string;
    city: string;
    deliveryDate: string;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Prix',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Ville',
        key: 'city',
        dataIndex: 'city',
    },
    {
        title: 'Date de livraison',
        key: 'deliveryDate',
        dataIndex: 'deliveryDate',

    },
];


const OrderGoingTable = ({data} : {data: any[] }) => {
    const [orders, setOrders] = useState<DataType[]>([]);
    const uid = useSelector((state: RootState) => state.auth.value.uid);


    useEffect(() => {
        const newData: DataType[] = [];
        data.forEach((ele: any) => {

                newData.push({
                    city: ele.delivery.city,
                    date: ele.createdAt.slice(0, 10),
                    deliveryDate: ele.delivery.deliveryDate,
                    key: ele.id,
                    price: ele.totalPrice,
                    status: ele.status
                })


        })
        setOrders(newData)

    }, []);

    return <Table columns={columns} dataSource={orders} />;
}



export default OrderGoingTable;