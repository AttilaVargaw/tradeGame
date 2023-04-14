import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Row from "react-bootstrap/esm/Row";
import Tooltip from "react-bootstrap/esm/Tooltip";
import { PopulationClass, PopulationData } from "Services/GameState/dbTypes";
import { GameStateContext } from "Services/GameState/gameState";
import debugModeContext from "../debugModeContext";
import { SelectedCityContext } from "../screens/worldMap/selectedCityContext";

export default () => {
    const [notExistingClasses, setNotExistingClasses] = useState<PopulationClass[]>([])
    const [newCityClass, setNewCityClass] = useState<{ city: string, populationClass: string }>({ city: '', populationClass: '' })
    const [reload, setReload] = useState(false)
    const [classes, setClasses] = useState<PopulationData[]>([])
    const [fullPopulation, setFullPopulation] = useState<number>(0)

    const cityID = useContext(SelectedCityContext)!
    const gameState = useContext(GameStateContext)
    const debugMode = useContext(debugModeContext)

    useEffect(() => {
        gameState.getNotExistingCityClasses(cityID).then((classes) => {
            setNotExistingClasses(classes)

            if (classes.length > 0) {
                setNewCityClass({ city: cityID, populationClass: classes[0].ID })
            }
        })

        gameState.getCity(cityID).then(({ classes, fullPopulation }) => {
            setClasses(classes)
            setFullPopulation(fullPopulation)
        })
    }, [reload])

    const setPopulation = useCallback((ID: string) => async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        await gameState.setPopulation(ID, Number.parseInt(value))
        setReload(!reload)
    }, [classes])

    const setNewClass = useCallback(({ target: { value: populationClass } }: React.ChangeEvent<HTMLSelectElement>) => {
        setNewCityClass((old) => ({ ...old, populationClass }))
        setReload(!reload)
    }, [classes])

    const addNewClass = useCallback(async () => {
        await gameState.addCityClass(newCityClass.city, newCityClass.populationClass)
        setReload(!reload)
    }, [classes])

    const multiplyCeil = useMemo(() => (a: number, b: number) => Math.ceil(a * b), [classes])

    return <Container style={{ margin: '16pt' }}>
        <Row>
            {
                classes.map(({ name, num, ID }) => <Col lg key={ID}>
                    <Row>
                        <h3>{name}</h3>
                    </Row>
                    {debugMode ?
                        <Form.Control style={{ paddingTop: '.5em', paddingBottom: '.5em' }} min={0} type="number" value={num} onChange={setPopulation(ID)} /> : <p>{num || 0}</p>}
                </Col>
                )
            }
            {debugMode && notExistingClasses.length > 0 && <Col lg>
                <Row>
                    <h3>New class</h3>
                </Row>
                <Form.Group as={Row}>
                    <Col sm="8">
                        <Form.Select onChange={setNewClass}>
                            {notExistingClasses.map(({ ID, name }) => <option key={ID} value={ID}>{name}</option>)}
                        </Form.Select>
                    </Col>
                    <Col sm="2">
                        <Button onClick={addNewClass}>Add</Button>
                    </Col>
                </Form.Group>
            </Col>}
        </Row>
        <Row>
            <Col lg>
                <strong>Total population is </strong> <span>{fullPopulation} people</span>
            </Col>
        </Row>
        <Row>
            <h2>Guild personnel</h2>
        </Row>
        <Row>
            <Col lg>
                <h3>Sailor</h3><p>{0}</p>
            </Col>
            <Col lg>
                <h3>Officer</h3><p>{0}</p>
            </Col>
            <Col lg>
                <h3>Engineer</h3><p>{0}</p>
            </Col>
            <Col lg>
                <h3>WO</h3><p>{0}</p>
            </Col>
            <Col lg>
                <h3>Researcher</h3><p>{0}</p>
            </Col>
            <Col lg>
                <h3>Guard</h3><p>{0}</p>
            </Col>
            <Col lg>
                <h3>NCO</h3><p>{0}</p>
            </Col>
            <Col lg>
                <h3>Cadet</h3><p>{0}</p>
            </Col>
        </Row>
        <Row>
            <h3>
                Daily requirements
            </h3>
        </Row>
        <Row>
            {
                classes.map(({ dailyRequirement, name, ID, num: citizenNum }) =>
                    <Col lg key={`class-${ID}`}> <h3>{name}</h3> {
                        dailyRequirement.map(({ nameKey, dailyRequirementID, dailyRequirement, descriptionKey }) =>
                            <Row key={`dailyRequirement-${dailyRequirementID}`}>
                                <Col>
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Tooltip!</Tooltip>}>
                                        <strong>{nameKey}</strong>
                                    </OverlayTrigger>
                                </Col>
                                <Col>
                                    <span>{multiplyCeil(dailyRequirement, citizenNum)}</span>
                                </Col>
                            </Row>)
                    }</Col>)
            }
        </Row>
    </Container>
}