import { isUndefined } from "lodash-es";
import { PropsWithChildren, useCallback, useState } from "react";
import styled from "styled-components";

import { LoadingBar } from "@Components/LoadingBar";
import { Grid, Row } from "@Components/grid";
import { Label } from "@Components/label";
import { Link, Screen } from "@Components/terminalScreen";
import { TogglePager } from "@Components/togglePager";
import { useCurrentConvoy } from "@Hooks/useCurrentConvoy";
import { useCurrentShippingPlan } from "@Hooks/useCurrentShippingPlan";
import { useDBValue } from "@Hooks/useDBValue";
import { categorySelectorElements } from "@Modals/CityData/Vehicle/categorySelectorElements";
import { DBEvents } from "@Services/GameState/dbTypes";
import { getConvoy } from "@Services/GameState/tables/Convoy/convoyQueries";
import ShippingPlan from "@Services/GameState/tables/ShippingPlan/ShippingPlan";
import {
  getShippingPlanItems,
  getShippingPlanRoutes,
  getShippingPlans,
} from "@Services/GameState/tables/ShippingPlan/ShippingPlanQueries";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import Modal from "../../Modal";
import { PlannerTransferItem } from "../PlannerTransferItem";

const Container = styled(Grid)`
  margin-top: 1em;
`;

function InventoryLoadingBar({
  weight,
  capacity,
}: {
  weight?: number;
  capacity?: number;
}) {
  return isUndefined(weight) || isUndefined(capacity) ? (
    false
  ) : (
    <div style={{ flex: 1, marginTop: "1em" }}>
      <LoadingBar
        percent={
          (isUndefined(capacity) || isUndefined(weight)
            ? 0
            : weight / capacity) * 100
        }
      />
    </div>
  );
}

export type MoveFunction = (
  inventoryAID: ID,
  inventoryBID: ID,
  amount: number,
  item: ID
) => Promise<void>;

const updateEvents = [DBEvents.shippingPlanUpdate];

export function ShippingTransferPlanner({
  aWeight,
  bWeight,
  aCapacity,
  children,
  bCapacity,
}: PropsWithChildren<{
  aWeight?: number;
  bWeight?: number;
  aCapacity?: number;
  bCapacity?: number;
}>) {
  const [inCategory, setInCategory] = useState<number>(0);

  const [currentConvoy] = useCurrentConvoy();

  const [currentCity, setCurrentCity] = useState<number>();
  const [currentTradeRoute, setCurrentTradeRoute] = useState<number>();

  const [currentTroudeStart, setCurrentTroudeStart] = useState<boolean>(true);

  const convoy = useDBValue(() => getConvoy(currentConvoy), updateEvents);

  const plans = useDBValue(
    () => getShippingPlans(convoy?.shippingPlan),
    updateEvents
  );

  const plansRoutes = useDBValue(
    () => getShippingPlanRoutes(convoy?.shippingPlan),
    updateEvents
  );

  const inventory = useDBValue(
    () =>
      getShippingPlanItems(convoy?.shippingPlan ?? null, currentTroudeStart),
    updateEvents
  );


  const items =
    plans && inventory && inventory.has(inCategory)
      ? plans[0] &&
        inventory
          .get(inCategory)!
          .map(({ translation, ID, number, start }) => (
            <PlannerTransferItem
              plan={plans[0].ID}
              item={ID}
              label={translation}
              key={ID}
              number={number}
              start={currentTroudeStart}
            />
          ))
      : false;

  const handleCurrentCity =
    (city: number, tradeRoute: number, start: boolean) => () => {
      setCurrentCity(city);
      setCurrentTradeRoute(tradeRoute);
      setCurrentTroudeStart(start);
    };

  const body = (
    <>
      {children}
      <Grid $num={2}>
        <Label type="painted">Start</Label>
        <Label type="painted">End</Label>
        {plansRoutes?.map(({ ID, cityAName, cityBName, CityA, CityB }) => (
          <>
            <Screen>
              <Link onClick={handleCurrentCity(CityA, ID, true)}>
                {cityAName} {currentCity === CityA && "[X]"}
              </Link>
            </Screen>
            <Screen>
              <Link onClick={handleCurrentCity(CityB, ID, false)}>
                {cityBName} {currentCity === CityB && "[X]"}
              </Link>
            </Screen>
          </>
        ))}
      </Grid>
      <TogglePager
        selected={inCategory}
        onChange={setInCategory}
        values={categorySelectorElements}
      />
      {items && (
        <Row style={{ gap: "1em" }}>
          <InventoryLoadingBar capacity={aCapacity} weight={aWeight} />
          <Container $num={2}>{items}</Container>
          <InventoryLoadingBar capacity={bCapacity} weight={bWeight} />
        </Row>
      )}
    </>
  );

  const footer = <></>;

  const header = (
    <>
      <Label type="painted">{plans?.[0]?.name ?? ""}</Label>
    </>
  );

  return <Modal body={body} footer={footer} header={header} />;
}
