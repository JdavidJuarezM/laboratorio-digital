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
    private MaestroService maestroService;


    @Transactional
    public ProgresoReciclaje getOrCreateProgreso(Long maestroId) {
        Maestro maestro = maestroService.findMaestroById(maestroId);


        return progresoReciclajeRepository.findByMaestro(maestro)
                .orElseGet(() -> {
                    ProgresoReciclaje nuevoProgreso = new ProgresoReciclaje(maestro);
                    return progresoReciclajeRepository.save(nuevoProgreso);
                });
    }


    @Transactional
    public Integer getHighScore(Long maestroId) {
        ProgresoReciclaje progreso = getOrCreateProgreso(maestroId);
        return progreso.getHighScore();
    }


    @Transactional
    public ProgresoReciclaje saveHighScore(Long maestroId, Integer newScore) {
        if (newScore == null || newScore <= 0) {
            throw new IllegalArgumentException("El score debe ser un número positivo.");
        }

        ProgresoReciclaje progreso = getOrCreateProgreso(maestroId);


        if (newScore > progreso.getHighScore()) {
            progreso.setHighScore(newScore);
            return progresoReciclajeRepository.save(progreso);
        }

        return progreso;
    }
}