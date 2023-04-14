import { ChangeEvent, ChangeEventHandler, useCallback, useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { Item, WarehouseItem } from "Services/GameState/dbTypes";
import { GameStateContext} from "Services/GameState/gameState";
import debugModeContext from "../debugModeContext";
import { SelectedCityContext } from "../screens/worldMap/selectedCityContext";

export default () => {
    const debugMode = useContext(debugModeContext)
    const { updateCityWarehouseItem, getNotAvailableItems, getCityWarehouse, addCityWarehouseItem } = useContext(GameStateContext)

    const cityID = useContext(SelectedCityContext)!

    const [add, setAdd] = useState(false)
    const [items, setItems] = useState<Item[]>([])
    const [newItem, setNewItem] = useState<{ ID: string, number: number }>({ ID: '', number: 0 })
    const [warehouse, setWarehouse] = useState<WarehouseItem[]>([])

    useEffect(() => {
        getNotAvailableItems(cityID).then((items) => {
            setItems(items)
            setNewItem({ ID: items.length > 0 ? items[0].ID : '', number: 0 })
        })
        getCityWarehouse(cityID).then(setWarehouse)
    }, [cityID])

    const addItem = useCallback(async () => {
        await addCityWarehouseItem(newItem.ID, newItem.number, cityID);

        await Promise.all([
            await getNotAvailableItems(cityID),
            await getCityWarehouse(cityID),
        ]).then(([notAmiableItems, cityWarehouse]) => {
            setItems(notAmiableItems)
            setWarehouse(cityWarehouse)
            setNewItem({ ID: notAmiableItems.length > 0 ? notAmiableItems[0].ID : '', number: 0 })
        })

        setAdd(false)
    }, [newItem])

    const setNewItemNumber = useCallback(({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
        setNewItem((old) => ({ ...old, number: Number.parseFloat(value) }))
    }, [])

    const selectNewItem = useCallback<ChangeEventHandler<HTMLSelectElement>>(({ currentTarget: { value: ID } }) => {
        setNewItem((old) => ({ ...old, ID }))
    }, [])

    const updateItemNumber = useCallback((ID: string) => async ({ currentTarget: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        await updateCityWarehouseItem(Number(value), ID)
        await getCityWarehouse(cityID).then(setWarehouse)
    }, [])

    return <Container>
        <Row>
            <h2>Warehouse</h2>
        </Row>
        {
            warehouse.map(({ number, ID, nameKey }) =>
                debugMode ? <Form.Group key={ID} as={Row} style={{ paddingTop: '.5em', paddingBottom: '.5em' }}>
                    <Form.Label sm="4" column>{nameKey}</Form.Label>
                    <Col sm="8">
                        <Form.Control min={0} value={number} type={"number"} onChange={updateItemNumber(ID)} />
                    </Col>
                </Form.Group> : <Row>
                    <h3>{nameKey}</h3> <p>{number}</p>
                </Row>
            )
        }
        {
            debugMode && add && items.length !== 0 &&
            <Form.Group as={Row}>
                <Col sm="4">
                    <Form.Select onChange={selectNewItem}>
                        {items.map(({ ID, nameKey }) => <option key={ID} value={ID} >{nameKey}</option>)}
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Control value={newItem.number} type="number" min={1} onChange={setNewItemNumber} />
                </Col>
                <Col sm="2">
                    <Button style={{width: '100%'}} disabled={newItem.ID.length === 0 || newItem.number === 0} onClick={addItem}>Add</Button>
                </Col>
            </Form.Group>
        }
        {
            debugMode && <div style={{ marginTop: '1em' }}>
                <Button disabled={items.length === 0 && add} style={{ width: '100%' }} onClick={() => setAdd(!add)}>{add ? 'close' : '+'}</Button>
            </div>
        }
    </Container >
}
