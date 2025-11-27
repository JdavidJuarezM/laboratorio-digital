package com.laboratoriodigital.backend.repositories;

import com.laboratoriodigital.backend.models.Alumno;
import com.laboratoriodigital.backend.models.Maestro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {
    // Buscar todos los alumnos de un maestro específico
    List<Alumno> findByMaestro(Maestro maestro);
}