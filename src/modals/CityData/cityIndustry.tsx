import { useCallback, useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import { IndustrialBuilding } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import debugModeContext from "../../debugModeContext";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { ResourceChange } from "@Services/GameState/tables/common";
import { Button } from "@Components/button";
import { Label } from "@Components/label";
import { Input, Select } from "@Components/input";

export default function CityIndustry() {
  const [cityID] = useCurrentSelectedCity();

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
    if (cityID) {
      gameState
        .getCityIndustrialResourceChanges(cityID)
        .then(setAggregatedInputOutput);
      gameState.getAllIndustrialBuildings().then(setAllIndustrialBuildings);
      gameState.getCityIndustrialBuildings(cityID).then(setIndustrialBuildings);
    }
  }, [reload, gameState, cityID]);

  const setNewBuildingDropdown = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
      setNewBuilding(value);
    },
    []
  );

  const addNewBuilding = useCallback(async () => {
    if (cityID) {
      await gameState.addIndustrialBuildings(1, newBuilding, cityID);
      setReload(!reload);
    }
  }, [newBuilding, cityID, gameState, reload]);

  const setBuildingNumber = useCallback(
    (ID: number) =>
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
            <div key={nameKey}>
              <Col sm="10">
                <Label type="painted">{nameKey}</Label>
              </Col>
              {debugMode ? (
                <Col>
                  <Input
                    style={{ paddingTop: ".5em", paddingBottom: ".5em" }}
                    min={0}
                    type="number"
                    value={buildingNum}
                    onChange={setBuildingNumber(ID)}
                  />
                </Col>
              ) : (
                <Label type="led">{buildingNum}</Label>
              )}
            </div>
            <div>
              <Col>
                <Label type="painted">Daily requirements</Label>
                {inputOutputData
                  ?.filter(({ num }) => num < 0)
                  .map(({ nameKey, num }) => (
                    <div key={nameKey}>
                      <Label type="painted">{nameKey}</Label>
                      <Label type="painted">{num}</Label>
                    </div>
                  ))}
              </Col>
              <Col>
                <Label type="painted">Daily production</Label>
                {inputOutputData
                  ?.filter(({ num }) => num > 0)
                  .map(({ nameKey, num }) => (
                    <div key={nameKey}>
                      <Col sm="10">{nameKey}</Col>
                      <Col sm="2">{num}</Col>
                    </div>
                  ))}
              </Col>
            </div>
          </Container>
        )
      )}
      {debugMode && (
        <Container>
          <Col sm="8">
            <Select onChange={setNewBuildingDropdown}>
              {allIndustrialBuildings.map(({ ID, nameKey }) => (
                <option key={ID} value={ID}>
                  {nameKey}
                </option>
              ))}
            </Select>
          </Col>
          <Col sm="2">
            <Button onClick={addNewBuilding}>Add</Button>
          </Col>
        </Container>
      )}
      <div>
        <Col>
          <Label type="painted">Daily requirements</Label>
          {aggregatedInputOutput
            .filter(({ num }) => num < 0)
            .map(({ num, nameKey, ID }) => (
              <div key={ID}>
                <Label type="painted">{nameKey}</Label>
                <Label type="painted">{num}</Label>
              </div>
            ))}
        </Col>
        <Col>
          <Label type="painted">Daily output</Label>
          {aggregatedInputOutput
            .filter(({ num }) => num > 0)
            .map(({ num, nameKey, ID }) => (
              <div key={ID}>
                <Label type="painted">{nameKey}</Label>
                <Label type="painted">{num}</Label>
              </div>
            ))}
        </Col>
      </div>
    </>
  );
}
