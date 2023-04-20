import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import Form from "react-bootstrap/esm/Form";
import { PopulationClass, PopulationData } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import debugModeContext from "../../debugModeContext";
import { Input, Select } from "@Components/input";
import { Button } from "@Components/button";
import { Label } from "@Components/label";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

export default function CityPopulation() {
  const [cityID] = useCurrentSelectedCity();

  const [notExistingClasses, setNotExistingClasses] = useState<
    PopulationClass[]
  >([]);
  const [newCityClass, setNewCityClass] = useState<{
    city?: number;
    populationClass?: number;
  }>({ city: undefined, populationClass: undefined });

  const [reload, setReload] = useState(false);
  const [classes, setClasses] = useState<PopulationData[]>([]);
  const [fullPopulation, setFullPopulation] = useState<number>(0);

  const gameState = useContext(GameStateContext);
  const debugMode = useContext(debugModeContext);

  useEffect(() => {
    if (cityID) {
      gameState.getNotExistingCityClasses(cityID).then((classes) => {
        setNotExistingClasses(classes);

        if (classes.length > 0) {
          setNewCityClass({ city: cityID, populationClass: classes[0].ID });
        }
      });

      gameState.getCity(cityID).then(({ classes, fullPopulation }) => {
        setClasses(classes);
        setFullPopulation(fullPopulation);
      });
    }
  }, [reload, cityID, gameState]);

  const setPopulation = useCallback(
    (ID: number) =>
      async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        await gameState.setPopulation(ID, Number.parseInt(value));
        setReload(!reload);
      },
    [gameState, reload]
  );

  const setNewClass = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
      setNewCityClass((old) => ({
        ...old,
        populationClass: Number.parseInt(value),
      }));
      setReload(!reload);
    },
    [reload]
  );

  const addNewClass = useCallback(async () => {
    const { city, populationClass } = newCityClass;
    if (city && populationClass) {
      await gameState.addCityClass(city, populationClass);
      setReload(!reload);
    }
  }, [gameState, newCityClass, reload]);

  const multiplyCeil = useMemo(
    () => (a: number, b: number) => Math.ceil(a * b),
    []
  );

  return (
    <Container style={{ margin: "16pt" }}>
      <Row>
        {classes.map(({ name, num, ID }) => (
          <Col key={ID}>
            <Row>
              <Label type="painted">{name}</Label>
            </Row>
            {debugMode ? (
              <Input
                min={0}
                type="number"
                value={num}
                onChange={setPopulation(ID)}
              />
            ) : (
              <p>{num || 0}</p>
            )}
          </Col>
        ))}
        <Col>
          <Label type="painted">Total population</Label>
          <Label type="led">{fullPopulation}</Label>
        </Col>
        {debugMode && notExistingClasses.length > 0 && (
          <Col>
            <Row>
              <Label type="painted">New class</Label>
            </Row>
            <Form.Group as={Row}>
              <Col>
                <Select onChange={setNewClass}>
                  {notExistingClasses.map(({ ID, name }) => (
                    <option key={ID} value={ID}>
                      {name}
                    </option>
                  ))}
                </Select>
              </Col>
              <Col>
                <Button onClick={addNewClass}>Add</Button>
              </Col>
            </Form.Group>
          </Col>
        )}
      </Row>
      <Row>
        <Label type="painted">Daily requirements</Label>
      </Row>
      <Row>
        {classes.map(({ dailyRequirement, name, ID, num: citizenNum }) => (
          <Col key={`class-${ID}`}>
            {" "}
            <Label type="painted">{name}</Label>
            {dailyRequirement.map(
              ({
                nameKey,
                dailyRequirementID,
                dailyRequirement,
                // descriptionKey,
              }) => (
                <Row key={`dailyRequirement-${dailyRequirementID}`}>
                  <Col>
                    <Label type="painted">{nameKey}</Label>
                  </Col>
                  <Col>
                    <Label type="led">
                      {multiplyCeil(dailyRequirement, citizenNum)}
                    </Label>
                  </Col>
                </Row>
              )
            )}
          </Col>
        ))}
      </Row>
    </Container>
  );
}
