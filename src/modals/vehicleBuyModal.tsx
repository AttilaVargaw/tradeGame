import { FC, useCallback, useContext, useEffect, useState } from 'react';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import Card from 'react-bootstrap/esm/Card';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Modal from 'react-bootstrap/esm/Modal';
import Row from 'react-bootstrap/esm/Row';
import { VehicleType } from 'Services/GameState/dbTypes';
import { GameStateContext } from 'Services/GameState/gameState';
import { SelectedTradeRouteContext } from '../screens/worldMap/selectedTradeRouteContext';
import { run as holderRun } from 'holderjs'
import Button from 'react-bootstrap/esm/Button';
import CardGroup from 'react-bootstrap/esm/CardGroup';
import Nav from 'react-bootstrap/esm/Nav';
import { Figure } from 'react-bootstrap';

export const BuyItem: FC<VehicleType & { onClick: () => void }> = ({ ID, desc, name, price, onClick }) => {
    return <Col className="mb-4">
        <Card className='h-100'>
            <Card.Img variant='top' src={`holder.js/40x40?auto=yes`} />
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle>{price.toFixed(2)} ℳ</Card.Subtitle>
                <Card.Text>{desc}</Card.Text>
            </Card.Body>
            <Card.Footer className='d-grid gap-2'>
                <Button onClick={onClick} variant="primary">Order</Button>
            </Card.Footer>
        </Card>
    </Col>
}

export const OrderPage: FC<{ ID: string }> = ({ ID }) => {
    const gameState = useContext(GameStateContext)

    const [vehicleDescription, setVehicleDescription] = useState<VehicleType>()

    useEffect(() => {
        gameState.getVehicleType(ID).then((result) => setVehicleDescription(result[0]))
    }, [])
    useEffect(() => {
        holderRun()
    })

    if (!vehicleDescription) {
        return <></>
    }


    const { desc, name, price, type } = vehicleDescription

    return <Row className="no-gutters">
        <Col>
            <Card.Img src={`holder.js/40x40?auto=yes`} />
        </Col>
        <Col>
            <Card className='h-100'>
                <Card.Body as={Col}>
                    <Card.Title>{name}</Card.Title>
                    <Card.Subtitle>{price.toFixed(2)} ℳ</Card.Subtitle>
                    <Card.Text>{desc}</Card.Text>
                </Card.Body>
                <Card.Footer className='d-grid gap-2'>
                    <Button variant="primary">Order</Button>
                </Card.Footer>
            </Card>
        </Col>
    </Row>
}

export const VehicleBuyModal = ({ isOpen, onRequestClose }: { isOpen: boolean, onRequestClose?: () => void }) => {
    const gameState = useContext(GameStateContext)

    const [vehicleDescriptions, setVehicleDescriptions] = useState<VehicleType[]>([])
    const [selectedVehicleType, setSelectedVehicleType] = useState('air')
    const [currentVehicle, setCurrentVehicle] = useState('')

    useEffect(() => {
        gameState.getVehicleTypes(selectedVehicleType).then(setVehicleDescriptions)
    }, [selectedVehicleType])

    useEffect(() => {
        holderRun()
    })

    const setVehicleType = useCallback((type: string) => () => {
        setSelectedVehicleType(type)
    }, [])

    const onOrderClick = useCallback((ID: string) => () => {
        setCurrentVehicle(ID)
    }, [])

    return <Modal
        show={isOpen}
        onHide={onRequestClose}
        size="xl"
    >
        <Modal.Header closeButton>
            {currentVehicle !== '' && <Button size='lg' variant='light' onClick={() => setCurrentVehicle('')}>&lt;</Button>}
            <Modal.Title>
                Order a new vehicle
            </Modal.Title>
        </Modal.Header>
        {currentVehicle === '' && <Modal.Body style={{ height: '80vh' }} className="overflow-auto">
            <Card>
                <Card.Header>
                    <Nav variant="tabs" defaultActiveKey="#air">
                        <Nav.Item>
                            <Nav.Link onClick={setVehicleType('air')} href="#air">Air vehicles</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={setVehicleType('wheeled')} href="#wheeled">Wheeled vehicles</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={setVehicleType('tracked')} href="#tracked">Tracked vehicles</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Card.Header>
                <Card.Body>
                    <CardGroup className='row row-cols-1 row-cols-md-4'>
                        {vehicleDescriptions.map(({ ID, name, desc, price, type }) =>
                            <BuyItem onClick={onOrderClick(ID)} type={type} key={ID} desc={desc} price={price} ID={ID} name={name} />)}
                    </CardGroup>
                </Card.Body>
            </Card>
        </Modal.Body>}
        {
            currentVehicle !== '' && <Modal.Body style={{ height: '80vh' }} className="overflow-auto">
                <OrderPage ID={currentVehicle} />
            </Modal.Body>
        }
    </Modal>
}
