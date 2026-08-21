import { Navigate, Route,Routes } from "react-router-dom";
import {lazy, Suspense} from "react";

const MapPage = lazy(() => import("@/pages/map/ui/page").then((module) => ({default:module.MapPage})))

export function AppRouter()
{
    return (
        <Routes>
            <Route path = "/map" element = {
                <Suspense fallback = {<p>Загркзка</p>}>
                <MapPage/>
                </Suspense>
            }/>

            <Route path ="*" element = {<span>Не известгнпч ошибка</span>}/>
        </Routes>
    )
}