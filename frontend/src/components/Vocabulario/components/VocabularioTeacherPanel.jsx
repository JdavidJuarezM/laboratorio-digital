// frontend/src/components/Vocabulario/components/VocabularioTeacherPanel.jsx
import React, {useState, useEffect} from "react";
import {motion} from "framer-motion";
import {
    getPalabras,
    guardarPalabra,
    eliminarPalabra,
    getCategorias,
    guardarCategoria,
    eliminarCategoria
} from "../services/vocabularioService";
import {words as defaultWords} from "../constants/wordList";

const VocabularioTeacherPanel = ({isOpen, onClose}) => {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Todas");

    // Estado de datos
    const [palabras, setPalabras] = useState([]);
    const [dbCategories, setDbCategories] = useState([]); // Categorías de la BD
    const [loading, setLoading] = useState(false);

    // Formulario nueva palabra
    const [newWord, setNewWord] = useState({
        palabra: "",
        dificultad: "easy",
        categoria: "", // Se llenará dinámicamente
        imagenUrl: "",
    });

    // Categorías base (siempre visibles)
    const defaultCategories = [
        "Animales", "Comida", "Naturaleza",
        "Objetos", "Ropa", "Cuerpo", "Transporte",
        "Personajes", "Instrumentos"
    ];

    // Carga inicial de datos
    useEffect(() => {
        if (isAuthenticated) {
            cargarDatos();
        }
    }, [isAuthenticated]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            // 1. Cargar Categorías Personalizadas
            const cats = await getCategorias();
            setDbCategories(cats);

            // 2. Cargar Palabras
            const dynamicWords = await getPalabras();

            // Mapeo palabras estáticas (del archivo local)
            const mappedDefaults = defaultWords.map(w => ({
                ...w,
                isDynamic: false,
                id: `def-${w.word}`
            }));

            // Mapeo palabras dinámicas (de la BD)
            const mappedDynamic = dynamicWords.map(w => ({
                id: w.id,
                word: w.palabra,
                image: w.imagenUrl,
                difficulty: w.dificultad,
                category: w.categoria,
                isDynamic: true
            }));

            setPalabras([...mappedDynamic, ...mappedDefaults]);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Usa la variable de entorno o un fallback
        if (password === (import.meta.env.VITE_TEACHER_CODE || "PROFE123")) {
            setIsAuthenticated(true);
        } else {
            alert("Código incorrecto");
        }
    };

    // --- MÉTODOS DE CATEGORÍA ---

    const handleAddCategory = async () => {
        const nombre = prompt("Nombre de la nueva categoría:");
        if (nombre) {
            try {
                await guardarCategoria(nombre);
                cargarDatos(); // Recargar para ver la nueva categoría
                alert("Categoría creada!");
            } catch (error) {
                alert("Error al crear categoría");
            }
        }
    };

    const handleDeleteCategory = async (catObj) => {
        if (window.confirm(`¿Eliminar la categoría "${catObj.nombre}"?`)) {
            try {
                await eliminarCategoria(catObj.id);
                if (activeCategory === catObj.nombre) setActiveCategory("Todas");
                cargarDatos();
            } catch (error) {
                alert("Error al eliminar categoría");
            }
        }
    };

    // --- MÉTODOS DE PALABRA ---

    const handleAddWord = async (e) => {
        e.preventDefault();
        // Validaciones básicas
        if (!newWord.palabra || !newWord.imagenUrl || !newWord.categoria) {
            alert("Por favor completa todos los campos (incluyendo categoría)");
            return;
        }

        try {
            await guardarPalabra({
                palabra: newWord.palabra,
                dificultad: newWord.dificultad,
                categoria: newWord.categoria,
                imagenUrl: newWord.imagenUrl
            });
            alert("Palabra agregada correctamente");
            setNewWord({...newWord, palabra: "", imagenUrl: ""});
            cargarDatos();
        } catch (error) {
            alert("Error al agregar palabra");
        }
    };

    const handleDeleteWord = async (id, isDynamic) => {
        if (!isDynamic) {
            alert("No se pueden eliminar las palabras predeterminadas del sistema.");
            return;
        }
        if (window.confirm("¿Eliminar esta palabra permanentemente?")) {
            try {
                await eliminarPalabra(id);
                cargarDatos();
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    // Lista combinada de nombres de categorías para el dropdown y sidebar
    // (Base + BD, eliminando duplicados si hubiera colisión de nombres)
    const allCategoryNames = Array.from(new Set([
        ...defaultCategories,
        ...dbCategories.map(c => c.nombre)
    ]));

    const filteredWords = activeCategory === "Todas"
        ? palabras
        : palabras.filter(p => p.category === activeCategory);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
                initial={{scale: 0.95, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
                <div className="bg-purple-600 p-4 flex justify-between items-center text-white shadow-md z-10">
                    <h2 className="text-xl font-bold flex items-center gap-2">⚙️ Panel de Vocabulario</h2>
                    <button onClick={onClose}
                            className="text-2xl font-bold hover:text-purple-200 transition">&times;</button>
                </div>

                {!isAuthenticated ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border text-center">
                            <h3 className="text-2xl mb-6 text-gray-700 font-bold">🔒 Acceso Maestro</h3>
                            <form onSubmit={handleLogin} className="flex gap-2">
                                <input
                                    type="password"
                                    className="border-2 border-gray-200 p-3 rounded-xl focus:border-purple-500 outline-none"
                                    placeholder="Ingresa tu código..."
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-xl font-bold transition">
                                    Entrar
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full overflow-hidden">

                        {/* SIDEBAR */}
                        <div
                            className="w-64 bg-gray-50 p-4 overflow-y-auto border-r border-gray-200 flex flex-col gap-1">
                            <h3 className="font-bold text-gray-400 text-xs uppercase mb-2 px-2">Categorías</h3>

                            <button
                                onClick={() => setActiveCategory("Todas")}
                                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeCategory === "Todas" ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                📂 Todas
                            </button>

                            {/* Categorías Base */}
                            {defaultCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}

                            {/* Categorías Personalizadas (con botón de borrar) */}
                            {dbCategories.map(cat => (
                                <div key={cat.id} className="group relative">
                                    <button
                                        onClick={() => setActiveCategory(cat.nombre)}
                                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all pr-8 ${activeCategory === cat.nombre ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        ✨ {cat.nombre}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCategory(cat);
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Borrar categoría"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            {/* Botón Agregar Categoría */}
                            <button
                                onClick={handleAddCategory}
                                className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all text-sm font-bold flex items-center justify-center gap-2"
                            >
                                <span>+</span> Nueva Categoría
                            </button>
                        </div>

                        {/* AREA PRINCIPAL */}
                        <div className="flex-1 p-6 overflow-y-auto bg-white">

                            {/* Formulario Agregar Palabra */}
                            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 mb-8 shadow-sm">
                                <h4 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                                    <span className="bg-purple-200 p-1 rounded text-lg">📝</span> Agregar Nueva Palabra
                                </h4>
                                <form onSubmit={handleAddWord} className="grid grid-cols-1 md:grid-cols-12 gap-4">

                                    {/* Nombre */}
                                    <div className="md:col-span-3">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Palabra</label>
                                        <input
                                            placeholder="Ej: ELEFANTE"
                                            className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-purple-400 outline-none uppercase font-bold text-gray-700"
                                            value={newWord.palabra}
                                            onChange={e => setNewWord({
                                                ...newWord,
                                                palabra: e.target.value.toUpperCase()
                                            })}
                                            required
                                        />
                                    </div>

                                    {/* Imagen */}
                                    <div className="md:col-span-4">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">URL Imagen</label>
                                        <input
                                            placeholder="https://..."
                                            className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-purple-400 outline-none text-sm"
                                            value={newWord.imagenUrl}
                                            onChange={e => setNewWord({...newWord, imagenUrl: e.target.value})}
                                            required
                                        />
                                    </div>

                                    {/* Selectores */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Dificultad</label>
                                        <select
                                            className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-purple-400 outline-none bg-white text-sm"
                                            value={newWord.dificultad}
                                            onChange={e => setNewWord({...newWord, dificultad: e.target.value})}
                                        >
                                            <option value="easy">Fácil</option>
                                            <option value="medium">Normal</option>
                                            <option value="hard">Difícil</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-3">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Categoría</label>
                                        <select
                                            className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-purple-400 outline-none bg-white text-sm"
                                            value={newWord.categoria}
                                            onChange={e => setNewWord({...newWord, categoria: e.target.value})}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            {allCategoryNames.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        className="md:col-span-12 bg-green-500 text-white font-bold py-3 rounded-xl mt-2 hover:bg-green-600 shadow-md transition-transform active:scale-95">
                                        Guardar Palabra
                                    </button>
                                </form>
                            </div>

                            {/* Grid de Resultados */}
                            <div className="mb-4 flex justify-between items-end border-b pb-2">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {activeCategory === "Todas" ? "Todas las Palabras" : `Categoría: ${activeCategory}`}
                                </h3>
                                <span className="text-sm text-gray-500 font-bold bg-gray-100 px-3 py-1 rounded-full">
                  {filteredWords.length} palabras
                </span>
                            </div>

                            {loading ? (
                                <div className="text-center py-10 text-gray-400">Cargando...</div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {filteredWords.map((word) => (
                                        <div
                                            key={word.id}
                                            className={`border-2 rounded-xl p-3 relative group transition-all hover:shadow-lg ${word.isDynamic ? 'bg-white border-purple-100' : 'bg-gray-50 border-gray-100 opacity-90'}`}
                                        >
                                            <div
                                                className="aspect-square w-full rounded-lg overflow-hidden mb-3 bg-gray-100 relative">
                                                <img src={word.image} alt={word.word}
                                                     className="w-full h-full object-cover"/>
                                                <div
                                                    className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase shadow-sm ${
                                                        word.difficulty === 'easy' ? 'bg-green-500' : word.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}>
                                                    {word.difficulty === 'medium' ? 'Normal' : word.difficulty === 'easy' ? 'Fácil' : 'Difícil'}
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <div
                                                    className="font-extrabold text-gray-800 text-lg mb-1 truncate">{word.word}</div>
                                                <div
                                                    className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block truncate max-w-full">
                                                    {word.category}
                                                </div>
                                            </div>

                                            {/* Botón Eliminar solo para dinámicas */}
                                            {word.isDynamic && (
                                                <button
                                                    onClick={() => handleDeleteWord(word.id, word.isDynamic)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md transform scale-0 group-hover:scale-100 transition-transform hover:bg-red-600 z-10"
                                                    title="Eliminar Palabra"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VocabularioTeacherPanel;