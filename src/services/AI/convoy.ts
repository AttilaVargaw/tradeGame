import {
  dockConvoyToCity,
  getConvoys,
  getTradeRoute,
  setConvoyGoal,
} from "@Services/GameState/gameState";

export function ConvoyAI() {
  async function Udpate() {
    const convoys = await getConvoys();

    await Promise.all(
      convoys.map(async ({ route, posX, posY, ID, goalX, goalY, dockedTo }) => {
        const tradeRoute = await getTradeRoute(route);

        if (route) {
          const [
            { cityAPosX, cityAPosY, cityBPosX, cityBPosY, cityAID, cityBID },
          ] = tradeRoute;

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
      })
    );
  }

  return {
    Udpate,
  };
}
