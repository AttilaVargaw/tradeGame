import { getTradeRouteByID } from "@Services/GameState/queries/tradeRoute";
import {
  dockConvoyToCity,
  getConvoys,
  setConvoyGoal,
} from "@Services/GameState/tables/Convoy/convoyQueries";

export function ConvoyAI() {
  async function Udpate() {
    const convoys = await getConvoys();

    await Promise.all(
      convoys.map(
        async ({
          route,
          posX,
          posY,
          ID,
          goalX,
          goalY,
          dockedTo,
          isRouteActive,
        }) => {
          const tradeRoute = await getTradeRouteByID(route);

          if (isRouteActive && tradeRoute) {
            const {
              cityAPosX,
              cityAPosY,
              cityBPosX,
              cityBPosY,
              cityAID,
              cityBID,
            } = tradeRoute;

            if (cityAPosX === posX && cityAPosY === posY && dockedTo === null) {
              await dockConvoyToCity(ID, cityAID);
              setTimeout(async () => {
                await setConvoyGoal(ID, cityBPosX, cityBPosY);
                await dockConvoyToCity(ID, null);
              }, 1000);
            } else if (
              cityBPosX === posX &&
              cityBPosY === posY &&
              dockedTo === null
            ) {
              await dockConvoyToCity(ID, cityBID);
              setTimeout(async () => {
                await setConvoyGoal(ID, cityAPosX, cityAPosY);
                await dockConvoyToCity(ID, null);
              }, 1000);
            } else if (!goalX && !goalY) {
              await setConvoyGoal(ID, cityBPosX, cityBPosY);
              if (dockedTo === cityBID || dockedTo === cityBID) {
                await dockConvoyToCity(ID, null);
              }
            }
          }
        }
      )
    );
  }

  return {
    Udpate,
  };
}
