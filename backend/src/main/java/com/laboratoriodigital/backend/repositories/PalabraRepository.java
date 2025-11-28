// backend/src/main/java/com/laboratoriodigital/backend/repositories/PalabraRepository.java
package com.laboratoriodigital.backend.repositories;

import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.Palabra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PalabraRepository extends JpaRepository<Palabra, Long> {
    List<Palabra> findByMaestro(Maestro maestro);
}