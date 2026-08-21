import { useState } from "react";
import { ZonesMap } from "./zone-map";
import {type Position } from "@/entities/zone";


export function MapPage()
{
    const [zones,setZones] = useState([]);
    const [selectedZoneId,setSelectedZoneId] = useState<string | null>(null);
    const [draftCoordinates,setDraftCoordinated] = useState<Position[]>([])
    return <main className="h-dvh w-full overflow-hidden relatives"> <ZonesMap
        zones = {zones}
        selectedZoneId={selectedZoneId}
        isCreating = {true}
        drawRevision={ 0}
        onSelectZone={setSelectedZoneId}
        onDraftChange={setDraftCoordinated}
    />
    </main>
}