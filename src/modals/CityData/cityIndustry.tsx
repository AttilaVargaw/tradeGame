import { useCallback, useContext, useState } from "react";
import { styled } from "styled-components";

import { Button } from "@Components/button";
import { Row } from "@Components/grid";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { useDBValue } from "@Components/hooks/useDBValue";
import { Input, Select } from "@Components/input";
import { Label } from "@Components/label";
import { Toggle } from "@Components/toggle";
import { ID } from "@Services/GameState/dbTypes";
import {
  addIndustrialBuildings,
  getAllIndustrialBuildings,
  getCityIndustrialBuildings,
  getCityIndustrialResourceChanges,
  setIndustrialBuildingNumber,
} from "@Services/GameState/tables/City/cityQueries";

import { WarehouseRow } from "../../components/WarehouseRow";
import debugModeContext from "../../debugModeContext";

const Container = styled.div<{ $aggeratedView: boolean }>`
  display: grid;
  grid-auto-columns: 1fr;
  grid-template-columns: ${({ $aggeratedView }) =>
    $aggeratedView ? "repeat(3, 1fr)" : "repeat(4, 1fr)"};
  gap: 0.5em;
`;

export default function CityIndustry() {
  const [cityID] = useCurrentSelectedCity();

  const debugMode = useContext(debugModeContext);

  const [newBuilding, setNewBuilding] = useState<string>("");

  const [reload, setReload] = useState(false);

  const aggregatedInputOutput = useDBValue(
    useCallback(
      () => getCityIndustrialResourceChanges(cityID?.ID),
      [cityID?.ID]
    )
  );

  const allIndustrialBuildings = useDBValue(
    useCallback(getAllIndustrialBuildings, [])
  );

  // needs city change event in the future
  const industrialBuildings = useDBValue(
    useCallback(() => getCityIndustrialBuildings(cityID?.ID), [cityID?.ID])
  );

  const setNewBuildingDropdown = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
      setNewBuilding(value);
    },
    []
  );

  const addNewBuilding = useCallback(async () => {
    if (cityID) {
      await addIndustrialBuildings(1, newBuilding, cityID.ID);
      setReload(!reload);
    }
  }, [newBuilding, cityID, reload]);

  const setBuildingNumber = useCallback(
    (ID: ID) =>
      async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        await setIndustrialBuildingNumber(ID, Number.parseInt(value));
        setReload(!reload);
      },
    [reload]
  );

  const [aggeratedView, setAggeratedView] = useState(false);

  return (
    <Container $aggeratedView={aggeratedView}>
      <Toggle active={aggeratedView} onChange={setAggeratedView}>
        Aggregated
      </Toggle>
      {!aggeratedView && <Label type="painted">Level</Label>}
      <Label type="painted">Daily requirements</Label>
      <Label type="painted">Daily production</Label>
      {!aggeratedView &&
        industrialBuildings?.map(
          ({ nameKey, buildingNum, inputOutputData, ID }) => (
            <>
              <Label type="painted">{nameKey}</Label>
              {
                <div>
                  {debugMode ? (
                    <Input
                      min={0}
                      type="number"
                      value={buildingNum}
                      onChange={setBuildingNumber(ID)}
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <Label type="led">{buildingNum}</Label>
                  )}
                </div>
              }
              {inputOutputData.length > 0 && (
                <div>
                  {inputOutputData
                    .filter(({ num }) => num < 0)
                    .map(({ nameKey, num, ID }) => (
                      <WarehouseRow key={ID} label={nameKey} number={num} />
                    ))}
                </div>
              )}
              {inputOutputData.length > 0 && (
                <div>
                  {inputOutputData
                    .filter(({ num }) => num > 0)
                    .map(({ nameKey, num, ID }) => (
                      <WarehouseRow key={ID} label={nameKey} number={num} />
                    ))}
                </div>
              )}
            </>
          )
        )}

      {!aggeratedView && debugMode && (
        <Row>
          <div>
            <Select onChange={setNewBuildingDropdown}>
              {allIndustrialBuildings?.map(({ ID, nameKey }) => (
                <option key={ID} value={ID}>
                  {nameKey}
                </option>
              ))}
            </Select>
          </div>
          <Button style={{ alignSelf: "center" }} onClick={addNewBuilding}>
            Add
          </Button>
        </Row>
      )}

      {aggeratedView &&
        aggregatedInputOutput?.map(({ num, nameKey, ID }) => (
          <div key={ID}>
            <Label type="painted">{nameKey}</Label>
            {num < 0 ? (
              <>
                <Label type="painted">{num}</Label>
                <div />
              </>
            ) : (
              <>
                <div />
                <Label type="painted">{num}</Label>
              </>
            )}
          </div>
        ))}
    </Container>
  );
}
