// src/components/DashboardWelcome.jsx

import React from "react";
import {useAuth} from "../context/AuthContext";
import GameCard from "./DashboardWelcome/GameCard";
import {
    HuertoIcon,
    SupermercadoIcon,
    ResourcesIcon,
    RocketIcon,
    LogoutIcon,
    VocabularioIcon,
    ReciclajeIcon,
} from "./Icons";

const DashboardWelcome = () => {
    const {logout} = useAuth();

    return (
        <div className="w-full max-w-5xl mx-auto z-10">
            <header className="text-center mb-12">
                <div className="mascot-float w-28 h-28 mx-auto mb-4 text-7xl flex items-center justify-center">
                    <RocketIcon/>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
                    Elige tu Aventura
                </h1>
                <p className="text-indigo-200 text-xl mt-2">
                    ¡Haz clic en un juego para empezar a aprender!
                </p>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                <GameCard
                    icon={
                        <HuertoIcon className="w-16 h-16 text-5xl flex items-center justify-center"/>
                    }
                    title="Mi Invernadero Virtual"
                    description="Aprende sobre el crecimiento de las plantas mientras cuidas tu propio huerto virtual."
                    buttonColor="bg-green-500 hover:bg-green-600"
                    linkTo="/dashboard/huerto"
                />

                <GameCard
                    icon={
                        <VocabularioIcon className="w-16 h-16 text-5xl flex items-center justify-center"/>
                    }
                    title="Juego de Vocabulario"
                    description="Ordena las letras y aprende nuevas palabras de manera divertida."
                    buttonColor="bg-blue-500 hover:bg-blue-600"
                    linkTo="/dashboard/vocabulario"
                />

                <GameCard
                    icon={
                        <SupermercadoIcon className="w-16 h-16 text-5xl flex items-center justify-center"/>
                    }
                    title="Super Mercado"
                    description="Resuelve problemas matematicos para añadir los productos a tu carrito y completar la lista del super."
                    buttonColor="bg-yellow-500 hover:bg-yellow-600"
                    linkTo="/dashboard/supermercado"
                />


                <GameCard
                    icon={
                        <ReciclajeIcon className="w-16 h-16 text-5xl flex items-center justify-center"/>
                    }
                    title="Misión Reciclaje"
                    description="Clasifica la basura en los contenedores y aprende a reciclar correctamente."
                    buttonColor="bg-green-500 hover:bg-green-600"
                    linkTo="/dashboard/reciclaje"
                />

                <GameCard
                    icon={
                        <ResourcesIcon className="w-16 h-16 text-5xl flex items-center justify-center"/>
                    }
                    title="Baúl Mágico"
                    description="Encuentra el secreto para ser el mejor de la clase repasando el material compartido por tus maestros."
                    buttonColor="bg-purple-500 hover:bg-purple-600"
                    linkTo="/dashboard/recursos"
                />
            </main>

            <footer className="text-center mt-12">
                <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 bg-red-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                    <LogoutIcon className="h-5 w-5 text-xl"/>
                    Cerrar Sesión
                </button>
            </footer>
        </div>
    );
};

export default DashboardWelcome;