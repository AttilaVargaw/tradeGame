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
} from "@Services/GameState/tables/City/cityQueries";

import { Button } from "@Components/button";
import { ID } from "@Services/GameState/dbTypes";
import { Label } from "@Components/label";
import { Select } from "@Components/input";
import { WarehouseRow } from "../../components/WarehouseRow";
import debugModeContext from "../../debugModeContext";
import styled from "styled-components";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";

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
      getNotExistingCityClasses(cityID.ID).then((classes) => {
        setNotExistingClasses(classes);

        if (classes.length > 0) {
          setNewCityClass({ city: cityID.ID, populationClass: classes[0].ID });
        }
      });

      getCity(cityID.ID).then(({ classes, fullPopulation }) => {
        setClasses(classes);
        setFullPopulation(fullPopulation);
      });
    }
  }, [reload, cityID]);

  const onSetPopulation = useCallback(
    (ID: ID, newValue: number) => {
      setPopulation(ID, newValue);
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
            <WarehouseRow
              key={ID}
              label={name}
              number={num}
              editable={debugMode}
              id={ID}
              onChange={onSetPopulation}
              direction="column"
            />
          ))}
          <WarehouseRow
            label="Total"
            number={fullPopulation}
            direction="column"
          />
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
                <WarehouseRow
                  label={translation}
                  number={multiplyCeil(dailyRequirement, citizenNum)}
                  id={dailyRequirementID}
                  key={dailyRequirementID}
                  direction="row"
                />
              )
            )}
          </div>
        ))}
      </Row>
    </Container>
  );
}
