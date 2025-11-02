// backend/src/main/java/com/laboratoriodigital/backend/services/ReciclajeService.java
package com.laboratoriodigital.backend.services;

import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.ProgresoReciclaje;
import com.laboratoriodigital.backend.repositories.ProgresoReciclajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReciclajeService {

    @Autowired
    private ProgresoReciclajeRepository progresoReciclajeRepository;

    @Autowired
    private MaestroService maestroService; // Usamos el nuevo servicio centralizado

    /**
     * Obtiene o crea el progreso de reciclaje para un maestro específico.
     * @param maestroId El ID del maestro.
     * @return El objeto ProgresoReciclaje (existente o nuevo).
     */
    @Transactional
    public ProgresoReciclaje getOrCreateProgreso(Long maestroId) {
        Maestro maestro = maestroService.findMaestroById(maestroId);

        // Busca el progreso. Si no existe, crea uno nuevo.
        return progresoReciclajeRepository.findByMaestro(maestro)
                .orElseGet(() -> {
                    ProgresoReciclaje nuevoProgreso = new ProgresoReciclaje(maestro);
                    return progresoReciclajeRepository.save(nuevoProgreso);
                });
    }

    /**
     * Obtiene la puntuación más alta (high score) de un maestro.
     * @param maestroId El ID del maestro.
     * @return El high score (Integer).
     */
    @Transactional
    public Integer getHighScore(Long maestroId) {
        ProgresoReciclaje progreso = getOrCreateProgreso(maestroId);
        return progreso.getHighScore();
    }

    /**
     * Guarda un nuevo score si es más alto que el high score existente.
     * @param maestroId El ID del maestro.
     * @param newScore El nuevo score obtenido en el juego.
     * @return El objeto ProgresoReciclaje actualizado.
     */
    @Transactional
    public ProgresoReciclaje saveHighScore(Long maestroId, Integer newScore) {
        if (newScore == null || newScore <= 0) {
            throw new IllegalArgumentException("El score debe ser un número positivo.");
        }

        ProgresoReciclaje progreso = getOrCreateProgreso(maestroId);

        // Solo actualiza si el nuevo score es mayor
        if (newScore > progreso.getHighScore()) {
            progreso.setHighScore(newScore);
            return progresoReciclajeRepository.save(progreso);
        }

        return progreso; // Devuelve el progreso sin cambios si el score no fue mayor
    }
}