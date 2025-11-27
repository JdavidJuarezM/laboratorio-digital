package com.laboratoriodigital.backend.services;

import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.ProgresoSupermercado;
import com.laboratoriodigital.backend.repositories.ProgresoSupermercadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SupermercadoService {

    @Autowired
    private ProgresoSupermercadoRepository repository;

    @Autowired
    private MaestroService maestroService;

    @Transactional
    public Integer getHighScore(Long maestroId) {
        Maestro maestro = maestroService.findMaestroById(maestroId);
        return repository.findByMaestro(maestro)
                .map(ProgresoSupermercado::getHighScore)
                .orElse(0);
    }

    @Transactional
    public void saveHighScore(Long maestroId, Integer newScore) {
        Maestro maestro = maestroService.findMaestroById(maestroId);

        ProgresoSupermercado progreso = repository.findByMaestro(maestro)
                .orElse(new ProgresoSupermercado(maestro));

        // Solo guardamos si la nueva puntuación es mayor a la actual
        if (newScore > progreso.getHighScore()) {
            progreso.setHighScore(newScore);
            repository.save(progreso);
        }
    }
}