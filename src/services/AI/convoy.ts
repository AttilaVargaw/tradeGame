import { GameState } from "@Services/GameState/gameState";

export function ConvoyAI() {
  async function Udpate() {
    const convoys = await GameState.getConvoys();

    await Promise.all(
      convoys.map(async ({ route, posX, posY, ID, goalX, goalY, dockedTo }) => {
        const tradeRoute = await GameState.getTradeRoute(route);

        if (route) {
          const [
            { cityAPosX, cityAPosY, cityBPosX, cityBPosY, cityAID, cityBID },
          ] = tradeRoute;

          if (cityAPosX === posX && cityAPosY === posY && dockedTo === null) {
            await GameState.dockConvoyToCity(ID, cityAID);
            setTimeout(async () => {
              await GameState.setConvoyGoal(ID, cityBPosX, cityBPosY);
              await GameState.dockConvoyToCity(ID, null);
            }, 1000);
          } else if (cityBPosX === posX && cityBPosY === posY && dockedTo === null) {
            await GameState.dockConvoyToCity(ID, cityBID);
            setTimeout(async () => {
              await GameState.setConvoyGoal(ID, cityAPosX, cityAPosY);
              await GameState.dockConvoyToCity(ID, null);
            }, 1000);
          } else if (!goalX && !goalY) {
            await GameState.setConvoyGoal(ID, cityBPosX, cityBPosY);
            if (dockedTo === cityBID || dockedTo === cityBID) {
              await GameState.dockConvoyToCity(ID, null);
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
