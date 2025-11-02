// backend/src/main/java/com/laboratoriodigital/backend/repositories/ProgresoReciclajeRepository.java
package com.laboratoriodigital.backend.repositories;

import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.ProgresoReciclaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProgresoReciclajeRepository extends JpaRepository<ProgresoReciclaje, Long> {

    /**
     * Busca un registro de progreso de reciclaje por el maestro asociado.
     * Como la columna maestro_id es única, esto devolverá 0 o 1 resultado.
     * @param maestro El objeto Maestro al que pertenece el progreso.
     * @return Un Optional que contiene el ProgresoReciclaje si se encuentra.
     */
    Optional<ProgresoReciclaje> findByMaestro(Maestro maestro);
}