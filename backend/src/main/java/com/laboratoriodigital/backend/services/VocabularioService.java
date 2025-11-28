package com.laboratoriodigital.backend.services;

import com.laboratoriodigital.backend.models.Categoria;
import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.Palabra;
import com.laboratoriodigital.backend.models.ProgresoVocabulario;
import com.laboratoriodigital.backend.repositories.CategoriaRepository;
import com.laboratoriodigital.backend.repositories.PalabraRepository;
import com.laboratoriodigital.backend.repositories.ProgresoVocabularioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class VocabularioService {

    @Autowired
    private ProgresoVocabularioRepository progresoRepository;
    @Autowired
    private PalabraRepository palabraRepository;
    @Autowired
    private CategoriaRepository categoriaRepository; // Inyectar nuevo repo
    @Autowired
    private MaestroService maestroService;

    // --- Lógica de Progreso (Existente) ---
    @Transactional
    public ProgresoVocabulario getProgreso(Long maestroId) {
        Maestro maestro = maestroService.findMaestroById(maestroId);
        return progresoRepository.findByMaestro(maestro)
                .orElse(new ProgresoVocabulario(maestro));
    }

    @Transactional
    public void saveScore(Long maestroId, Integer newScore, Integer streak) {
        Maestro maestro = maestroService.findMaestroById(maestroId);
        ProgresoVocabulario progreso = progresoRepository.findByMaestro(maestro)
                .orElse(new ProgresoVocabulario(maestro));

        if (newScore > progreso.getHighScore()) {
            progreso.setHighScore(newScore);
        }
        if (streak > progreso.getMaxStreak()) {
            progreso.setMaxStreak(streak);
        }
        progresoRepository.save(progreso);
    }
    // --- Lógica de Gestión de Palabras (Nuevo) ---
    public List<Palabra> obtenerPalabras() {
        Maestro maestro = maestroService.getCurrentMaestro();
        return palabraRepository.findByMaestro(maestro);
    }

    public Palabra guardarPalabra(Palabra palabra) {
        Maestro maestro = maestroService.getCurrentMaestro();
        palabra.setMaestro(maestro);
        // Normalizar a mayúsculas
        palabra.setPalabra(palabra.getPalabra().toUpperCase().trim());
        return palabraRepository.save(palabra);
    }

    public void eliminarPalabra(Long id) {
        // Validar que pertenezca al maestro (opcional pero recomendado)
        palabraRepository.deleteById(id);
    }

    // --- NUEVA LÓGICA DE CATEGORÍAS ---

    public List<Categoria> obtenerCategorias() {
        Maestro maestro = maestroService.getCurrentMaestro();
        return categoriaRepository.findByMaestro(maestro);
    }

    public Categoria guardarCategoria(String nombre) {
        Maestro maestro = maestroService.getCurrentMaestro();
        // Evitar duplicados
        return categoriaRepository.findByNombreAndMaestro(nombre, maestro)
                .orElseGet(() -> categoriaRepository.save(new Categoria(nombre, maestro)));
    }

    public void eliminarCategoria(Long id) {
        // Opcional: Podrías verificar si hay palabras usándola antes de borrar
        categoriaRepository.deleteById(id);
    }
}