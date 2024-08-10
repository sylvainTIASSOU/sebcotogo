import { Flex, Spin } from 'antd';
import { Suspense } from 'react';
export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <main className="flex h-screen justify-center content-center items-center">
            <Suspense>
                <Spin size="large" className="self-center"/>
            </Suspense>

        </main>
    )
}