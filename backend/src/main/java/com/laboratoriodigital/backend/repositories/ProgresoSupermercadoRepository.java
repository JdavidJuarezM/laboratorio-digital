package com.laboratoriodigital.backend.repositories;

import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.ProgresoSupermercado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProgresoSupermercadoRepository extends JpaRepository<ProgresoSupermercado, Long> {
    Optional<ProgresoSupermercado> findByMaestro(Maestro maestro);
}