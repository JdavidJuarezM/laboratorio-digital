import React, {useState, useEffect} from "react";
import {
    getProductos,
    crearProducto,
    eliminarProducto,
    getCategoriasProductos,
    crearCategoriaProducto,
    eliminarCategoriaProducto
} from "../../../services/productosService";
import {PRODUCTS} from "../constants/gameData";

// Categorías base que siempre estarán disponibles
const CATEGORIAS_BASE = [
    "Frutas y Verduras",
    "Lácteos y Huevo",
    "Panadería y Dulces",
    "Bebidas",
    "Carnes y Comida",
    "Despensa y Limpieza",
    "Otros"
];

const PanelProductos = ({onClose}) => {
    const [productos, setProductos] = useState([]);
    const [categoriasDb, setCategoriasDb] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCategoryFilter, setActiveCategoryFilter] = useState("Todas");

    // Estado para nueva categoría
    const [isAddingCat, setIsAddingCat] = useState(false);
    const [newCatName, setNewCatName] = useState("");

    // Estado para nuevo producto
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        emoji: "",
        precio: "",
        categoria: "Otros"
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [prods, cats] = await Promise.all([
                getProductos(),
                getCategoriasProductos()
            ]);
            setProductos(prods);
            setCategoriasDb(cats);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Manejo de Categorías ---

    const handleSaveCategory = async () => {
        if (!newCatName.trim()) return;
        try {
            await crearCategoriaProducto(newCatName.trim());
            setNewCatName("");
            setIsAddingCat(false);
            // Recargar solo categorías
            const cats = await getCategoriasProductos();
            setCategoriasDb(cats);
        } catch (error) {
            alert("Error al guardar categoría");
        }
    };

    const handleDeleteCategory = async (cat) => {
        if (window.confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) {
            try {
                await eliminarCategoriaProducto(cat.id);
                const cats = await getCategoriasProductos();
                setCategoriasDb(cats);
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    const listaCategorias = [...CATEGORIAS_BASE, ...categoriasDb.map(c => c.nombre)];

    // --- Manejo de Productos ---

    const handleInputChange = (e) => {
        setNuevoProducto({...nuevoProducto, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nuevoProducto.nombre || !nuevoProducto.precio) return;

        await crearProducto(nuevoProducto);
        setNuevoProducto({nombre: "", emoji: "", precio: "", categoria: "Otros"});
        const prods = await getProductos();
        setProductos(prods);
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Eliminar este producto?")) {
            await eliminarProducto(id);
            const prods = await getProductos();
            setProductos(prods);
        }
    };

    const cargarDatosIniciales = async () => {
        if (!window.confirm("¿Cargar productos predeterminados?")) return;
        setLoading(true);
        try {
            const promesas = PRODUCTS.map(p => crearProducto({
                nombre: p.name,
                emoji: p.emoji,
                precio: p.price,
                categoria: p.categoria
            }));
            await Promise.all(promesas);
            alert("¡Listo!");
            cargarDatos();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrado
    const productosFiltrados = activeCategoryFilter === "Todas"
        ? productos
        : productos.filter(p => p.categoria === activeCategoryFilter);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white shadow-md z-10">
                    <h2 className="text-2xl font-bold flex items-center gap-2">🛒 Gestión del Supermercado</h2>
                    <button onClick={onClose}
                            className="text-white/80 hover:text-white text-2xl font-bold transition">&times;</button>
                </div>

                <div className="flex flex-1 overflow-hidden">

                    {/* SIDEBAR DE CATEGORÍAS */}
                    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-xs font-bold text-gray-400 uppercase">Filtros</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            <button
                                onClick={() => setActiveCategoryFilter("Todas")}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition ${activeCategoryFilter === "Todas" ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                📦 Todos
                            </button>

                            <div className="my-2 border-t border-gray-200"></div>

                            {CATEGORIAS_BASE.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategoryFilter(cat)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${activeCategoryFilter === cat ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}

                            {categoriasDb.length > 0 && <div className="my-2 border-t border-gray-200"></div>}

                            {categoriasDb.map(cat => (
                                <div key={cat.id} className="group relative">
                                    <button
                                        onClick={() => setActiveCategoryFilter(cat.nombre)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition pr-8 ${activeCategoryFilter === cat.nombre ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        ✨ {cat.nombre}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCategory(cat);
                                        }}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Agregar Categoría */}
                        <div className="p-3 border-t border-gray-200 bg-white">
                            {isAddingCat ? (
                                <div className="animate-fadeIn">
                                    <input
                                        autoFocus
                                        className="w-full border rounded p-1 text-sm mb-2"
                                        placeholder="Nueva categoría..."
                                        value={newCatName}
                                        onChange={e => setNewCatName(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSaveCategory()}
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveCategory}
                                                className="flex-1 bg-green-500 text-white text-xs py-1 rounded">Guardar
                                        </button>
                                        <button onClick={() => setIsAddingCat(false)}
                                                className="flex-1 bg-gray-200 text-xs py-1 rounded">Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAddingCat(true)}
                                    className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg text-sm font-bold hover:border-blue-400 hover:text-blue-500 transition"
                                >
                                    + Categoría
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ÁREA PRINCIPAL */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50">

                        {/* Formulario Agregar Producto */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
                            <h3 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
                                <span className="bg-green-100 text-green-600 p-1 rounded">➕</span> Agregar Producto
                            </h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                <div className="md:col-span-3">
                                    <label className="text-xs font-bold text-gray-500 block mb-1">NOMBRE</label>
                                    <input name="nombre" value={nuevoProducto.nombre} onChange={handleInputChange}
                                           className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                           placeholder="Ej: Manzana" required/>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 block mb-1">EMOJI</label>
                                    <input name="emoji" value={nuevoProducto.emoji} onChange={handleInputChange}
                                           className="w-full p-2 border rounded-lg text-center text-xl focus:ring-2 focus:ring-blue-100 outline-none"
                                           placeholder="🍎"/>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 block mb-1">PRECIO</label>
                                    <input name="precio" type="number" step="0.5" value={nuevoProducto.precio}
                                           onChange={handleInputChange}
                                           className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                           placeholder="0.00" required/>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="text-xs font-bold text-gray-500 block mb-1">CATEGORÍA</label>
                                    <select name="categoria" value={nuevoProducto.categoria}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-100 outline-none">
                                        {listaCategorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit"
                                            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 shadow-md transition transform active:scale-95">
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Lista de Productos */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-700">
                                Productos: {activeCategoryFilter} ({productosFiltrados.length})
                            </h3>
                            {productos.length < 5 && (
                                <button onClick={cargarDatosIniciales}
                                        className="text-xs text-blue-500 underline hover:text-blue-700">
                                    Cargar datos de ejemplo
                                </button>
                            )}
                        </div>

                        {loading ? <p className="text-center text-gray-400">Cargando...</p> : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {productosFiltrados.map((prod) => (
                                    <div key={prod.id}
                                         className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <span
                                                className="text-3xl bg-gray-50 p-2 rounded-lg">{prod.emoji || "📦"}</span>
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-800 truncate text-sm">{prod.nombre}</p>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span
                                                        className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">${prod.precio}</span>
                                                    <span
                                                        className="text-gray-400 truncate max-w-[80px]">{prod.categoria}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleEliminar(prod.id)}
                                                className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PanelProductos;