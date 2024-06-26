// progress - https://ant.design/components/progress#components-progress-demo-circle
'use strict';

import React from "react";

import {Flex, Progress} from "antd";

interface Props {}

const TimeCounter: React.FC<Props> = (props: Props) => {
    return <>
        <Flex gap="small" wrap>
            <Progress type="circle" percent={75} />
            <Progress type="circle" percent={70} status="exception" />
            <Progress type="circle" percent={100} />
        </Flex>
    </>;
};

export default TimeCounter;
