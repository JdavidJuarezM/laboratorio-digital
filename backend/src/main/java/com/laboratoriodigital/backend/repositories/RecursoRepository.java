package com.laboratoriodigital.backend.repositories;


import com.laboratoriodigital.backend.models.Recurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecursoRepository extends JpaRepository<Recurso, Long> {
    List<Recurso> findByCategoria(String categoria);

}
