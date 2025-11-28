package com.laboratoriodigital.backend.repositories;

import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.Pregunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PreguntaRepository extends JpaRepository<Pregunta, Long> {
    List<Pregunta> findByMaestro(Maestro maestro);
    void deleteByMaestro(Maestro maestro);
}