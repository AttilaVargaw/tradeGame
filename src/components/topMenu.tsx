import { FC, useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

export const TopMenu: FC = () => {
    const [time, setTime] = useState('')
    const [date, setDate] = useState('')

    useEffect(() => {
        const timeout = setInterval(() => {
            const time = new Date( new Date().setFullYear(1899, 1, 1) - new Date(2020).valueOf())
            setTime(time.toLocaleTimeString())
            setDate(time.toLocaleDateString())
        }, 1000);

        return () => clearInterval(timeout)
    }, [])

    return <Row style={{ color: 'black', padding: 'auto' }}>
        <Col>{5556.22} ℳ</Col>
        <Col>{date} {time}</Col>
    </Row>
}
