import { GameState } from "@Services/GameState/gameState";

export function ConvoyAI() {
  async function Udpate() {
    const convoys = await GameState.getConvoys();

    await Promise.all(
      convoys.map(async ({ route, posX, posY, ID, goalX, goalY }) => {
        const tradeRoute = await GameState.getTradeRoute(route);

        if (route) {
          const [{ cityAPosX, cityAPosY, cityBPosX, cityBPosY }] = tradeRoute;
          if (cityAPosX === posX && cityAPosY === posY) {
            await GameState.setConvoyGoal(ID, cityBPosX, cityBPosY);
          } else if (cityBPosX === posX && cityBPosY === posY) {
            await GameState.setConvoyGoal(ID, cityAPosX, cityAPosY);
          } else if (!goalX && !goalY) {
            await GameState.setConvoyGoal(ID, cityBPosX, cityBPosY);
          }
        }
      })
    );
  }

  return {
    Udpate,
  };
}
