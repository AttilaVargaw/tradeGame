import { GameState } from "@Services/GameState/gameState";

export function ConvoyAI() {
  async function Udpate() {
    const convoys = await GameState.getConvoys();

    await Promise.all(
      convoys.map(async ({ route, posX, posY, ID, goalX, goalY }) => {
        const tradeRoute = await GameState.getTradeRoute(route);

        if (route) {
          const { cityAPosX, cityAPosY, cityBPosX, cityBPosY } = tradeRoute[0];
          if (cityAPosX === posX && cityAPosY === posY) {
            GameState.setConvoyGoal(ID, cityBPosX, cityBPosY);
          } else if (cityBPosX === posX && cityBPosY === posY) {
            GameState.setConvoyGoal(ID, cityAPosX, cityAPosY);
          } else if(!goalX && !goalY) {
            GameState.setConvoyGoal(ID, cityBPosX, cityBPosY);
          }
        }
      })
    );
  }

  return {
    Udpate,
  };
}
