package com.laboratoriodigital.backend.repositories;


import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.ProgresoHuerto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProgresoHuertoRepository  extends JpaRepository<ProgresoHuerto, Long> {

    Optional<ProgresoHuerto> findByMaestro(Maestro maestro);

}
