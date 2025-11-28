package com.laboratoriodigital.backend.repositories;

import com.laboratoriodigital.backend.models.Categoria;
import com.laboratoriodigital.backend.models.Maestro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByMaestro(Maestro maestro);
    Optional<Categoria> findByNombreAndMaestro(String nombre, Maestro maestro);
}