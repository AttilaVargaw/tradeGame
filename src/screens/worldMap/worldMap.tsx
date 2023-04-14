
import React, { useCallback, useContext, useEffect, useState } from "react"
import CityDataModal from "../../modals/cityDataModal";
import { SelectedCityContext } from "./selectedCityContext";
import { GameStateContext } from "Services/GameState/gameState";
import SideMenu, { SideMenuItem } from "./sideMenu";
import { CRS, LeafletMouseEventHandlerFn } from "leaflet";
import { RouteLayer } from "./routeLayer";
import { CityPositionProperty } from "Services/GameState/dbTypes";
import { addToContextMenu, setContextMenuPosition } from "Services/contextMenu";
import { SelectedTradeRouteContext } from "./selectedTradeRouteContext";
import TradeRouteModal from "../../modals/tradeRouteModal";
import { ConvoyModal } from "../../modals/convoysModal";
import { VehicleBuyModal } from "../../modals/vehicleBuyModal";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { TopMenu } from "../../components/topMenu";
import Container from "react-bootstrap/esm/Container";
import { Circle, ImageOverlay, MapContainer, Tooltip } from "react-leaflet";

export const CityColors: { [key: string]: string } = {
    Mine: 'black',
    Metropolis: 'blue',
    MiningTown: 'red',
    MiningColony: 'yellow',
    MilitaryBase: 'white',
    ResearchStation: 'grey',
    RandomEncounter: 'gold'
}

export function WorldMap(): JSX.Element {
    const gameState = useContext(GameStateContext)

    const [currentCity, setCurrentCity] = useState<string>('')
    const [currentTradeRoute, setCurrentTradeRoute] = useState<string>('')
    const [citiesGeoJson, setCitiesGeoJson] = useState<GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>>()
    const [selectedCities, setSelectedCities] = useState<string[]>(['', ''])
    const [showConvoyModal, setShowConvoyModal] = useState(false)
    const [showVehicleBuyModal, setShowVehicleBuyModal] = useState(false)

    useEffect(() => {
        gameState.getCitiesAsGeoJson().then(setCitiesGeoJson)
    }, [])

    useEffect(() => {
        const onClick = () => {
            gameState.addTradeRoute(selectedCities)
            setContextMenuPosition(null)
        }

        return addToContextMenu({ disabled: false, labelKey: 'addRoute', onClick })
    }, [selectedCities])

    useEffect(() => {
        /*const keypressHandler = ({ code }: KeyboardEvent) => {
            setTimeout(() => {
                switch (code) {
                    case 'NumpadAdd':
                    case 'NumpadSubtract':
                        break
                    case 'KeyW':
                        break
                    case 'KeyS':
                        break
                    case 'KeyA':
                        break
                    case 'KeyD':
                }
            }, 0);
        }

        window.addEventListener('keypress', keypressHandler)
        return () => window.removeEventListener('keypress', keypressHandler)*/
        const contextMenuHandler: EventListenerOrEventListenerObject = function (event) {
            // alert("You've tried to open context menu"); //here you draw your own menu
            event.preventDefault();
            return false;
        }

        document.addEventListener(
            "contextmenu",
            contextMenuHandler,
            // { capture: true }
        );

        return () => window.removeEventListener('contextmenu', contextMenuHandler)
    }, [])

    const onDoubleClick = useCallback((city: string): LeafletMouseEventHandlerFn => () => {
        setCurrentCity(citiesGeoJson?.features.find(({ properties: { ID } }) => ID === city)?.properties.ID || '')
    }, [citiesGeoJson])

    const onCityClick = useCallback((ID: string): LeafletMouseEventHandlerFn => () => {
        setSelectedCities((s) => ([s[1], ID]))
    }, [])

    const onContextMenu = useCallback<React.MouseEventHandler<HTMLDivElement>>(({ nativeEvent: { clientX, clientY } }) => {
        setContextMenuPosition([clientX, clientY])
    }, [])

    const hideContextMenu = useCallback(() => {
        setContextMenuPosition(null)
    }, [])

    const [height, setHeight] = useState(window.innerHeight)
    const [width, setWidth] = useState(window.innerWidth)

    useCallback(() => {
        const eventHandler = () => {
            const { innerHeight, innerWidth } = window

            setHeight(innerHeight)
            setWidth(innerWidth)

            console.log('resize')
        }

        window.addEventListener('resize', eventHandler)

        return () => window.removeEventListener('resize', eventHandler)
    }, [])

    return <Container fluid="auto">
        {currentCity && <SelectedCityContext.Provider value={currentCity} >
            <CityDataModal isOpen={!!currentCity} onRequestClose={() => setCurrentCity('')} />
        </SelectedCityContext.Provider>}
        <ConvoyModal isOpen={showConvoyModal} onRequestClose={() => { setShowConvoyModal(false) }} />
        <VehicleBuyModal isOpen={showVehicleBuyModal} onRequestClose={() => { setShowVehicleBuyModal(false) }} />
        <Row style={{ borderTop: 0, background: 'white', width: `${(width) - 6}px`, boxSizing: 'border-box', height: `${height * 1 / 12}px`, margin: 0, color: 'white', border: '2px', borderColor: 'black', borderStyle: 'ridge', paddingTop: '2em' }}>
            <TopMenu />
        </Row>
        <Row style={{ padding: 0, margin: 0 }}>
            <Col lg="10" style={{ padding: 0, margin: 0 }} onContextMenu={onContextMenu} onClick={hideContextMenu}>
                <MapContainer doubleClickZoom={false} scrollWheelZoom zoomDelta={2} maxBounds={[[0, 0], [973, 1920]]} maxBoundsViscosity={100} crs={CRS.Simple} style={{ width: `${(width * 5 / 6)}px`, height: `${height * 11 / 12}px`, background: '#05001f' }} center={[500, 1650]} zoom={1} minZoom={1}>
                    <ImageOverlay url="lava_sea.png" bounds={[[0, 0], [973, 1920]]}>
                        {citiesGeoJson && citiesGeoJson.features.map(({ geometry: { coordinates: [posX, posY] }, properties: { ID, name, type } }) => {
                            return <Circle color={CityColors[type]} eventHandlers={{ dblclick: onDoubleClick(ID), click: onCityClick(ID) }} key={ID} center={[posY, posX]} radius={8}>
                                <Tooltip permanent>
                                    {type !== 'RandomEncounter' ? name : 'Random Encounter'}
                                </Tooltip>
                                {(selectedCities[0] === ID || selectedCities[1] === ID) &&
                                    <Circle eventHandlers={{ dblclick: onDoubleClick(ID) }} pathOptions={{ dashOffset: '10', dashArray: '5 10' }} color={CityColors[type]} key={ID} center={[posY, posX]} radius={10} />}
                            </Circle>
                        })}
                    </ImageOverlay>
                    <SelectedTradeRouteContext.Provider value={currentTradeRoute}>
                        <RouteLayer onRouteClick={setCurrentTradeRoute} />
                        <TradeRouteModal onRequestClose={() => setCurrentTradeRoute('')} isOpen={!!currentTradeRoute} />
                    </SelectedTradeRouteContext.Provider>
                </MapContainer>
            </Col>
            <Col lg="2" style={{ background: 'white', border: '2px', borderTop: 0, borderColor: 'black', borderStyle: 'ridge', paddingTop: '2em', boxSizing: 'border-box', margin: 0, width: `${(width / 6) - 6}px` }}>
                <SideMenu>
                    <SideMenuItem onClick={() => { setShowConvoyModal(true) }} label="Convoys" />
                    <SideMenuItem onClick={() => { setShowVehicleBuyModal(true) }} label="New Vehicle" />
                </SideMenu>
            </Col>
        </Row>
    </Container>
} 
