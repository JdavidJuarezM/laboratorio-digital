// backend/src/main/java/com/laboratoriodigital/backend/repositories/ProgresoReciclajeRepository.java
package com.laboratoriodigital.backend.repositories;

import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.ProgresoReciclaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProgresoReciclajeRepository extends JpaRepository<ProgresoReciclaje, Long> {

    Optional<ProgresoReciclaje> findByMaestro(Maestro maestro);
}
