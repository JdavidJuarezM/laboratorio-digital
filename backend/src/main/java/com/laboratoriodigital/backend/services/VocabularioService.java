package com.laboratoriodigital.backend.services;

import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.ProgresoVocabulario;
import com.laboratoriodigital.backend.repositories.ProgresoVocabularioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VocabularioService {

    @Autowired
    private ProgresoVocabularioRepository repository;

    @Autowired
    private MaestroService maestroService;

    @Transactional
    public ProgresoVocabulario getProgreso(Long maestroId) {
        Maestro maestro = maestroService.findMaestroById(maestroId);
        return repository.findByMaestro(maestro)
                .orElse(new ProgresoVocabulario(maestro));
    }

    @Transactional
    public void saveScore(Long maestroId, Integer newScore, Integer streak) {
        Maestro maestro = maestroService.findMaestroById(maestroId);
        ProgresoVocabulario progreso = repository.findByMaestro(maestro)
                .orElse(new ProgresoVocabulario(maestro));

        // Solo actualizamos si el nuevo puntaje o racha es mejor
        if (newScore > progreso.getHighScore()) {
            progreso.setHighScore(newScore);
        }
        if (streak > progreso.getMaxStreak()) {
            progreso.setMaxStreak(streak);
        }

        repository.save(progreso);
    }
}