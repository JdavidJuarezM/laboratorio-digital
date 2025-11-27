package com.laboratoriodigital.backend.repositories;

import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.ProgresoVocabulario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProgresoVocabularioRepository extends JpaRepository<ProgresoVocabulario, Long> {
    Optional<ProgresoVocabulario> findByMaestro(Maestro maestro);
}