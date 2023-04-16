import { useCallback, useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { IndustrialBuilding, ResourceChange } from "Services/GameState/dbTypes";
import { GameStateContext } from "Services/GameState/gameState";
import debugModeContext from "../debugModeContext";
import { SelectedCityContext } from "../screens/worldMap/selectedCityContext";

export default function CityIndustry() {
  const cityID = useContext(SelectedCityContext)!;
  const debugMode = useContext(debugModeContext);

  const [newBuilding, setNewBuilding] = useState<string>("");
  const [industrialBuildings, setIndustrialBuildings] = useState<
    IndustrialBuilding[]
  >([]);
  const [allIndustrialBuildings, setAllIndustrialBuildings] = useState<
    IndustrialBuilding[]
  >([]);
  const [aggregatedInputOutput, setAggregatedInputOutput] = useState<
    ResourceChange[]
  >([]);
  const [reload, setReload] = useState(false);

  const gameState = useContext(GameStateContext);

  useEffect(() => {
    gameState
      .getCityIndustrialResourceChanges(cityID)
      .then(setAggregatedInputOutput);
    gameState.getAllIndustrialBuildings().then(setAllIndustrialBuildings);
    gameState.getCityIndustrialBuildings(cityID).then(setIndustrialBuildings);
  }, [reload, gameState, cityID]);

  const setNewBuildingDropdown = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
      setNewBuilding(value);
    },
    []
  );

  const addNewBuilding = useCallback(async () => {
    await gameState.addIndustrialBuildings(1, newBuilding, cityID);
    setReload(!reload);
  }, [newBuilding, cityID, gameState, reload]);

  const setBuildingNumber = useCallback(
    (ID: string) =>
      async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        await gameState.setIndustrialBuildingNumber(ID, Number.parseInt(value));
        setReload(!reload);
      },
    [reload, gameState]
  );

  return (
    <>
      {industrialBuildings.map(
        ({ nameKey, buildingNum, inputOutputData, ID }) => (
          <Container key={nameKey}>
            <Row key={nameKey}>
              <Col sm="10">
                <strong>{nameKey}</strong>
              </Col>
              {debugMode ? (
                <Col>
                  <Form.Control
                    style={{ paddingTop: ".5em", paddingBottom: ".5em" }}
                    min={0}
                    type="number"
                    value={buildingNum}
                    onChange={setBuildingNumber(ID)}
                  />
                </Col>
              ) : (
                <Col sm="2">{buildingNum}</Col>
              )}
            </Row>
            <Row>
              <Col>
                <Row>Daily requirements</Row>
                {inputOutputData
                  ?.filter(({ num }) => num < 0)
                  .map(({ nameKey, num }) => (
                    <Row key={nameKey}>
                      <Col sm="10">{nameKey}</Col>
                      <Col sm="2">{num}</Col>
                    </Row>
                  ))}
              </Col>
              <Col>
                <Row>Daily production</Row>
                {inputOutputData
                  ?.filter(({ num }) => num > 0)
                  .map(({ nameKey, num }) => (
                    <Row key={nameKey}>
                      <Col sm="10">{nameKey}</Col>
                      <Col sm="2">{num}</Col>
                    </Row>
                  ))}
              </Col>
            </Row>
          </Container>
        )
      )}
      {debugMode && (
        <Container>
          <Form.Group as={Row}>
            <Col sm="8">
              <Form.Select onChange={setNewBuildingDropdown}>
                {allIndustrialBuildings.map(({ ID, nameKey }) => (
                  <option key={ID} value={ID}>
                    {nameKey}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col sm="2">
              <Button style={{ width: "100%" }} onClick={addNewBuilding}>
                Add
              </Button>
            </Col>
          </Form.Group>
        </Container>
      )}
      <Row>
        <Col>
          <Row>
            <h2>Daily requirements</h2>
          </Row>
          {aggregatedInputOutput
            .filter(({ num }) => num < 0)
            .map(({ num, nameKey, ID }) => (
              <Row key={ID}>
                <Col>{nameKey}</Col>
                <Col>{num}</Col>
              </Row>
            ))}
        </Col>
        <Col>
          <Row>
            <h2>Daily output</h2>
          </Row>
          {aggregatedInputOutput
            .filter(({ num }) => num > 0)
            .map(({ num, nameKey, ID }) => (
              <Row key={ID}>
                <Col>{nameKey}</Col>
                <Col>{num}</Col>
              </Row>
            ))}
        </Col>
      </Row>
    </>
  );
}
