import { useMemo, useState, type FormEvent } from "react";
import { ZonesMap } from "./zone-map";
import {type Zone, type Position } from "@/entities/zone";
import {ArrowsClockwiseIcon, PlusIcon} from "@phosphor-icons/react"
import { PentagonIcon, TrashIcon, XIcon } from "lucide-react";


export function MapPage()
{
    const [zones,setZones] = useState<Zone[]>([]);
    const [selectedZoneId,setSelectedZoneId] = useState<string | null>(null);
    const [draftCoordinates,setDraftCoordinated] = useState<Position[]>([])
    const [isCreating,setIsCreating] = useState(false);
    const [drawRevision, setDrawRevision] = useState(0);
    const [drafrName, setDraftName] = useState("");

    const selectedZone = useMemo(() => zones.find(zone => zone.id === selectedZoneId) ?? null
    , [selectedZoneId,zones]);

    const panelOpen = isCreating || Boolean(selectedZone);

    const SaveZone = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const zone = {id: Date.now().toString(36),
            name: "",
            updatedAt: new Date().toISOString(),
            coordinates: draftCoordinates
        };
        const nextZone = [zone, ...zones];
        setZones(nextZone);
        setIsCreating(false);
        setSelectedZoneId(null);
    };

    const startCreating = () =>{
        setSelectedZoneId(null);
        setDraftCoordinated([]);
        setIsCreating(true);
        setDrawRevision((revision)=>revision + 1);
    }

    const closePanel = () => 
    {
        setIsCreating(false);
        setSelectedZoneId(null);
        setDraftCoordinated([]);
    }

const deleteZone = () =>
{
    if (!selectedZone || !window.confirm(`Удалить зону"${selectedZone.name}"`))
        return;

    const nextZones = zones.filter((zone) => zone.id !== selectedZone.id );
    setZones(nextZones);
    setSelectedZoneId(null);

}

    return <main className="h-dvh w-full overflow-hidden relatives"> <ZonesMap
        zones = {zones}
        selectedZoneId={selectedZoneId}
        isCreating = {isCreating}
        drawRevision={ drawRevision}
        onSelectZone={setSelectedZoneId}
        onDraftChange={setDraftCoordinated}
    />

{panelOpen && (
    <aside className={"absolute inset-x-0 bottom-0 z-30 flex h-[48dvh] flex-col border-t border-neutral-200 bg-white shadow-xl"}>
        <div className = {"flex items-center justify-between border-b border-neutral-200 px-5 py-4"}>
            <div> 
            <p className="text-xs font-medium uppercase text-neutral-500">
                {
                    isCreating ? "Новая зона" : "Полигонная зона"
                }
                <h1 className="mt-1 max-w-[270px] trucate text-lg font-semibold">
                    ${isCreating ? "Добавление": selectedZone?.name}
                </h1>
            </p>
            </div>
            <button type = "button"
            onClick={closePanel}
            className={"grid size-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"}>
                <XIcon size={20}/>
            </button>

            {isCreating ? (
                <form className="flex flex-col flex-1 min-h-0" onSubmit={SaveZone} noValidate>
                    <div className="min-h-0 flex-1 overflow-y-auto p-5">
                        <label htmlFor="zone-name" className="mb-2 block text-sm font-medium">Название</label>
                        <input
                        type="text"
                        id = "zone-name"
                        value={drafrName}
                        onChange={(e) => {
                            setDraftName(e.currentTarget.value);
                        }}
                        placeholder=" НАпример, Зона доставки"
                        maxLength={80}
                        autoFocus
                        className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none"
                        />
                        <div className="mt-6 border-t border-neutral-200 pt-500">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm font-medium">Полигон</p>
                                <p className="mt-1 text-sm text-neutral-500"> {draftCoordinates.length} вершин</p>

                                <button
                                type="button"
                                onClick={() => {
                                    setDraftCoordinated([])
                                    setDrawRevision(revision => revision +1);
                                }}
                                className={"flex h-9 items-center gap-2 rounded-md border border-neutral-300 px-3 text-xs font-medium"}>
                                    {draftCoordinates.length > 0 ? <ArrowsClockwiseIcon size={32}/> : <PentagonIcon size={15}/>}
                                    {draftCoordinates.length > 0 ? "Перерисовать":"Рисовать"}
                                </button>
                            </div>
                                <p className ="mt-4 text-ms leading-5 text-neutral-500">Расставьте точки на карте и замкните контур кликом по первой точке</p>
                        </div>
                                <div className="flex gap-3 border-t border-neutral-200">
                                    <button
                                        type="button"
                                        onClick={closePanel}
                                        className="h-10 flex-1 rounded-md border border-neutral-300 px-4 text-sm font-medium"
                                        >Добавить</button>
                                    <button
                                    type="submit"
                                    className="h-10 flex-1 rounded-md bg-emerald-700 px-4 text-sm font-medium text-white"
                                    >Отменить</button>
                                </div>
                        </div>
                </form>
            ): selectedZone ?(
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
                    <div className="">
                        <dt className="text-xd text-neutral-500">тип</dt>
                        <dd className="mt-1 text-xs font-medium">полигон</dd>
                    </div>
                     <div className="">
                        <dt className="text-xd text-neutral-500">Вершины</dt>
                        <dd className="mt-1 text-xs font-medium">{selectedZone.coordinates.length}</dd>
                    </div>
                     <div className="">
                        <dt className="text-xd text-neutral-500">Изменнено</dt>
                        <dd className="mt-1 text-xs font-medium"><p>{(selectedZone.updatedAt)}</p></dd>
                    </div>
                </dl>
                <div className={"mt-6 border-t border-neutral-200 pt-5"}>
                    <p className="text-sm font-medium">Координаты</p>
                    <ol className="mt-3 space-y-2 font-mono text-sx text-neutral-600">
                        {selectedZone.coordinates.map(([LogIn,lat],index) =>(
                            <li className={"flex items-center justy-between gap-3 border-b border-neutral-100 pb-2"}>
                                <span className="text-neutral-400">{index+1}</span>
                                <span>{LogIn.toFixed(6)},{lat.toFixed(6)}</span>
                        </li>
                        ))}
                    </ol>
                </div>
            </div>

            <div className="border-t border-neutral-200 p-4">
                <button
                    type ="button"
                    onClick={deleteZone}
                     className="h-10 flex-1 rounded-md bg-emerald-700 px-4 text-sm font-medium text-white">
                        <TrashIcon size={16}/>
                        удалить зону
                </button>
                </div>        

        </div>
        ): (null)}
        </div>
    </aside>
)}

    <button 
    className={[
        "absolute z-20 left-0 flrx h-12 item-center gap-2 rounded-md bg-emerald-700 px-4",
    ` text-dm font-drmibold text-white ${
        panelOpen 
        ? "bottom-[calc(48fvh+2rem)] tight-4"
        : "bottom-6 right-6"
    }`].join(" ")} onClick = {startCreating}>
        <PlusIcon size = {24}/>

        Добавить
    </button>



   
    </main>
}

