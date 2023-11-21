import {
  ChangeEventHandler,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { PopulationClass, PopulationData } from "@Services/GameState/dbTypes";
import {
  addCityClass,
  getCity,
  getNotExistingCityClasses,
  setPopulation,
} from "@Services/GameState/gameState";
import debugModeContext from "../../debugModeContext";
import { Input, Select } from "@Components/input";
import { Button } from "@Components/button";
import { Label } from "@Components/label";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { ID } from "@Services/GameState/dbTypes";
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

  const debugMode = useContext(debugModeContext);

  useEffect(() => {
    if (cityID) {
      getNotExistingCityClasses(cityID).then((classes) => {
        setNotExistingClasses(classes);

        if (classes.length > 0) {
          setNewCityClass({ city: cityID, populationClass: classes[0].ID });
        }
      });

      getCity(cityID).then(({ classes, fullPopulation }) => {
        setClasses(classes);
        setFullPopulation(fullPopulation);
      });
    }
  }, [reload, cityID]);

  const onSetPopulation = useCallback(
    (ID: ID) =>
      async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        setPopulation(ID, Number.parseInt(value));
        setReload(!reload);
      },
    [reload]
  );

  const setNewClass = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    ({ target: { value } }) => {
      setNewCityClass((old) => ({
        ...old,
        populationClass: Number.parseInt(value),
      }));
      setReload(!reload);
    },
    [reload]
  );

  const addNewClass = useCallback(
    async function () {
      const { city, populationClass } = newCityClass;
      if (city && populationClass) {
        await addCityClass(city, populationClass);
        setReload(!reload);
      }
    },
    [newCityClass, reload]
  );

  const multiplyCeil = useMemo(
    () => (a: number, b: number) => Math.ceil(a * b),
    []
  );

  return (
    <Container>
      <div>
        <div
          style={{
            display: "grid",
            gridAutoColumns: "1fr",
            gridTemplateColumns: "repeat(5, 1fr)",
          }}
        >
          {classes.map(({ name, num, ID }) => (
            <div key={ID}>
              <Label type="painted">{name}</Label>
              {debugMode ? (
                <Input
                  min={0}
                  type="number"
                  value={num}
                  onChange={onSetPopulation(ID)}
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                <Label>{num || 0}</Label>
              )}
            </div>
          ))}
          <div>
            <Label type="painted">Total</Label>
            <Label type="led">{fullPopulation}</Label>
          </div>
        </div>
        {debugMode && notExistingClasses.length > 0 && (
          <div>
            <Row>
              <Label type="painted">New class</Label>
            </Row>
            <Row>
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
            </Row>
          </div>
        )}
      </div>
      <Label type="painted">Daily requirements</Label>
      <Row>
        {classes.map(({ dailyRequirement, name, ID, num: citizenNum }) => (
          <div key={ID}>
            <Label type="painted">{name}</Label>
            {dailyRequirement.map(
              ({ dailyRequirementID, dailyRequirement, translation }) => (
                <Row key={dailyRequirementID}>
                  <Label style={{ width: "50%" }} type="painted">
                    {translation}
                  </Label>
                  <Label style={{ width: "50%" }} type="led">
                    {multiplyCeil(dailyRequirement, citizenNum)}
                  </Label>
                </Row>
              )
            )}
          </div>
        ))}
      </Row>
    </Container>
  );
}
