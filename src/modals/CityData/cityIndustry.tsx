import { useCallback, useContext, useEffect, useState } from "react";

import { IndustrialBuilding } from "@Services/GameState/dbTypes";

import debugModeContext from "../../debugModeContext";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { ResourceChange } from "@Services/GameState/tables/common";
import { Button } from "@Components/button";
import { Label } from "@Components/label";
import { Input, Select } from "@Components/input";
import { Td, Th, Tr } from "@Components/grid";
import { Toggle } from "@Components/toggle";
import { styled } from "styled-components";
import {
  addIndustrialBuildings,
  getAllIndustrialBuildings,
  getCityIndustrialBuildings,
  getCityIndustrialResourceChanges,
  setIndustrialBuildingNumber,
} from "@Services/GameState/gameState";
import { ID } from "@Services/GameState/dbTypes";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

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

  useEffect(() => {
    if (cityID) {
      getCityIndustrialResourceChanges(cityID).then(setAggregatedInputOutput);
      getAllIndustrialBuildings().then(setAllIndustrialBuildings);
      getCityIndustrialBuildings(cityID).then(setIndustrialBuildings);
    }
  }, [reload, cityID]);

  const setNewBuildingDropdown = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
      setNewBuilding(value);
    },
    []
  );

  const addNewBuilding = useCallback(async () => {
    if (cityID) {
      await addIndustrialBuildings(1, newBuilding, cityID);
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
    <Container>
      <Tr>
        <Th>
          <Toggle
            style={{ padding: "1em" }}
            active={aggeratedView}
            onChange={setAggeratedView}
          >
            Aggregated
          </Toggle>
        </Th>
        <Th>{!aggeratedView && <Label type="painted">Level</Label>}</Th>
        <Th>
          <Label type="painted">Daily requirements</Label>
        </Th>
        <Th>
          <Label type="painted">Daily production</Label>
        </Th>
      </Tr>
      {!aggeratedView &&
        industrialBuildings.map(
          ({ nameKey, buildingNum, inputOutputData, ID }) => (
            <Tr key={ID}>
              <Td>
                <Label type="painted">{nameKey}</Label>
              </Td>
              {
                <Td>
                  {debugMode ? (
                    <Input
                      style={{
                        paddingTop: ".5em",
                        paddingBottom: ".5em",
                        width: "80%",
                      }}
                      min={0}
                      type="number"
                      value={buildingNum}
                      onChange={setBuildingNumber(ID)}
                    />
                  ) : (
                    <Label type="led">{buildingNum}</Label>
                  )}
                </Td>
              }

              {inputOutputData.length > 0 && (
                <Td>
                  {inputOutputData
                    .filter(({ num }) => num < 0)
                    .map(({ nameKey, num, ID }) => (
                      <div key={ID}>
                        <Label type="painted">{nameKey}</Label>
                        <Label type="painted">{num}</Label>
                      </div>
                    ))}
                </Td>
              )}
              {inputOutputData.length > 0 && (
                <Td>
                  {inputOutputData
                    .filter(({ num }) => num > 0)
                    .map(({ nameKey, num, ID }) => (
                      <div key={ID}>
                        <Label type="painted">{nameKey}</Label>
                        <Label type="painted">{num}</Label>
                      </div>
                    ))}
                </Td>
              )}
            </Tr>
          )
        )}

      {!aggeratedView && debugMode && (
        <Tr>
          <Td>
            <Select onChange={setNewBuildingDropdown}>
              {allIndustrialBuildings.map(({ ID, nameKey }) => (
                <option key={ID} value={ID}>
                  {nameKey}
                </option>
              ))}
            </Select>
          </Td>
          <Td>
            <Button onClick={addNewBuilding}>Add</Button>
          </Td>
        </Tr>
      )}

      {aggeratedView &&
        aggregatedInputOutput
          .filter(({ num }) => num < 0)
          .map(({ num, nameKey, ID }) => (
            <Tr key={ID}>
              <Td>
                <Label type="painted">{nameKey}</Label>
                <Label type="painted">{num}</Label>
              </Td>
            </Tr>
          ))}

      {aggeratedView &&
        aggregatedInputOutput
          .filter(({ num }) => num > 0)
          .map(({ num, nameKey, ID }) => (
            <Tr key={ID}>
              <Td />
              <Td>
                <Label type="painted">{nameKey}</Label>
                <Label type="painted">{num}</Label>
              </Td>
            </Tr>
          ))}
    </Container>
  );
}
